# OrchestrAI OS — Sovereign Cloudflare Infrastructure-as-Code (Terraform HCL)
# Fort Knox Security & Hardening Spec for mitenmehta.com and orchestraios.com

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
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
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    browser_check            = "on"
    security_level           = "high"
    brotli                   = "on"
    zero_rtt                 = "off"

    hsts {
      enabled            = true
      max_age            = 31536000 # 12 months HSTS
      include_subdomains = true
      preload            = true
    }
  }
}

# DNSSEC mitenmehta.com
resource "cloudflare_zone_dnssec" "mitenmehta_dnssec" {
  zone_id = "b1f89cabe4c6a8399e4c1bc5e5d03208"
}

# DMARC Record mitenmehta.com
resource "cloudflare_record" "mitenmehta_dmarc" {
  zone_id = "b1f89cabe4c6a8399e4c1bc5e5d03208"
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@mitenmehta.com; ruf=mailto:dmarc@mitenmehta.com"
  type    = "TXT"
  ttl     = 1
}

# Security Headers Transform Rule mitenmehta.com
resource "cloudflare_ruleset" "mitenmehta_security_headers" {
  zone_id     = "b1f89cabe4c6a8399e4c1bc5e5d03208"
  name        = "Fort Knox Security Headers"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name      = "Strict-Transport-Security"
        value     = "max-age=31536000; includeSubDomains; preload"
        operation = "set"
      }
      headers {
        name      = "X-Content-Type-Options"
        value     = "nosniff"
        operation = "set"
      }
      headers {
        name      = "X-Frame-Options"
        value     = "SAMEORIGIN"
        operation = "set"
      }
      headers {
        name      = "Referrer-Policy"
        value     = "strict-origin-when-cross-origin"
        operation = "set"
      }
      headers {
        name      = "Permissions-Policy"
        value     = "camera=(), microphone=(), geolocation=()"
        operation = "set"
      }
    }
    expression  = "true"
    description = "Enforce Fort Knox Security Headers across all responses"
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
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    browser_check            = "on"
    security_level           = "high"
    brotli                   = "on"
    zero_rtt                 = "off"

    hsts {
      enabled            = true
      max_age            = 31536000 # 12 months HSTS
      include_subdomains = true
      preload            = true
    }
  }
}

# DNSSEC orchestraios.com
resource "cloudflare_zone_dnssec" "orchestraios_dnssec" {
  zone_id = "7763596e33e27868517a6364e99a3ffb"
}

# DMARC Record orchestraios.com
resource "cloudflare_record" "orchestraios_dmarc" {
  zone_id = "7763596e33e27868517a6364e99a3ffb"
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@orchestraios.com; ruf=mailto:dmarc@orchestraios.com"
  type    = "TXT"
  ttl     = 1
}

# Security Headers Transform Rule orchestraios.com
resource "cloudflare_ruleset" "orchestraios_security_headers" {
  zone_id     = "7763596e33e27868517a6364e99a3ffb"
  name        = "Fort Knox Security Headers"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name      = "Strict-Transport-Security"
        value     = "max-age=31536000; includeSubDomains; preload"
        operation = "set"
      }
      headers {
        name      = "X-Content-Type-Options"
        value     = "nosniff"
        operation = "set"
      }
      headers {
        name      = "X-Frame-Options"
        value     = "SAMEORIGIN"
        operation = "set"
      }
      headers {
        name      = "Referrer-Policy"
        value     = "strict-origin-when-cross-origin"
        operation = "set"
      }
      headers {
        name      = "Permissions-Policy"
        value     = "camera=(), microphone=(), geolocation=()"
        operation = "set"
      }
    }
    expression  = "true"
    description = "Enforce Fort Knox Security Headers across all responses"
    enabled     = true
  }
}
