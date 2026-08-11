#!/usr/bin/env bash
# OrchestrAI OS — Cloudflare CLI Feature & Binding Provisioning Engine
# Provisions Turnstile Spin Widgets, Bot Fight Mode, D1 Database, R2 Bucket, and Vectorize RAG Indexes

set -e

echo "=========================================================================="
echo "  OrchestrAI OS — Cloudflare CLI & API Feature Setup Engine"
echo "=========================================================================="

export CLOUDFLARE_ACCOUNT_ID="046e3f2201dc5c956e093873dc704b63"

# Extract token from environment or ~/.wrangler/config/default.toml
CF_TOKEN="${CF_API_TOKEN:-${CLOUDFLARE_API_TOKEN:-}}"
if [ -z "$CF_TOKEN" ] && [ -f "$HOME/.wrangler/config/default.toml" ]; then
    CF_TOKEN=$(grep oauth_token "$HOME/.wrangler/config/default.toml" | cut -d'=' -f2 | tr -d ' "' || true)
fi

# 1. Provision Turnstile Spin Managed Widget
echo "[+] 1/4 Provisioning Turnstile Managed Spin Widget for agent endpoints..."
npx -y wrangler turnstile widget create "orchestrai-agent-protection" \
  --domain "agents.orchestraios.com" \
  --domain "mcp.orchestraios.com" \
  --domain "orchestraios.com" \
  --mode "managed" || echo "[!] Turnstile widget notice (already exists or requires challenge-widgets:write scope)."

# 2. Configure Bot Fight Mode API Calls across 3 Domains
echo "[+] 2/4 Configuring Cloudflare Bot Fight Mode API across Fort Knox Zones..."
ZONES=("b1f89cabe4c6a8399e4c1bc5e5d03208:mitenmehta.com" "7763596e33e27868517a6364e99a3ffb:orchestraios.com" "e88266b2e8f3f776d7cbdd54fa7ec498:finmesh.app")

for ZITEM in "${ZONES[@]}"; do
    ZID="${ZITEM%%:*}"
    ZNAME="${ZITEM##*:}"
    echo "  [➔] Applying Bot Fight Mode ON for zone: ${ZNAME} (${ZID})..."
    if [ -n "$CF_TOKEN" ]; then
        curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZID}/settings/bot_fight_mode" \
          -H "Authorization: Bearer ${CF_TOKEN}" \
          -H "Content-Type: application/json" \
          --data '{"value":"on"}' | grep -q '"success":true' && echo "      ✓ Enabled Bot Fight Mode on ${ZNAME}" || echo "      ! Bot Fight Mode API call returned notice/restricted scope for ${ZNAME}"
    else
        echo "      ! Skipped Bot Fight Mode API call (No CF_TOKEN found)"
    fi
done

# 3. Provision D1 Database Bindings
echo "[+] 3/4 Provisioning Cloudflare D1 Serverless Database (orchestrai-cvo-db)..."
npx -y wrangler d1 create orchestrai-cvo-db || echo "[!] D1 Database already exists or notice."

# 4. Provision R2 Bucket Storage Bindings
echo "[+] 4/4 Provisioning Cloudflare R2 Object Storage Bucket (orchestrai-cvo-storage)..."
npx -y wrangler r2 bucket create orchestrai-cvo-storage || echo "[!] R2 Bucket creation notice (already exists or requires dashboard enabling)."

# 5. Provision Vectorize RAG Index (1536 Dimensions, Cosine Metric)
echo "[+] Vectorize RAG Index (orchestrai-cvo-rag)..."
npx -y wrangler vectorize create orchestrai-cvo-rag \
  --dimensions 1536 \
  --metric cosine || echo "[!] Vectorize index already exists or notice."

echo "=========================================================================="
echo "[+] Cloudflare CLI & Feature Provisioning Complete!"
echo "=========================================================================="
