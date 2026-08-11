# Cloudflare Fort Knox Hardening Script — mitenmehta.com

## Quick Start

```bash
# 1. Create a Cloudflare API token
#    Go to: https://dash.cloudflare.com/profile/api-tokens
#    Click "Create Token" → "Custom token"
#    Required permissions:
#      Zone > Zone > Read
#      Zone > Zone Settings > Edit
#      Zone > DNS > Edit
#      Zone > SSL and Certificate Management > Edit
#      Zone > WAF > Edit
#      Zone > Cache Rules > Edit
#      Zone > Redirect Rules > Edit
#    Zone Resources: Include → Specific zone → mitenmehta.com

# 2. Set your token
export CF_API_TOKEN="your-api-token-here"

# 3. Dry run first (preview changes, no modifications)
chmod +x cloudflare-harden-mitenmehta.sh
./cloudflare-harden-mitenmehta.sh --dry-run

# 4. Execute for real
./cloudflare-harden-mitenmehta.sh --force
```

## What This Script Does

| Step | Action | Category |
|------|--------|----------|
| 1 | Finds zone ID for mitenmehta.com | Setup |
| 2 | Sets SSL/TLS to Full (Strict) | SSL/TLS |
| 3 | Enables Always Use HTTPS, HSTS (6mo, preload), Min TLS 1.2, TLS 1.3, 0-RTT, Opportunistic Encryption, Authenticated Origin Pulls | SSL/TLS |
| 4 | Enables Bot Fight Mode | Security |
| 5 | Sets Security Level to High, Browser Integrity Check ON | Security |
| 6 | Enables Auto Minify (HTML/CSS/JS), Brotli, Early Hints | Performance |
| 7 | Adds DNS records: CAA (Let's Encrypt), SPF, DMARC (p=none) | DNS/Email |
| 8 | Enables DNSSEC | DNS |
| 9 | Creates WAF rules: block scanners (sqlmap, nikto, nmap, etc.), block sensitive files (.git, .env, .htaccess) | WAF |
| 10 | Creates rate limiting rule: 10 req/min on /login, /admin, /wp-admin | WAF |
| 11 | Creates redirect rule: www → non-www (301 permanent) | Redirects |
| 12 | Creates cache rule: static assets cached 1 year at edge, 30 days in browser | Caching |

## Manual Steps After Running the Script

1. **Install Cloudflare Origin CA Certificate** on your origin server
   - https://dash.cloudflare.com → mitenmehta.com → SSL/TLS → Origin Server
   - Create Certificate (15-year validity)
   - Install cert + private key on your origin (Hostinger/your server)

2. **DMARC Escalation** (change the _dmarc TXT record over 4-6 weeks):
   - Week 1-2: `v=DMARC1; p=none; rua=mailto:dmarc@mitenmehta.com` (current)
   - Week 3-4: `v=DMARC1; p=quarantine; rua=mailto:dmarc@mitenmehta.com`
   - Week 5+: `v=DMARC1; p=reject; rua=mailto:dmarc@mitenmehta.com` (Fort Knox)

3. **Verify Registrar settings**: auto-renew ON, registrar lock ON, WHOIS privacy ON
   - https://dash.cloudflare.com → mitenmehta.com → Registrar

4. **Verify 2FA** on your Cloudflare account
   - https://dash.cloudflare.com/profile

5. **Clean up API tokens** — remove unused ones
   - https://dash.cloudflare.com/profile/api-tokens

## Flags

```bash
./cloudflare-harden-mitenmehta.sh              # Interactive (asks for confirmation)
./cloudflare-harden-mitenmehta.sh --force       # Skip confirmation
./cloudflare-harden-mitenmehta.sh --dry-run     # Preview only, no changes
```

## Requirements

- `curl` and `jq` installed
- Cloudflare API token with the permissions listed above
- Zone mitenmehta.com must be Active (not pending transfer)

## Troubleshooting

- **"Zone not found"** → Make sure mitenmehta.com is added to Cloudflare and zone status is Active
- **"Bot Fight Mode failed"** → May require Pro plan or higher (Free plan may not support API toggle)
- **"SSL Full Strict broke my site"** → Install Origin CA cert first, then re-enable
- **"Permission denied"** → Your API token is missing required permissions. Recreate it with all permissions listed above
