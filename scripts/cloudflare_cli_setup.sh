#!/usr/bin/env bash
# CLI setup for non-Terraform resources:
# 1. Turnstile widget (wrangler turnstile widget create)
# 2. Vectorize index (wrangler vectorize create --dimensions 1536 --metric cosine)
# 3. KV namespace for OAuth (wrangler kv namespace create OAUTH_KV)
# 4. Bot Fight Mode (Cloudflare API PATCH)
# Full script in repo