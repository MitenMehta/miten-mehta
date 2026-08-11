#!/usr/bin/env python3
"""
OrchestrAI OS — Sovereign Autonomous Cloudflare Audit & Hardening Engine
Fully autonomous execution across mitenmehta.com and orchestraios.com.
No manual chatbot clicks required.
"""

import sys
import os
import json
import time
import urllib.request

DOMAINS = ["mitenmehta.com", "orchestraios.com"]

def get_oauth_token():
    wrangler_path = os.path.expanduser("~/.wrangler/config/default.toml")
    if os.path.exists(wrangler_path):
        with open(wrangler_path, "r") as f:
            for line in f:
                if line.startswith("oauth_token"):
                    return line.split("=")[1].strip().strip('"')
    return os.environ.get("CF_API_TOKEN", "")

def cf_get(endpoint, token):
    url = f"https://api.cloudflare.com/client/v4{endpoint}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"success": False, "error": str(e)}

def audit_domain(domain, token):
    print(f"\n==========================================================================")
    print(f"  Autonomous Cloudflare Forensic Audit — [{domain}]")
    print(f"==========================================================================")

    # 1. Fetch Zone
    zone_res = cf_get(f"/zones?name={domain}", token)
    if not zone_res.get("success") or not zone_res.get("result"):
        print(f"[!] Unable to query zone '{domain}'. Token status: {zone_res}")
        return None

    zone = zone_res["result"][0]
    zone_id = zone["id"]
    status = zone["status"]
    plan = zone["plan"]["name"]
    nameservers = zone.get("name_servers", [])

    print(f"[+] Zone Metadata:")
    print(f"    • Zone ID:     {zone_id}")
    print(f"    • Status:      {status}")
    print(f"    • Plan:        {plan}")
    print(f"    • Nameservers: {', '.join(nameservers)}")

    audit = {
        "domain": domain,
        "zone_id": zone_id,
        "status": status,
        "plan": plan,
        "nameservers": nameservers,
        "settings": {}
    }

    # 2. Audit Settings
    settings_to_check = [
        "ssl", "always_use_https", "min_tls_version", "tls_1_3",
        "security_level", "browser_check", "brotli", "automatic_https_rewrites"
    ]

    for setting in settings_to_check:
        res = cf_get(f"/zones/{zone_id}/settings/{setting}", token)
        if res.get("success"):
            val = res["result"]["value"]
            audit["settings"][setting] = val
            print(f"    • Setting [{setting}]: {val}")
        else:
            audit["settings"][setting] = "Protected/Restricted"
            print(f"    • Setting [{setting}]: Protected (Requires Custom API Token)")

    return audit

def main():
    token = get_oauth_token()
    if not token:
        print("[!] ERROR: Cloudflare OAuth token not found in ~/.wrangler/config/default.toml.")
        sys.exit(1)

    full_report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "audits": []
    }

    for domain in DOMAINS:
        audit_data = audit_domain(domain, token)
        if audit_data:
            full_report["audits"].append(audit_data)

    # Save artifact
    output_path = os.path.expanduser("~/OrchestrAI/scratch/cloudflare_live_audit_report.json")
    with open(output_path, "w") as f:
        json.dump(full_report, f, indent=2)

    print(f"\n[+] Autonomous Cloudflare Audit Complete! Full JSON saved to {output_path}")

if __name__ == "__main__":
    main()
