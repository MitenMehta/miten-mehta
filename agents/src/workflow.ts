import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import type { Env } from "./edge_gateway";
export type WorkflowParams = { idempotencyKey: string; action: string; payload: Record<string, unknown>; attempt?: number };
export class OrchestrAIWorkflow extends WorkflowEntrypoint<Env, WorkflowParams> {
  async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
    const existing = await this.env.DB.prepare("SELECT status FROM workflow_runs WHERE idempotency_key = ?").bind(event.payload.idempotencyKey).first<{ status: string }>();
    if (existing) return { status: existing.status, deduplicated: true };
    await step.do("record-start", async () => { await this.env.DB.prepare("INSERT INTO workflow_runs (idempotency_key, action, status, created_at) VALUES (?, ?, 'running', ?)").bind(event.payload.idempotencyKey, event.payload.action, new Date().toISOString()).run(); return { recorded: true }; });
    try {
      const result = await step.do("orchestrai-action", { retries: { limit: 3, delay: "5 seconds", backoff: "exponential" }, timeout: "2 minutes" }, async () => {
        const response = await this.env.ORCHESTRAI.fetch(new Request("https://orchestrai.internal/v1/workflows/execute", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": event.payload.idempotencyKey }, body: JSON.stringify(event.payload) }));
        if (!response.ok) throw new Error(`OrchestrAIOS workflow failed: ${response.status}`); return { responseJson: await response.text() };
      });
      await step.do("record-complete", async () => { await this.env.DB.prepare("UPDATE workflow_runs SET status = 'completed', completed_at = ? WHERE idempotency_key = ?").bind(new Date().toISOString(), event.payload.idempotencyKey).run(); return { recorded: true }; });
      return { status: "completed", result };
    } catch (error) {
      await step.do("dead-letter", async () => { await this.env.DLQ.send({ ...event.payload, error: error instanceof Error ? error.message : "unknown", failedAt: new Date().toISOString() }, { contentType: "json" }); await this.env.DB.prepare("UPDATE workflow_runs SET status = 'dead_lettered', completed_at = ? WHERE idempotency_key = ?").bind(new Date().toISOString(), event.payload.idempotencyKey).run(); });
      throw error;
    }
  }
}
