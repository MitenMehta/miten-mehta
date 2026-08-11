// OrchestrAI Edge Gateway Agent
// See full file in repo — extends Agent, routes WebSocket, AI fallback, RAG, Workflows
import { Agent, routeAgentRequest } from "agents";

export class OrchestrAIGateway extends Agent<Env> {
  onConnect(connection: WebSocket) { /* ... */ }
  async onMessage(connection: WebSocket, message: string | ArrayBuffer) { /* ... */ }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) return agentResponse; // CRITICAL: return directly
    return new Response(JSON.stringify({ service: "OrchestrAI Edge Gateway" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
} satisfies ExportedHandler<Env>;