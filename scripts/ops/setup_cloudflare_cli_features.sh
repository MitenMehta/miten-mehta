#!/usr/bin/env bash
# OrchestrAI OS — Cloudflare CLI Feature Setup Engine
# Provisions Turnstile Spin Widgets and Vectorize RAG Indexes via Wrangler CLI

set -e

echo "=========================================================================="
echo "  OrchestrAI OS — Cloudflare CLI Feature Provisioning Engine"
echo "=========================================================================="

export CLOUDFLARE_ACCOUNT_ID="046e3f2201dc5c956e093873dc704b63"

# 1. Provision Turnstile Spin Managed Widget
echo "[+] Provisioning Turnstile Spin Widget for agent endpoints..."
npx -y wrangler turnstile widget create "orchestrai-agent-protection" \
  --domain "agents.orchestraios.com" \
  --domain "mcp.orchestraios.com" \
  --domain "orchestraios.com" \
  --mode "managed" || echo "[!] Turnstile widget already exists or requires login."

# 2. Provision Vectorize RAG Index (1536 Dimensions, Cosine Metric)
echo "[+] Provisioning Vectorize RAG Index (orchestrai-cvo-rag)..."
npx -y wrangler vectorize create orchestrai-cvo-rag \
  --dimensions 1536 \
  --metric cosine || echo "[!] Vectorize index already exists or requires login."

echo "=========================================================================="
echo "[+] Cloudflare CLI Feature Setup Complete!"
echo "=========================================================================="
