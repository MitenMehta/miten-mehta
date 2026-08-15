terraform {
  required_version = ">= 1.8.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.52.8"
    }
  }
}

variable "cloudflare_account_id" {
  description = "Cloudflare account containing mitenmehta.com."
  type        = string
  default     = "046e3f2201dc5c956e093873dc704b63"
}

variable "zone_id" {
  description = "Cloudflare zone ID for mitenmehta.com."
  type        = string
  default     = "b1f89cabe4c6a8399e4c1bc5e5d03208"
}

resource "cloudflare_zone_settings_override" "mitenmehta" {
  zone_id = var.zone_id

  settings {
    ssl                      = "strict"
    always_use_https         = "on"
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    browser_check            = "on"
    security_level           = "high"
    brotli                   = "on"
    zero_rtt                 = "off"

    security_header {
      enabled            = true
      max_age            = 31536000
      include_subdomains = true
      preload            = true
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_zone_dnssec" "mitenmehta" {
  zone_id = var.zone_id

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_record" "dmarc" {
  zone_id = var.zone_id
  name    = "_dmarc"
  content = "v=DMARC1; p=quarantine; rua=mailto:mitennmehta@gmail.com; ruf=mailto:mitennmehta@gmail.com; fo=1"
  type    = "TXT"
  ttl     = 1

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_ruleset" "security_headers" {
  zone_id     = var.zone_id
  name        = "mitenmehta-security-transform-headers"
  description = "Security response headers for mitenmehta.com"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name      = "Content-Security-Policy"
        operation = "set"
        value     = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
      }
      headers {
        name      = "Permissions-Policy"
        operation = "set"
        value     = "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
      }
      headers {
        name      = "Referrer-Policy"
        operation = "set"
        value     = "strict-origin-when-cross-origin"
      }
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
        value     = "DENY"
      }
    }
    expression  = "true"
    description = "Enforce Track A security headers"
    enabled     = true
  }

  lifecycle {
    prevent_destroy = true
  }
}
