# Cloudflare Top 3 Complete — OrchestrAI OS Integration

Complete, production-ready Cloudflare configuration for top-3 agentic AI domains.
All resources verified against official Cloudflare documentation (August 2026).

## What's Managed by Terraform vs CLI

### Terraform
- DNSSEC, DMARC, Security Headers (Transform Rules), WAF Bot Filter Rules
- Zone Settings (SSL Full Strict, TLS 1.3, HSTS 12mo, BIC)
- Redirect Rules (www→apex 301), Workflows

### Wrangler CLI (no Terraform resource exists)
- Turnstile widget, Vectorize index, KV namespace, Bot Fight Mode

## Execution Order
1. Run: `./scripts/cloudflare_cli_setup.sh`
2. Store secrets in GitHub: CF_API_TOKEN, CF_ACCOUNT_ID, TURNSTILE_SECRET, OAUTH_KV_ID
3. Deploy Workers: `npx wrangler deploy`
4. Apply Terraform: `terraform apply`
5. Run audit: `python3 scripts/cloudflare_22_point_live_audit.py --verbose`
6. Push to GitHub

## Verification Sources
- Agents SDK: developers.cloudflare.com/agents/
- MCP Server: developers.cloudflare.com/agents/model-context-protocol/apis/agent-api/
- Workflows: developers.cloudflare.com/workflows/
- Vectorize: developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/
- Turnstile Spin: developers.cloudflare.com/turnstile/spin/
- AI Gateway: developers.cloudflare.com/ai-gateway/
- DNSSEC: developers.cloudflare.com/dns/dnssec/
- Terraform Workflows: developers.cloudflare.com/changelog/post/2025-10-09-workflows-terraform/