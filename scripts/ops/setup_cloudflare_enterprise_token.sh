#!/usr/bin/env bash
# OrchestrAI OS — Enterprise Cloudflare Credential Provisioning & Keychain Sync Engine
# Automatically stores CF_API_TOKEN securely in macOS Keychain, exports to shell, and syncs to GitHub Secrets.

set -e

echo "=========================================================================="
echo "  OrchestrAI OS — Enterprise Cloudflare Credential Provisioning Engine"
echo "=========================================================================="

TOKEN_INPUT="${1:-${CF_API_TOKEN:-${CLOUDFLARE_API_TOKEN:-}}}"

if [ -z "$TOKEN_INPUT" ]; then
    echo "[!] Usage: ./scripts/ops/setup_cloudflare_enterprise_token.sh <YOUR_CUSTOM_CF_API_TOKEN>"
    echo "    Or export CF_API_TOKEN='...' before running."
    exit 1
fi

ACCOUNT_ID="046e3f2201dc5c956e093873dc704b63"

# 1. Store securely in macOS Keychain
echo "[+] Storing CF_API_TOKEN in macOS Keychain..."
security delete-generic-password -s "CF_API_TOKEN" 2>/dev/null || true
security add-generic-password -a "mitenmehta" -s "CF_API_TOKEN" -w "$TOKEN_INPUT" -U
echo "    ✓ Successfully saved to macOS Keychain (service: CF_API_TOKEN)"

# 2. Persist to local .env configuration
ENV_FILE="$HOME/OrchestrAI/.env"
echo "[+] Persisting CF_API_TOKEN and CF_ACCOUNT_ID to $ENV_FILE..."
touch "$ENV_FILE"
grep -v "CF_API_TOKEN" "$ENV_FILE" | grep -v "CF_ACCOUNT_ID" > "$ENV_FILE.tmp" || true
echo "export CF_API_TOKEN=\"$TOKEN_INPUT\"" >> "$ENV_FILE.tmp"
echo "export CF_ACCOUNT_ID=\"$ACCOUNT_ID\"" >> "$ENV_FILE.tmp"
mv "$ENV_FILE.tmp" "$ENV_FILE"
chmod 600 "$ENV_FILE"
echo "    ✓ Updated $ENV_FILE (permissions: 0600)"

# 3. Sync to GitHub Secrets via GitHub CLI (if logged in)
if command -v gh >/dev/null 2>&1; then
    echo "[+] Syncing CF_API_TOKEN and CF_ACCOUNT_ID to GitHub Repository Secrets..."
    if gh auth status >/dev/null 2>&1; then
        gh secret set CF_API_TOKEN --body "$TOKEN_INPUT" --repo "MitenMehta/miten-mehta" || true
        gh secret set CF_ACCOUNT_ID --body "$ACCOUNT_ID" --repo "MitenMehta/miten-mehta" || true
        echo "    ✓ Synced secrets to GitHub Repository MitenMehta/miten-mehta"
    else
        echo "    ! GitHub CLI (gh) not logged in. Skipping automated GitHub secret sync."
    fi
else
    echo "    ! gh CLI tool not installed. Skipping automated GitHub secret sync."
fi

echo "=========================================================================="
echo "[+] Enterprise Credential Setup Complete! Local CLI, OpenTofu, and CI/CD ready."
echo "=========================================================================="
