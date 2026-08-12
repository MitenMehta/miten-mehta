#!/usr/bin/env bash
set -euo pipefail

api="https://api.cloudflare.com/client/v4"
account_id="${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID is required}"
token="${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"

api_get() {
  curl --fail --silent --show-error \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    "${api}$1"
}

import_if_missing() {
  local address="$1"
  local import_id="$2"
  if tofu state show "${address}" >/dev/null 2>&1; then
    return
  fi
  echo "[+] Importing ${address}"
  tofu import -input=false "${address}" "${import_id}"
}

import_zone() {
  local zone_id="$1"
  local domain="$2"
  local prefix="$3"
  local header_name="$4"
  local record_id
  local ruleset_id

  import_if_missing "cloudflare_zone_dnssec.${prefix}_dnssec" "${zone_id}"

  record_id="$(api_get "/zones/${zone_id}/dns_records?type=TXT&name=_dmarc.${domain}" | jq -r '.result[] | select(.content | contains("p=quarantine")) | .id' | head -n 1)"
  if [[ -n "${record_id}" ]]; then
    import_if_missing "cloudflare_record.${prefix}_dmarc" "${zone_id}/${record_id}"
  fi

  ruleset_id="$(api_get "/zones/${zone_id}/rulesets" | jq -r --arg name "${header_name}" '.result[] | select(.name == $name) | .id' | head -n 1)"
  if [[ -n "${ruleset_id}" ]]; then
    import_if_missing "cloudflare_ruleset.${prefix}_headers" "zone/${zone_id}/${ruleset_id}"
  fi
}

import_zone "b1f89cabe4c6a8399e4c1bc5e5d03208" "mitenmehta.com" "mitenmehta" "mitenmehta-security-transform-headers"
import_zone "7763596e33e27868517a6364e99a3ffb" "orchestraios.com" "orchestraios" "orchestraios-security-transform-headers"
import_zone "e88266b2e8f3f776d7cbdd54fa7ec498" "finmesh.app" "finmesh" "finmesh-security-transform-headers"

waf_id="$(api_get "/zones/7763596e33e27868517a6364e99a3ffb/rulesets" | jq -r '.result[] | select(.name == "orchestrai-waf-bot-filtering-ruleset") | .id' | head -n 1)"
if [[ -n "${waf_id}" ]]; then
  import_if_missing "cloudflare_ruleset.waf_bot_filtering" "zone/7763596e33e27868517a6364e99a3ffb/${waf_id}"
fi

if api_get "/accounts/${account_id}/workers/scripts/orchestrai-workers-ai-fallback" >/dev/null 2>&1; then
  import_if_missing "cloudflare_workers_script.workers_ai_fallback" "${account_id}/orchestrai-workers-ai-fallback"
fi
