import { afterEach, describe, expect, it, vi } from "vitest";
import { AgentUnavailableError, sendAgentMessage } from "./agent-client";

describe("sendAgentMessage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails closed when no governed endpoint is configured", async () => {
    vi.stubEnv("VITE_AGENT_API_URL", "");
    await expect(
      sendAgentMessage({ message: "hello", mode: "aria", sessionId: crypto.randomUUID() }),
    ).rejects.toBeInstanceOf(AgentUnavailableError);
  });

  it("accepts only a schema-valid same-origin response", async () => {
    vi.stubEnv("VITE_AGENT_API_URL", "/api/agent");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          request_id: "req-1",
          status: "completed",
          message: "Governed response",
          citations: [],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );

    await expect(
      sendAgentMessage({ message: "hello", mode: "orion", sessionId: crypto.randomUUID() }),
    ).resolves.toMatchObject({ request_id: "req-1", status: "completed" });
  });

  it("maps an upstream failure to a safe unavailable response", async () => {
    vi.stubEnv("VITE_AGENT_API_URL", "/api/agent");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 503 }));

    await expect(
      sendAgentMessage({ message: "hello", mode: "aria", sessionId: crypto.randomUUID() }),
    ).rejects.toThrow("temporarily unavailable");
  });
});
