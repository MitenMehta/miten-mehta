import type { Env } from "./edge_gateway";
import type { Principal } from "./security";
export const requestId = (request: Request) => request.headers.get("x-request-id")?.slice(0, 128) || crypto.randomUUID();
export const withHeaders = (response: Response, id: string) => { const headers = new Headers(response.headers); headers.set("x-request-id", id); return new Response(response.body, { status: response.status, headers }); };
export const json = (body: unknown, status: number, id: string) => Response.json(body, { status, headers: { "cache-control": "no-store", "x-request-id": id } });
export const errorResponse = (code: string, message: string, status: number, id: string) => json({ error: { code, message, requestId: id } }, status, id);
export class Audit {
  constructor(private env: Env, private requestId: string, private ctx: ExecutionContext) {}
  emit(type: string, principal?: Principal, detail: Record<string, unknown> = {}) {
    const event = { specversion: "1.0", id: crypto.randomUUID(), source: "urn:mitenmehta:orchestrai-ewaya-bridge", type, time: new Date().toISOString(), subject: principal?.subject, requestId: this.requestId, detail };
    this.ctx.waitUntil(this.env.DB.prepare("INSERT INTO audit_events (id, type, subject, request_id, occurred_at, detail_json) VALUES (?, ?, ?, ?, ?, ?)").bind(event.id, type, event.subject || null, this.requestId, event.time, JSON.stringify(detail)).run().then(() => undefined));
  }
}
