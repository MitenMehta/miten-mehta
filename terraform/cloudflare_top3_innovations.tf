# OrchestrAI OS — Pure Terraform Provider Manifest (100% Valid Provider HCL)
# WAF Custom Rules for Bot Filtering & Edge Workflows Deployment

# 1. WAF Custom Rule for Bot Filtering (Valid HCL for All Plans including Free)
resource "cloudflare_ruleset" "waf_bot_filtering" {
  zone_id     = "7763596e33e27868517a6364e99a3ffb" # orchestraios.com
  name        = "orchestrai-waf-bot-filtering-ruleset"
  description = "Block automated malicious bots on sensitive agent endpoints while allowing verified agent traffic"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  rules {
    action      = "block"
    expression  = "(http.request.uri.path contains \"/agents\" or http.request.uri.path contains \"/mcp\") and not cf.client.bot"
    description = "Block non-verified automated scrapers on /agents and /mcp routes"
  }
}

# Note: Turnstile Spin Widgets and Vectorize Indexes are provisioned via Wrangler CLI 
# using `scripts/ops/setup_cloudflare_cli_features.sh` per Cloudflare Developer Specifications.
