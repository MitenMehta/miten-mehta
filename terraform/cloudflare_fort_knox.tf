# OrchestrAI OS — Sovereign Cloudflare Infrastructure-as-Code (Terraform / OpenTofu HCL)
# Fort Knox Security & Hardening Spec for mitenmehta.com, orchestraios.com, and finmesh.app

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.52"
    }
  }
}

variable "cloudflare_account_id" {
  type        = string
  default     = "046e3f2201dc5c956e093873dc704b63"
  description = "Cloudflare Account ID"
}

# ------------------------------------------------------------------------------
# 1. ZONE: mitenmehta.com (Zone ID: b1f89cabe4c6a8399e4c1bc5e5d03208)
# ------------------------------------------------------------------------------
resource "cloudflare_zone_settings_override" "mitenmehta_settings" {
  zone_id = "b1f89cabe4c6a8399e4c1bc5e5d03208"

  settings {
    ssl                      = "full"
    always_use_https         = "on"
    min_tls_version          = "1.3" # Upgraded from 1.2 to 1.3
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    browser_check            = "on"
    security_level           = "high"
    brotli                   = "on"
    zero_rtt                 = "off"

    security_header {
      enabled            = true
      max_age            = 31536000 # 12 months HSTS
      include_subdomains = true
      preload            = true
    }
  }
}

resource "cloudflare_zone_dnssec" "mitenmehta_dnssec" {
  zone_id = "b1f89cabe4c6a8399e4c1bc5e5d03208"
}

resource "cloudflare_record" "mitenmehta_dmarc" {
  zone_id = "b1f89cabe4c6a8399e4c1bc5e5d03208"
  name    = "_dmarc"
  content = "v=DMARC1; p=quarantine; rua=mailto:mitennmehta@gmail.com; ruf=mailto:mitennmehta@gmail.com; fo=1"
  type    = "TXT"
  ttl     = 1
}

resource "cloudflare_ruleset" "mitenmehta_headers" {
  zone_id     = "b1f89cabe4c6a8399e4c1bc5e5d03208"
  name        = "mitenmehta-security-transform-headers"
  description = "Security Headers Transform Ruleset (HSTS, CSP, X-Content-Type-Options, X-Frame-Options)"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name      = "Strict-Transport-Security"
        operation = "set"
        value     = "max-age=31536000; includeSubDomains; preload"
      }
      headers {
        name      = "X-Content-Type-Options"
        operation = "set"
        value     = "nosniff"
      }
      headers {
        name      = "X-Frame-Options"
        operation = "set"
        value     = "SAMEORIGIN"
      }
      headers {
        name      = "Referrer-Policy"
        operation = "set"
        value     = "strict-origin-when-cross-origin"
      }
      headers {
        name      = "Content-Security-Policy"
        operation = "set"
        value     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.cloudflare.com; frame-ancestors 'none'"
      }
    }
    expression  = "true"
    description = "Enforce Strict Security Headers"
    enabled     = true
  }
}

# ------------------------------------------------------------------------------
# 2. ZONE: orchestraios.com (Zone ID: 7763596e33e27868517a6364e99a3ffb)
# ------------------------------------------------------------------------------
resource "cloudflare_zone_settings_override" "orchestraios_settings" {
  zone_id = "7763596e33e27868517a6364e99a3ffb"

  settings {
    ssl                      = "full"
    always_use_https         = "on"
    min_tls_version          = "1.3" # Upgraded from 1.2 to 1.3
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    browser_check            = "on"
    security_level           = "high"
    brotli                   = "on"
    zero_rtt                 = "off"

    security_header {
      enabled            = true
      max_age            = 31536000 # 12 months HSTS
      include_subdomains = true
      preload            = true
    }
  }
}

resource "cloudflare_zone_dnssec" "orchestraios_dnssec" {
  zone_id = "7763596e33e27868517a6364e99a3ffb"
}

resource "cloudflare_record" "orchestraios_dmarc" {
  zone_id = "7763596e33e27868517a6364e99a3ffb"
  name    = "_dmarc"
  content = "v=DMARC1; p=quarantine; rua=mailto:admin@orchestraios.com; ruf=mailto:admin@orchestraios.com; fo=1"
  type    = "TXT"
  ttl     = 1
}

resource "cloudflare_ruleset" "orchestraios_headers" {
  zone_id     = "7763596e33e27868517a6364e99a3ffb"
  name        = "orchestraios-security-transform-headers"
  description = "Security Headers Transform Ruleset (HSTS, CSP, X-Content-Type-Options, X-Frame-Options)"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name      = "Strict-Transport-Security"
        operation = "set"
        value     = "max-age=31536000; includeSubDomains; preload"
      }
      headers {
        name      = "X-Content-Type-Options"
        operation = "set"
        value     = "nosniff"
      }
      headers {
        name      = "X-Frame-Options"
        operation = "set"
        value     = "SAMEORIGIN"
      }
      headers {
        name      = "Referrer-Policy"
        operation = "set"
        value     = "strict-origin-when-cross-origin"
      }
      headers {
        name      = "Content-Security-Policy"
        operation = "set"
        value     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.cloudflare.com; frame-ancestors 'none'"
      }
    }
    expression  = "true"
    description = "Enforce Strict Security Headers"
    enabled     = true
  }
}

# ------------------------------------------------------------------------------
# 3. ZONE: finmesh.app (Zone ID: e88266b2e8f3f776d7cbdd54fa7ec498)
# ------------------------------------------------------------------------------
resource "cloudflare_zone_settings_override" "finmesh_settings" {
  zone_id = "e88266b2e8f3f776d7cbdd54fa7ec498"

  settings {
    ssl                      = "full"
    always_use_https         = "on"
    min_tls_version          = "1.3" # Upgraded from 1.2 to 1.3
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    browser_check            = "on"
    security_level           = "high"
    brotli                   = "on"
    zero_rtt                 = "off"

    security_header {
      enabled            = true
      max_age            = 31536000 # 12 months HSTS
      include_subdomains = true
      preload            = true
    }
  }
}

resource "cloudflare_zone_dnssec" "finmesh_dnssec" {
  zone_id = "e88266b2e8f3f776d7cbdd54fa7ec498"
}

resource "cloudflare_record" "finmesh_dmarc" {
  zone_id = "e88266b2e8f3f776d7cbdd54fa7ec498"
  name    = "_dmarc"
  content = "v=DMARC1; p=quarantine; rua=mailto:mitennmehta@gmail.com; ruf=mailto:mitennmehta@gmail.com; fo=1"
  type    = "TXT"
  ttl     = 1
}

resource "cloudflare_ruleset" "finmesh_headers" {
  zone_id     = "e88266b2e8f3f776d7cbdd54fa7ec498"
  name        = "finmesh-security-transform-headers"
  description = "Security Headers Transform Ruleset (HSTS, CSP, X-Content-Type-Options, X-Frame-Options)"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name      = "Strict-Transport-Security"
        operation = "set"
        value     = "max-age=31536000; includeSubDomains; preload"
      }
      headers {
        name      = "X-Content-Type-Options"
        operation = "set"
        value     = "nosniff"
      }
      headers {
        name      = "X-Frame-Options"
        operation = "set"
        value     = "SAMEORIGIN"
      }
      headers {
        name      = "Referrer-Policy"
        operation = "set"
        value     = "strict-origin-when-cross-origin"
      }
      headers {
        name      = "Content-Security-Policy"
        operation = "set"
        value     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.cloudflare.com; frame-ancestors 'none'"
      }
    }
    expression  = "true"
    description = "Enforce Strict Security Headers"
    enabled     = true
  }
}
