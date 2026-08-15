// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import worker, { type Env } from "./edge_gateway";
import { authorize, type Principal } from "./security";

const kv = () => ({ get: vi.fn(async () => null), put: vi.fn(async () => undefined) });
const db = { prepare: vi.fn(() => ({ bind() { return this; }, run: vi.fn(async () => ({ success: true })), first: vi.fn(async () => null) })) };
const env = (orchestraiStatus = 200): Env => ({
  ORCHESTRAI: { fetch: vi.fn(async () => Response.json({ status: "ready" }, { status: orchestraiStatus })) },
  OIDC_ISSUER: "https://issuer.example", OIDC_AUDIENCE: "virtual-miten", AUTH_CACHE: kv(), CANCELLATIONS: kv(), DB: db,
  WORK_QUEUE: { send: vi.fn(async () => undefined) }, DLQ: { send: vi.fn(async () => undefined) },
});
const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn(), props: {} } as unknown as ExecutionContext;

describe("bridge health and authorization", () => {
  it("reports readiness only from a fresh dependency probe", async () => {
    const response = await worker.fetch(new Request("https://bridge/health/ready"), env(), ctx);
    expect(response.status).toBe(200); expect(await response.json()).toMatchObject({ status: "ready", dependencies: expect.arrayContaining([{ name: "orchestraios", status: "ready", code: 200 }]) });
  });
  it("fails readiness when OrchestrAIOS is degraded", async () => {
    const response = await worker.fetch(new Request("https://bridge/health/ready"), env(503), ctx);
    expect(response.status).toBe(503); expect(await response.json()).toMatchObject({ status: "degraded" });
  });
  it("denies agent invocation without a bearer token", async () => {
    const response = await worker.fetch(new Request("https://bridge/v1/agent/responses", { method: "POST", body: "{}" }), env(), ctx);
    expect(response.status).toBe(401); expect(await response.json()).toMatchObject({ error: { code: "UNAUTHORIZED" } });
  });
  it("enforces tool scopes and consent independently", () => {
    const principal: Principal = { subject: "user", scopes: new Set(["tool:ewaya.handoff"]), consent: new Set() };
    expect(() => authorize(principal, "tool:ewaya.handoff", "ewaya.handoff")).toThrow();
    principal.consent.add("ewaya.handoff"); expect(() => authorize(principal, "tool:ewaya.handoff", "ewaya.handoff")).not.toThrow();
  });
  it("sustains a bounded health-probe burst without state leakage", async () => {
    const responses = await Promise.all(Array.from({ length: 100 }, () => worker.fetch(new Request("https://bridge/health/live"), env(), ctx)));
    expect(responses.every(response => response.status === 200)).toBe(true);
    expect(new Set(responses.map(response => response.headers.get("x-request-id"))).size).toBe(100);
  });
});
