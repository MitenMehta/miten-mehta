import { authenticate, authorize, type Principal } from "./security";
import { Audit, errorResponse, json, requestId, withHeaders } from "./runtime";
import { handleMcp } from "./mcp";
import { stageLearningCandidate } from "./learning";

export type Env = Cloudflare.Env;

type AgentRequest = { input?: string; stream?: boolean; model?: string; knowledge?: { query?: string; topK?: number }; metadata?: Record<string, string> };

function routeModels(env: Env, requested?: string): string[] {
  const allowed = [env.MODEL_PRIMARY || "@cf/meta/llama-3.1-8b-instruct", ...(env.MODEL_FALLBACKS || "").split(",")].map(x => x.trim()).filter(Boolean);
  return requested && allowed.includes(requested) ? [requested, ...allowed.filter(x => x !== requested)] : allowed;
}

async function retrieve(env: Env, query?: string, topK = 5) {
  if (!query || !env.VECTORIZE) return [];
  // Embedding generation belongs behind the governed OrchestrAIOS service; no raw input is written to trusted knowledge.
  const response = await env.ORCHESTRAI.fetch(new Request("https://orchestrai.internal/v1/embeddings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ input: query }) }));
  if (!response.ok) throw new Error("RAG_EMBEDDING_UNAVAILABLE");
  const body = await response.json() as { vector: number[] };
  const result = await env.VECTORIZE.query(body.vector, { topK: Math.min(Math.max(topK, 1), 10), returnMetadata: "all" });
  return result.matches.filter(match => match.metadata?.releaseStatus === "approved").map(match => ({ id: match.id, score: match.score, provenance: match.metadata?.provenance, version: match.metadata?.version }));
}

async function enforceQuota(env: Env, principal: Principal) {
  const minute = Math.floor(Date.now() / 60_000);
  const row = await env.DB.prepare("INSERT INTO request_quotas (subject, minute_bucket, count) VALUES (?, ?, 1) ON CONFLICT(subject, minute_bucket) DO UPDATE SET count = count + 1 RETURNING count").bind(principal.subject, minute).first<{ count: number }>();
  if ((row?.count || 1) > 30) throw new Response(JSON.stringify({ code: "RATE_LIMITED", message: "Per-minute request quota exceeded" }), { status: 429, headers: { "content-type": "application/json", "retry-after": "60" } });
}

async function invokeAgent(request: Request, env: Env, principal: Principal, id: string): Promise<Response> {
  authorize(principal, "agent:invoke");
  await enforceQuota(env, principal);
  const body = await request.json() as AgentRequest;
  if (!body.input || body.input.length > 16_000) return errorResponse("INVALID_REQUEST", "input is required and limited to 16000 characters", 400, id);
  const timeoutMs = Math.min(Number(env.REQUEST_TIMEOUT_MS || 30_000), 60_000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  const citations = await retrieve(env, body.knowledge?.query, body.knowledge?.topK);
  const models = routeModels(env, body.model);
  let upstream: Response | undefined;
  let selectedModel = models[0];
  try {
    for (const model of models) {
      selectedModel = model;
      upstream = await env.ORCHESTRAI.fetch(new Request("https://orchestrai.internal/v1/responses", {
        method: "POST", signal: controller.signal,
        headers: { "content-type": "application/json", "x-request-id": id, "x-principal-id": principal.subject },
        body: JSON.stringify({ id, input: body.input, stream: body.stream !== false, model, citations, metadata: body.metadata }),
      }));
      if (upstream.ok || (upstream.status < 500 && upstream.status !== 429)) break;
    }
    if (!upstream?.ok || !upstream.body) return errorResponse("UPSTREAM_UNAVAILABLE", "OrchestrAIOS could not complete the request", 503, id);
    const headers = { "content-type": upstream.headers.get("content-type") || "text/event-stream", "cache-control": "no-store", "x-request-id": id, "x-model-route": selectedModel };
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    const code = controller.signal.aborted ? "REQUEST_TIMEOUT" : "UPSTREAM_UNAVAILABLE";
    return errorResponse(code, code === "REQUEST_TIMEOUT" ? "Agent request timed out" : "OrchestrAIOS is unavailable", code === "REQUEST_TIMEOUT" ? 504 : 503, id);
  } finally { clearTimeout(timer); }
}

async function dependencyHealth(env: Env, id: string) {
  const started = Date.now();
  const probe = async (name: string, binding?: Fetcher) => {
    if (!binding) return { name, status: "not_configured" };
    try { const response = await binding.fetch(new Request("https://service.internal/health/ready", { headers: { "x-request-id": id } })); return { name, status: response.ok ? "ready" : "degraded", code: response.status }; }
    catch { return { name, status: "unreachable" }; }
  };
  const dependencies = await Promise.all([probe("orchestraios", env.ORCHESTRAI), probe("ewaya", env.EWAYA)]);
  const ready = dependencies.every(item => item.status === "ready" || item.status === "not_configured");
  return json({ status: ready ? "ready" : "degraded", version: env.RELEASE_VERSION || "unreleased", checkedAt: new Date().toISOString(), durationMs: Date.now() - started, dependencies }, ready ? 200 : 503, id);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const id = requestId(request);
    const audit = new Audit(env, id, ctx);
    const url = new URL(request.url);
    if (url.pathname === "/health/live") return json({ status: "alive", version: env.RELEASE_VERSION || "unreleased" }, 200, id);
    if (url.pathname === "/health/ready") return dependencyHealth(env, id);
    try {
      const principal = await authenticate(request, env);
      if (url.pathname === "/v1/agent/responses" && request.method === "POST") return withHeaders(await invokeAgent(request, env, principal, id), id);
      if (url.pathname.startsWith("/v1/agent/responses/") && request.method === "DELETE") {
        authorize(principal, "agent:cancel"); const responseId = url.pathname.split("/").pop() || "";
        await env.CANCELLATIONS.put(`cancel:${responseId}`, JSON.stringify({ by: principal.subject, at: new Date().toISOString() }), { expirationTtl: 3600 });
        const upstream = await env.ORCHESTRAI.fetch(new Request(`https://orchestrai.internal/v1/responses/${encodeURIComponent(responseId)}`, { method: "DELETE", headers: { "x-request-id": id, "x-principal-id": principal.subject } }));
        audit.emit("agent.cancelled", principal, { responseId, upstreamStatus: upstream.status }); return json({ status: upstream.ok ? "cancellation_requested" : "cancellation_deferred" }, 202, id);
      }
      if (url.pathname === "/mcp" && request.method === "POST") return handleMcp(request, env, principal, audit, id);
      if (url.pathname === "/v1/learning/candidates" && request.method === "POST") return stageLearningCandidate(request, env, principal, audit, id);
      return errorResponse("NOT_FOUND", "Route not found", 404, id);
    } catch (error) {
      if (error instanceof Response) return withHeaders(error, id);
      audit.emit("request.denied", undefined, { reason: error instanceof Error ? error.message : "unknown" });
      return errorResponse("UNAUTHORIZED", "Authentication or authorization failed", 401, id);
    }
  },
};

export { OrchestrAIWorkflow } from "./workflow";
