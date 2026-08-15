import type { Env } from "./edge_gateway";
import type { Audit } from "./runtime";
import { errorResponse, json } from "./runtime";
import { authorize, type Principal } from "./security";

const tools = [{ name: "orchestrai.search_approved_knowledge", description: "Search human-approved, versioned OrchestrAIOS knowledge", inputSchema: { type: "object", additionalProperties: false, required: ["query"], properties: { query: { type: "string", minLength: 1, maxLength: 2000 }, topK: { type: "integer", minimum: 1, maximum: 10 } } }, annotations: { readOnlyHint: true } }, { name: "ewaya.handoff", description: "Create an Ewaya bridge handoff after explicit user consent", inputSchema: { type: "object", additionalProperties: false, required: ["summary"], properties: { summary: { type: "string", maxLength: 4000 } } }, annotations: { readOnlyHint: false } }];

export async function handleMcp(request: Request, env: Env, principal: Principal, audit: Audit, requestId: string) {
  authorize(principal, "mcp:connect");
  const rpc = await request.json() as { jsonrpc?: string; id?: string | number | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };
  if (rpc.jsonrpc !== "2.0" || !rpc.method) return errorResponse("INVALID_MCP_REQUEST", "JSON-RPC 2.0 request required", 400, requestId);
  const result = (value: unknown) => json({ jsonrpc: "2.0", id: rpc.id ?? null, result: value }, 200, requestId);
  if (rpc.method === "initialize") return result({ protocolVersion: "2025-06-18", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "orchestrai-ewaya-bridge", version: env.RELEASE_VERSION || "unreleased" } });
  if (rpc.method === "notifications/initialized") return new Response(null, { status: 202, headers: { "x-request-id": requestId } });
  if (rpc.method === "tools/list") { authorize(principal, "mcp:tools:read"); return result({ tools }); }
  if (rpc.method === "tools/call") {
    const name = rpc.params?.name;
    const tool = tools.find(item => item.name === name); if (!tool) return result({ isError: true, content: [{ type: "text", text: "Unknown tool" }] });
    authorize(principal, `tool:${name}`, name === "ewaya.handoff" ? "ewaya.handoff" : undefined);
    const target = name?.startsWith("ewaya.") ? env.EWAYA : env.ORCHESTRAI;
    if (!target) return result({ isError: true, content: [{ type: "text", text: "Tool dependency is not configured" }] });
    const response = await target.fetch(new Request(`https://service.internal/mcp/tools/${encodeURIComponent(name || "")}`, { method: "POST", headers: { "content-type": "application/json", "x-request-id": requestId, "x-principal-id": principal.subject }, body: JSON.stringify(rpc.params?.arguments || {}) }));
    const text = await response.text(); audit.emit("mcp.tool.called", principal, { tool: name, status: response.status });
    return result({ isError: !response.ok, content: [{ type: "text", text: text.slice(0, 32_000) }] });
  }
  return json({ jsonrpc: "2.0", id: rpc.id ?? null, error: { code: -32601, message: "Method not found" } }, 200, requestId);
}
