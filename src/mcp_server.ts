// OrchestrAI MCP Server — OAuth-secured, Streamable HTTP
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { OAuthProvider } from "@cloudflare/workers-oauth-provider";

export class OrchestrAIMCP extends McpAgent {
  server = new McpServer({ name: "orchestrai-mcp-server", version: "1.0.0" });
  async init() {
    this.server.tool("run_security_audit", "...", { zones: z.array(z.string()).optional() }, async ({ zones }) => { /* ... */ });
    this.server.tool("query_cvo", "...", { query: z.string() }, async ({ query }) => { /* ... */ });
    this.server.tool("check_terraform_drift", "...", {}, async () => { /* ... */ });
    this.server.tool("get_zone_status", "...", { zone: z.enum(["mitenmehta.com", "orchestraios.com", "finmesh.app"]) }, async ({ zone }) => { /* ... */ });
    this.server.tool("trigger_workflow", "...", { workflow_name: z.string(), payload: z.record(z.any()).optional() }, async ({ workflow_name, payload }) => { /* ... */ });
  }
}

export default new OAuthProvider({
  apiHandlers: { "/mcp": OrchestrAIMCP.serve("/mcp") },
  apiOptions: { kvNamespace: "OAUTH_KV" }
});