import type { Env } from "./edge_gateway";
import type { Audit } from "./runtime";
import { json } from "./runtime";
import { authorize, type Principal } from "./security";
export async function stageLearningCandidate(request: Request, env: Env, principal: Principal, audit: Audit, requestId: string) {
  authorize(principal, "learning:submit");
  const body = await request.json() as { kind?: string; content?: unknown; provenance?: { source?: string; capturedAt?: string } };
  if (!['failure','feedback','research'].includes(body.kind || '') || !body.provenance?.source || body.content === undefined) return json({ error: { code: "INVALID_CANDIDATE", message: "kind, content and provenance.source are required", requestId } }, 400, requestId);
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO learning_candidates (id, kind, content_json, provenance_json, status, created_by, created_at) VALUES (?, ?, ?, ?, 'staged', ?, ?)").bind(id, body.kind, JSON.stringify(body.content), JSON.stringify(body.provenance), principal.subject, new Date().toISOString()).run();
  await env.WORK_QUEUE.send({ schemaVersion: "1.0", type: "learning.candidate.staged", candidateId: id, requiredGates: ["provenance", "security_scan", "offline_eval", "regression", "human_approval", "versioned_release"] }, { contentType: "json" });
  audit.emit("learning.candidate.staged", principal, { candidateId: id, kind: body.kind });
  return json({ id, status: "staged", productionMutation: false }, 202, requestId);
}
