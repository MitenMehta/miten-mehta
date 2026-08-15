import { z } from "zod";

const agentResponseSchema = z.object({
  request_id: z.string().min(1),
  status: z.enum(["completed", "degraded"]),
  message: z.string(),
  citations: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
});

export type AgentMode = "aria" | "orion";
export type AgentResponse = z.infer<typeof agentResponseSchema>;

export class AgentUnavailableError extends Error {
  constructor(message = "The Virtual Miten service is not available yet.") {
    super(message);
    this.name = "AgentUnavailableError";
  }
}

function getEndpoint(): URL {
  const configured = import.meta.env.VITE_AGENT_API_URL?.trim();
  if (!configured) throw new AgentUnavailableError();

  const endpoint = new URL(configured, window.location.origin);
  const isLocalDevelopment = import.meta.env.DEV && ["localhost", "127.0.0.1"].includes(endpoint.hostname);
  if (endpoint.protocol !== "https:" && !isLocalDevelopment) {
    throw new AgentUnavailableError("The configured agent endpoint is not secure.");
  }
  if (!isLocalDevelopment && endpoint.origin !== window.location.origin) {
    throw new AgentUnavailableError("The agent endpoint must use the protected website origin.");
  }
  return endpoint;
}

export async function sendAgentMessage(input: {
  message: string;
  mode: AgentMode;
  sessionId: string;
  signal?: AbortSignal;
}): Promise<AgentResponse> {
  const endpoint = getEndpoint();
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), 15_000);
  const signal = input.signal
    ? AbortSignal.any([input.signal, timeoutController.signal])
    : timeoutController.signal;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Request-ID": crypto.randomUUID(),
      },
      body: JSON.stringify({
        message: input.message,
        mode: input.mode,
        session_id: input.sessionId,
      }),
      signal,
    });

    if (!response.ok) {
      throw new AgentUnavailableError(
        response.status === 429
          ? "The service is busy. Please wait and try again."
          : "The Virtual Miten service is temporarily unavailable.",
      );
    }

    return agentResponseSchema.parse(await response.json());
  } catch (error) {
    if (error instanceof AgentUnavailableError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AgentUnavailableError("The request timed out. Please try again later.");
    }
    throw new AgentUnavailableError();
  } finally {
    window.clearTimeout(timeoutId);
  }
}
