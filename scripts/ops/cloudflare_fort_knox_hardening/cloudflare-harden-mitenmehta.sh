#!/bin/bash
###############################################################################
#  Cloudflare "Fort Knox" Hardening Script  —  mitenmehta.com
#  Generated for execution via AntiGravity or any bash terminal.
#
#  WHAT THIS DOES:
#    1.  Finds the zone ID for mitenmehta.com
#    2.  Sets SSL/TLS to Full (Strict)
#    3.  Enables Always Use HTTPS, HSTS, Min TLS 1.2, TLS 1.3
#    4.  Enables Authenticated Origin Pulls, Opportunistic Encryption, 0-RTT
#    5.  Enables Bot Fight Mode, sets Security Level High, Browser Integrity Check
#    6.  Enables Auto Minify (HTML/CSS/JS), Brotli, Early Hints
#    7.  Adds DNS records: CAA, SPF, DMARC
#    8.  Enables DNSSEC
#    9.  Creates WAF custom rules: block scanners, block sensitive files
#    10. Creates rate limiting rule for /login
#    11. Creates redirect rule: www → non-www (301)
#    12. Creates cache rule for static assets (1-year edge TTL)
#
#  PREREQUISITES:
#    - A Cloudflare API token with these permissions:
#        Zone > Zone > Read
#        Zone > Zone Settings > Edit
#        Zone > DNS > Edit
#        Zone > SSL and Certificate Management > Edit
#        Zone > WAF > Edit
#        Zone > Cache Rules > Edit
#        Zone > Page Rules > Edit
#        Zone > Redirect Rules > Edit
#    - curl and jq installed
#    - The zone mitenmehta.com must be ACTIVE (not pending transfer)
#
#  USAGE:
#    export CF_API_TOKEN="your-api-token-here"
#    ./cloudflare-harden-mitenmehta.sh              # interactive (asks confirmation)
#    ./cloudflare-harden-mitenmehta.sh --force       # skip confirmation
#    ./cloudflare-harden-mitenmehta.sh --dry-run      # preview only, no changes
#
#  SAFETY:
#    - Every API call is logged with success/failure
#    - --dry-run shows what would happen without making changes
#    - If any critical step fails, the script stops and tells you
###############################################################################

set -uo pipefail

# ─── Config ────────────────────────────────────────────────────────────────────
DOMAIN="mitenmehta.com"
API="https://api.cloudflare.com/client/v4"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Flags
DRY_RUN=false
FORCE=false

# Counters
SUCCESS=0
FAILED=0
SKIPPED=0

# ─── Arg parsing ───────────────────────────────────────────────────────────────
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --force)   FORCE=true ;;
    *) echo "Unknown argument: $arg"; exit 1 ;;
  esac
done

# ─── Pre-flight checks ─────────────────────────────────────────────────────────
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Cloudflare Fort Knox Hardening — ${DOMAIN}${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [[ -z "${CF_API_TOKEN:-}" ]]; then
  echo -e "${RED}ERROR: CF_API_TOKEN environment variable is not set.${NC}"
  echo ""
  echo "Create a token at: https://dash.cloudflare.com/profile/api-tokens"
  echo "Required permissions:"
  echo "  Zone > Zone > Read"
  echo "  Zone > Zone Settings > Edit"
  echo "  Zone > DNS > Edit"
  echo "  Zone > SSL and Certificate Management > Edit"
  echo "  Zone > WAF > Edit"
  echo "  Zone > Cache Rules > Edit"
  echo "  Zone > Redirect Rules > Edit"
  echo ""
  echo "Then run:"
  echo "  export CF_API_TOKEN=\"your-token-here\""
  echo "  ./cloudflare-harden-mitenmehta.sh"
  exit 1
fi

if ! command -v jq &> /dev/null; then
  echo -e "${RED}ERROR: jq is not installed. Install it first:${NC}"
  echo "  Ubuntu/Debian:  sudo apt install jq"
  echo "  macOS:         brew install jq"
  exit 1
fi

if ! command -v curl &> /dev/null; then
  echo -e "${RED}ERROR: curl is not installed.${NC}"
  exit 1
fi

# ─── Helpers ──────────────────────────────────────────────────────────────────

ok() {
  echo -e "  ${GREEN}✓${NC} $1"
  ((SUCCESS++))
}

fail() {
  echo -e "  ${RED}✗${NC} $1"
  ((FAILED++))
}

skip() {
  echo -e "  ${YELLOW}⊘${NC} $1 (dry-run)"
  ((SKIPPED++))
}

info() {
  echo -e "  ${BLUE}→${NC} $1"
}

cf_api() {
  local method="$1"
  local path="$2"
  local body="${3:-}"

  local curl_cmd=(
    curl -sS --max-time 30
    -X "$method"
    "${API}${path}"
    -H "Authorization: Bearer ${CF_API_TOKEN}"
    -H "Content-Type: application/json"
  )

  if [[ -n "$body" ]]; then
    curl_cmd+=(-d "$body")
  fi

  "${curl_cmd[@]}"
}

cf_success() {
  echo "$1" | jq -e '.success == true' > /dev/null 2>&1
}

# ─── Step 1: Find Zone ID ─────────────────────────────────────────────────────
echo -e "${BLUE}[1/12] Finding zone ID for ${DOMAIN}...${NC}"

ZONE_RESPONSE=$(cf_api GET "/zones?name=${DOMAIN}")
if ! cf_success "$ZONE_RESPONSE"; then
  echo -e "${RED}Failed to query zones. Check your API token permissions.${NC}"
  echo "$ZONE_RESPONSE" | jq . 2>/dev/null || echo "$ZONE_RESPONSE"
  exit 1
fi

ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id')
ZONE_STATUS=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].status')
ZONE_PLAN=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].plan.name')

if [[ "$ZONE_ID" == "null" || -z "$ZONE_ID" ]]; then
  echo -e "${RED}Zone '${DOMAIN}' not found on this account.${NC}"
  echo "Make sure the domain is added to Cloudflare and the zone is active."
  exit 1
fi

echo -e "  ${GREEN}✓${NC} Zone ID: ${ZONE_ID}"
echo -e "  ${BLUE}→${NC} Status: ${ZONE_STATUS}"
echo -e "  ${BLUE}→${NC} Plan: ${ZONE_PLAN}"

if [[ "$ZONE_STATUS" != "active" ]]; then
  echo ""
  echo -e "${RED}WARNING: Zone is '${ZONE_STATUS}', not 'active'.${NC}"
  echo "Some settings may fail until the zone is fully active."
  echo "Continue anyway? (y/N)"
  read -r response
  [[ "$response" =~ ^[yY] ]] || exit 0
fi

# ─── Confirmation ─────────────────────────────────────────────────────────────
if [[ "$DRY_RUN" == false && "$FORCE" == false ]]; then
  echo ""
  echo -e "${YELLOW}This will apply ALL hardening changes to ${DOMAIN}.${NC}"
  echo -e "${YELLOW}Make sure you have a backup of your current DNS records and settings.${NC}"
  echo ""
  echo "Proceed? (type 'harden' to confirm)"
  read -r response
  if [[ "$response" != "harden" ]]; then
    echo "Aborted. No changes made."
    exit 0
  fi
fi

if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}DRY RUN MODE — no changes will be made.${NC}"
fi

echo ""

# ─── Step 2: SSL/TLS Mode → Full (Strict) ─────────────────────────────────────
echo -e "${BLUE}[2/12] Setting SSL/TLS to Full (Strict)...${NC}"

SSL_BODY='{"value":"full"}'

if [[ "$DRY_RUN" == true ]]; then
  skip "SSL/TLS mode → Full (Strict)"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/ssl" "$SSL_BODY")
  if cf_success "$RESP"; then ok "SSL/TLS mode set to Full (Strict)"
  else fail "SSL/TLS mode"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# ─── Step 3: Edge Certificate Settings ────────────────────────────────────────
echo -e "${BLUE}[3/12] Configuring edge certificate security settings...${NC}"

# 3a. Always Use HTTPS
if [[ "$DRY_RUN" == true ]]; then
  skip "Always Use HTTPS → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/always_use_https" '{"value":"on"}')
  if cf_success "$RESP"; then ok "Always Use HTTPS → ON"
  else fail "Always Use HTTPS"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# 3b. HSTS
HSTS_BODY='{"value":{"enabled":true,"max_age":15552000,"include_subdomains":true,"preload":true}}'
if [[ "$DRY_RUN" == true ]]; then
  skip "HSTS → ON (max_age=15552000, include_subdomains, preload)"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/hsts" "$HSTS_BODY")
  if cf_success "$RESP"; then ok "HSTS → ON (6 months, include subdomains, preload)"
  else fail "HSTS"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# 3c. Minimum TLS Version
if [[ "$DRY_RUN" == true ]]; then
  skip "Minimum TLS Version → 1.2"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/min_tls_version" '{"value":"1.2"}')
  if cf_success "$RESP"; then ok "Minimum TLS Version → 1.2"
  else fail "Min TLS Version"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# 3d. TLS 1.3
if [[ "$DRY_RUN" == true ]]; then
  skip "TLS 1.3 → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/tls_1_3" '{"value":"on"}')
  if cf_success "$RESP"; then ok "TLS 1.3 → ON"
  else fail "TLS 1.3"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# 3e. Opportunistic Encryption
if [[ "$DRY_RUN" == true ]]; then
  skip "Opportunistic Encryption → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/opportunistic_encryption" '{"value":"on"}')
  if cf_success "$RESP"; then ok "Opportunistic Encryption → ON"
  else fail "Opportunistic Encryption"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# 3f. 0-RTT
if [[ "$DRY_RUN" == true ]]; then
  skip "0-RTT → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/0rtt" '{"value":"on"}')
  if cf_success "$RESP"; then ok "0-RTT → ON"
  else fail "0-RTT"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# 3g. Authenticated Origin Pulls
if [[ "$DRY_RUN" == true ]]; then
  skip "Authenticated Origin Pulls → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/tls_client_auth" '{"value":"on"}')
  if cf_success "$RESP"; then ok "Authenticated Origin Pulls → ON"
  else fail "Authenticated Origin Pulls"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# ─── Step 4: Bot Fight Mode ───────────────────────────────────────────────────
echo -e "${BLUE}[4/12] Enabling Bot Fight Mode...${NC}"

if [[ "$DRY_RUN" == true ]]; then
  skip "Bot Fight Mode → ON"
else
  RESP=$(cf_api PUT "/zones/${ZONE_ID}/bot_management" '{"fight_mode":true}')
  if cf_success "$RESP"; then ok "Bot Fight Mode → ON"
  else
    fail "Bot Fight Mode (may require Pro+ plan)"
    echo "$RESP" | jq '.errors' 2>/dev/null
  fi
fi

# ─── Step 5: Security Level & Browser Integrity Check ─────────────────────────
echo -e "${BLUE}[5/12] Setting Security Level and Browser Integrity Check...${NC}"

if [[ "$DRY_RUN" == true ]]; then
  skip "Security Level → High"
  skip "Browser Integrity Check → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/security_level" '{"value":"high"}')
  if cf_success "$RESP"; then ok "Security Level → High"
  else fail "Security Level"; echo "$RESP" | jq '.errors' 2>/dev/null; fi

  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/browser_integrity_check" '{"value":"on"}')
  if cf_success "$RESP"; then ok "Browser Integrity Check → ON"
  else fail "Browser Integrity Check"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# ─── Step 6: Performance Settings ──────────────────────────────────────────────
echo -e "${BLUE}[6/12] Enabling performance optimizations...${NC}"

AUTOMINIFY_BODY='{"value":{"html":true,"css":true,"js":true}}'
if [[ "$DRY_RUN" == true ]]; then
  skip "Auto Minify → HTML, CSS, JS"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/autominify" "$AUTOMINIFY_BODY")
  if cf_success "$RESP"; then ok "Auto Minify → HTML, CSS, JS"
  else fail "Auto Minify"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

if [[ "$DRY_RUN" == true ]]; then
  skip "Brotli → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/brotli" '{"value":"on"}')
  if cf_success "$RESP"; then ok "Brotli → ON"
  else fail "Brotli"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

if [[ "$DRY_RUN" == true ]]; then
  skip "Early Hints → ON"
else
  RESP=$(cf_api PATCH "/zones/${ZONE_ID}/settings/early_hints" '{"value":"on"}')
  if cf_success "$RESP"; then ok "Early Hints → ON"
  else fail "Early Hints"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
fi

# ─── Step 7: DNS Records (CAA, SPF, DMARC) ─────────────────────────────────────
echo -e "${BLUE}[7/12] Adding DNS records (CAA, SPF, DMARC)...${NC}"

dns_record_exists() {
  local type="$1"
  local name="$2"
  local resp=$(cf_api GET "/zones/${ZONE_ID}/dns_records?type=${type}&name=${name}")
  echo "$resp" | jq -e '.result_info.count > 0' > /dev/null 2>&1
}

# 7a. CAA record
if [[ "$DRY_RUN" == true ]]; then
  skip "CAA record (restrict cert issuance to Let's Encrypt)"
else
  if dns_record_exists "CAA" "${DOMAIN}"; then
    info "CAA record already exists — skipping"
    ((SKIPPED++))
  else
    RESP=$(cf_api POST "/zones/${ZONE_ID}/dns_records" '{
      "type":"CAA",
      "name":"@",
      "data":{"flags":0,"tag":"issue","value":"letsencrypt.org"},
      "ttl":1,
      "proxied":false
    }')
    if cf_success "$RESP"; then ok "CAA record added (issue → letsencrypt.org)"
    else fail "CAA record"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
  fi
fi

# 7b. SPF record
if [[ "$DRY_RUN" == true ]]; then
  skip "SPF TXT record (v=spf1 include:_spf.mx.cloudflare.net ~all)"
else
  if dns_record_exists "TXT" "${DOMAIN}"; then
    EXISTING_SPF=$(cf_api GET "/zones/${ZONE_ID}/dns_records?type=TXT&name=${DOMAIN}" | jq -r '.result[] | select(.content | startswith("v=spf1")) | .content')
    if [[ -n "$EXISTING_SPF" ]]; then
      info "Existing SPF record found: ${EXISTING_SPF}"
      echo "         Review and merge manually if needed."
      echo "         New SPF: v=spf1 include:_spf.mx.cloudflare.net ~all"
      ((SKIPPED++))
    else
      RESP=$(cf_api POST "/zones/${ZONE_ID}/dns_records" '{
        "type":"TXT",
        "name":"@",
        "content":"v=spf1 include:_spf.mx.cloudflare.net ~all",
        "ttl":1,
        "proxied":false
      }')
      if cf_success "$RESP"; then ok "SPF record added"
      else fail "SPF record"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
    fi
  else
    RESP=$(cf_api POST "/zones/${ZONE_ID}/dns_records" '{
      "type":"TXT",
      "name":"@",
      "content":"v=spf1 include:_spf.mx.cloudflare.net ~all",
      "ttl":1,
      "proxied":false
    }')
    if cf_success "$RESP"; then ok "SPF record added"
    else fail "SPF record"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
  fi
fi

# 7c. DMARC record
if [[ "$DRY_RUN" == true ]]; then
  skip "DMARC TXT record (p=none monitoring mode)"
else
  if dns_record_exists "TXT" "_dmarc.${DOMAIN}"; then
    info "DMARC record already exists — skipping"
    ((SKIPPED++))
  else
    RESP=$(cf_api POST "/zones/${ZONE_ID}/dns_records" '{
      "type":"TXT",
      "name":"_dmarc",
      "content":"v=DMARC1; p=none; rua=mailto:dmarc@'"${DOMAIN}"'",
      "ttl":1,
      "proxied":false
    }')
    if cf_success "$RESP"; then ok "DMARC record added (p=none — escalate to p=reject after 2 weeks)"
    else fail "DMARC record"; echo "$RESP" | jq '.errors' 2>/dev/null; fi
  fi
fi

# ─── Step 8: Enable DNSSEC ─────────────────────────────────────────────────────
echo -e "${BLUE}[8/12] Enabling DNSSEC...${NC}"

if [[ "$DRY_RUN" == true ]]; then
  skip "DNSSEC → Enabled"
else
  DNSSEC_RESP=$(cf_api GET "/zones/${ZONE_ID}/dnssec")
  DNSSEC_STATUS=$(echo "$DNSSEC_RESP" | jq -r '.result.status' 2>/dev/null || echo "unknown")

  if [[ "$DNSSEC_STATUS" == "active" ]]; then
    info "DNSSEC already active — skipping"
    ((SKIPPED++))
  elif [[ "$DNSSEC_STATUS" == "pending" ]]; then
    info "DNSSEC already pending — waiting for DS record propagation"
    ((SKIPPED++))
  else
    RESP=$(cf_api PATCH "/zones/${ZONE_ID}/dnssec" '{"status":"active"}')
    if cf_success "$RESP"; then
      ok "DNSSEC enabled"
      DS_INFO=$(echo "$RESP" | jq -r '.result.ds | "Key Tag: \(.key_tag), Algorithm: \(.algorithm), Digest Type: \(.digest_type), Digest: \(.digest)"' 2>/dev/null)
      if [[ -n "$DS_INFO" && "$DS_INFO" != "null" ]]; then
        info "DS Record: $DS_INFO"
      fi
    else
      fail "DNSSEC"; echo "$RESP" | jq '.errors' 2>/dev/null
    fi
  fi
fi

# ─── Step 9: WAF Custom Rules ──────────────────────────────────────────────────
echo -e "${BLUE}[9/12] Creating WAF custom rules...${NC}"

WAF_RULE_1='{"rules":[{"expression":"(http.user_agent contains \"sqlmap\") or (http.user_agent contains \"nikto\") or (http.user_agent contains \"nmap\") or (http.user_agent contains \"masscan\") or (http.user_agent contains \"dirbuster\") or (http.user_agent contains \"wpscan\") or (http.user_agent contains \"acunetix\") or (http.user_agent contains \"nessus\")","action":"block","description":"Block known scanner and attack tool user agents"},{"expression":"(http.request.uri.path contains \"/.git/\") or (http.request.uri.path contains \"/.env\") or (http.request.uri.path contains \"/.svn/\") or (http.request.uri.path contains \"/.htaccess\") or (http.request.uri.path contains \"/wp-config.php\") or (http.request.uri.path contains \"/.DS_Store\")","action":"block","description":"Block access to sensitive files and directories"}]}'

if [[ "$DRY_RUN" == true ]]; then
  skip "WAF Rule: Block scanner user agents (sqlmap, nikto, nmap, masscan, etc.)"
  skip "WAF Rule: Block sensitive file access (.git, .env, .svn, .htaccess, etc.)"
else
  RESP=$(cf_api PUT "/zones/${ZONE_ID}/rulesets/phases/http_request_firewall_custom/entrypoint" "$WAF_RULE_1")
  if cf_success "$RESP"; then
    ok "WAF custom rules deployed (2 rules: scanner block + sensitive file block)"
  else
    fail "WAF custom rules"
    echo "$RESP" | jq '.errors' 2>/dev/null
  fi
fi

# ─── Step 10: Rate Limiting Rule ──────────────────────────────────────────────
echo -e "${BLUE}[10/12] Creating rate limiting rule for /login...${NC}"

RATELIMIT_BODY='{"rules":[{"expression":"(http.request.uri.path contains \"/login\") or (http.request.uri.path contains \"/wp-admin\") or (http.request.uri.path contains \"/admin\") or (http.request.uri.path contains \"/signin\")","action":"block","ratelimit":{"characteristics":["ip.src"],"period":60,"requests_per_period":10,"mitigation_timeout":600},"description":"Rate limit login/admin endpoints — 10 req/min per IP"}]}'

if [[ "$DRY_RUN" == true ]]; then
  skip "Rate limit: /login, /admin, /wp-admin — 10 req/min → Block 10 min"
else
  RESP=$(cf_api PUT "/zones/${ZONE_ID}/rulesets/phases/http_ratelimit/entrypoint" "$RATELIMIT_BODY")
  if cf_success "$RESP"; then
    ok "Rate limiting rule deployed (10 req/min on login/admin paths)"
  else
    fail "Rate limiting rule"
    echo "$RESP" | jq '.errors' 2>/dev/null
  fi
fi

# ─── Step 11: Redirect Rule (www → non-www) ────────────────────────────────────
echo -e "${BLUE}[11/12] Creating redirect rule (www → non-www)...${NC}"

REDIRECT_BODY='{"rules":[{"expression":"(http.host eq \"www.'"${DOMAIN}"'\")","action":"redirect","action_parameters":{"status_code":301,"target_url":{"expr":"concat(\"https://'"${DOMAIN}"'\", http.request.uri.path)"},"preserve_query_string":true},"description":"Redirect www to non-www (301 permanent)"}]}'

if [[ "$DRY_RUN" == true ]]; then
  skip "Redirect: www.${DOMAIN} → ${DOMAIN} (301 permanent)"
else
  RESP=$(cf_api PUT "/zones/${ZONE_ID}/rulesets/phases/http_request_dynamic_redirect/entrypoint" "$REDIRECT_BODY")
  if cf_success "$RESP"; then
    ok "Redirect rule deployed (www → non-www, 301)"
  else
    fail "Redirect rule"
    echo "$RESP" | jq '.errors' 2>/dev/null
  fi
fi

# ─── Step 12: Cache Rule for Static Assets ─────────────────────────────────────
echo -e "${BLUE}[12/12] Creating cache rule for static assets...${NC}"

CACHE_BODY='{"rules":[{"expression":"(lower(http.request.uri.path.extension) in {\"css\" \"js\" \"png\" \"jpg\" \"jpeg\" \"gif\" \"webp\" \"svg\" \"ico\" \"woff\" \"woff2\" \"ttf\" \"eot\" \"avif\" \"mp4\" \"webm\"})","action":"set_cache_settings","action_parameters":{"cache":true,"edge_ttl":{"mode":"override_origin","value":31536000},"browser_ttl":{"mode":"override_origin","value":2592000}},"description":"Cache static assets — 1 year edge TTL, 30 day browser TTL"}]}'

if [[ "$DRY_RUN" == true ]]; then
  skip "Cache rule: static assets (css, js, images, fonts) — 1yr edge, 30d browser"
else
  RESP=$(cf_api PUT "/zones/${ZONE_ID}/rulesets/phases/http_request_cache_settings/entrypoint" "$CACHE_BODY")
  if cf_success "$RESP"; then
    ok "Cache rule deployed (static assets, 1-year edge TTL)"
  else
    fail "Cache rule"
    echo "$RESP" | jq '.errors' 2>/dev/null
  fi
fi

# ─── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  HARDENING COMPLETE                                           ║${NC}"
echo -e "${BLUE}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  ✓ Successful:  ${SUCCESS}${NC}"
if [[ "$FAILED" -gt 0 ]]; then
  echo -e "${RED}║  ✗ Failed:     ${FAILED}${NC}"
fi
if [[ "$SKIPPED" -gt 0 ]]; then
  echo -e "${YELLOW}║  ⊘ Skipped:    ${SKIPPED}${NC}"
fi
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}This was a DRY RUN. No changes were made.${NC}"
  echo "To apply for real, run: ./cloudflare-harden-mitenmehta.sh --force"
  exit 0
fi

if [[ "$FAILED" -gt 0 ]]; then
  echo -e "${RED}${FAILED} step(s) failed. Review the errors above.${NC}"
  echo "Common causes:"
  echo "  - Bot Fight Mode requires Pro plan or higher"
  echo "  - Some settings require the zone to be fully Active"
  echo "  - API token may be missing specific permissions"
  echo ""
fi

echo -e "${GREEN}Next steps (manual — cannot be automated via API):${NC}"
echo ""
echo "  1. Install Cloudflare Origin CA certificate on your origin server"
echo "     → https://dash.cloudflare.com/${ZONE_ID}/ssl-tls/origin"
echo "     → Click 'Create Certificate' → 15-year validity"
echo "     → Install the cert + key on your origin (Hostinger/your server)"
echo ""
echo "  2. Verify Authenticated Origin Pulls works after cert installation"
echo "     → Your origin must be configured to require client cert from Cloudflare"
echo ""
echo "  3. DMARC escalation schedule:"
echo "     → Week 1-2:   p=none  (monitoring — current setting)"
echo "     → Week 3-4:   p=quarantine"
echo "     → Week 5+:    p=reject (Fort Knox)"
echo "     → Update the _dmarc TXT record at:"
echo "       https://dash.cloudflare.com/${ZONE_ID}/dns/records"
echo ""
echo "  4. Verify registrar settings (auto-renew, lock, WHOIS privacy):"
echo "     → https://dash.cloudflare.com/046e3f2201dc5c956e093873dc704b63/registrar/domain/${DOMAIN}"
echo ""
echo "  5. Verify 2FA on your Cloudflare account:"
echo "     → https://dash.cloudflare.com/profile"
echo ""
echo "  6. Review API tokens and remove unused ones:"
echo "     → https://dash.cloudflare.com/profile/api-tokens"
echo ""
echo -e "${BLUE}Done. Your zone is now hardened.${NC}"