# OrchestrAI OS — Sovereign Cloudflare Infrastructure-as-Code (Terraform HCL)
# Fort Knox Security & Hardening Spec for mitenmehta.com, orchestraios.com, and finmesh.app

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

resource "cloudflare_zone_dnssec" "mitenmehta_dnssec" {
  zone_id = "b1f89cabe4c6a8399e4c1bc5e5d03208"
}

resource "cloudflare_record" "mitenmehta_dmarc" {
  zone_id = "b1f89cabe4c6a8399e4c1bc5e5d03208"
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@mitenmehta.com; ruf=mailto:dmarc@mitenmehta.com"
  type    = "TXT"
  ttl     = 1
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

resource "cloudflare_zone_dnssec" "orchestraios_dnssec" {
  zone_id = "7763596e33e27868517a6364e99a3ffb"
}

resource "cloudflare_record" "orchestraios_dmarc" {
  zone_id = "7763596e33e27868517a6364e99a3ffb"
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@orchestraios.com; ruf=mailto:dmarc@orchestraios.com"
  type    = "TXT"
  ttl     = 1
}

# ------------------------------------------------------------------------------
# 3. ZONE: finmesh.app (Zone ID: e88266b2e8f3f776d7cbdd54fa7ec498)
# ------------------------------------------------------------------------------
resource "cloudflare_zone_settings_override" "finmesh_settings" {
  zone_id = "e88266b2e8f3f776d7cbdd54fa7ec498"

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

resource "cloudflare_zone_dnssec" "finmesh_dnssec" {
  zone_id = "e88266b2e8f3f776d7cbdd54fa7ec498"
}

resource "cloudflare_record" "finmesh_dmarc" {
  zone_id = "e88266b2e8f3f776d7cbdd54fa7ec498"
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@finmesh.app; ruf=mailto:dmarc@finmesh.app"
  type    = "TXT"
  ttl     = 1
}
