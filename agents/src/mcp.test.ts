// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { handleMcp } from "./mcp";
import type { Env } from "./edge_gateway";
import type { Principal } from "./security";

const principal: Principal = { subject: "user-1", scopes: new Set(["mcp:connect", "mcp:tools:read", "tool:orchestrai.search_approved_knowledge"]), consent: new Set() };
const baseEnv = { RELEASE_VERSION: "test", ORCHESTRAI: { fetch: vi.fn(async () => new Response("approved result")) } } as unknown as Env;
const audit = { emit: vi.fn() } as never;
describe("MCP Streamable HTTP contract", () => {
  it("negotiates the pinned protocol version", async () => {
    const request = new Request("https://bridge/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize" }) });
    const response = await handleMcp(request, baseEnv, principal, audit, "req-1");
    expect(await response.json()).toMatchObject({ jsonrpc: "2.0", id: 1, result: { protocolVersion: "2025-06-18" } });
  });
  it("returns declared tool schemas", async () => {
    const request = new Request("https://bridge/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }) });
    const response = await handleMcp(request, baseEnv, principal, audit, "req-2");
    const body = await response.json() as { result: { tools: unknown[] } }; expect(body.result.tools).toHaveLength(2);
  });
  it("denies an unconsented Ewaya handoff", async () => {
    const scoped = { ...principal, scopes: new Set([...principal.scopes, "tool:ewaya.handoff"]) };
    const request = new Request("https://bridge/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "ewaya.handoff", arguments: { summary: "x" } } }) });
    await expect(handleMcp(request, baseEnv, scoped, audit, "req-3")).rejects.toMatchObject({ status: 403 });
  });
});
