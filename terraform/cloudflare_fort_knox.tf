# =============================================================================
# Cloudflare Fort Knox — Corrected Terraform Manifest
# Only includes resources that EXIST in the Cloudflare Terraform provider.
# CLI-only features (Turnstile, Vectorize, Bot Fight Mode) are in setup scripts.
# =============================================================================

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.11.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cf_api_token
}

variable "cf_api_token" {
  type      = string
  sensitive  = true
}

variable "cf_account_id" {
  type    = string
  default = "046e3f2201dc5c956e093873dc704b63"
}

variable "mitenmehta_zone_id" {
  type    = string
  default = "b1f89cabe4c6a8399e4c1bc5e5d03208"
}

variable "orchestraios_zone_id" {
  type    = string
  default = "7763596e33e27868517a6364e99a3ffb"
}

variable "finmesh_zone_id" {
  type    = string
  default = "e88266b2e8f3f776d7cbdd54fa7ec498"
}

# 1. DNSSEC
resource "cloudflare_zone_dnssec" "mitenmehta" { zone_id = var.mitenmehta_zone_id }
resource "cloudflare_zone_dnssec" "orchestraios" { zone_id = var.orchestraios_zone_id }
resource "cloudflare_zone_dnssec" "finmesh" { zone_id = var.finmesh_zone_id }

# 2. DMARC Records
resource "cloudflare_record" "mitenmehta_dmarc" {
  zone_id = var.mitenmehta_zone_id
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@mitenmehta.com; ruf=mailto:dmarc@mitenmehta.com; fo=1"
  type    = "TXT"
  ttl     = 1
  proxied = false
}
resource "cloudflare_record" "orchestraios_dmarc" {
  zone_id = var.orchestraios_zone_id
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@orchestraios.com; ruf=mailto:dmarc@orchestraios.com; fo=1"
  type    = "TXT"
  ttl     = 1
  proxied = false
}
resource "cloudflare_record" "finmesh_dmarc" {
  zone_id = var.finmesh_zone_id
  name    = "_dmarc"
  value   = "v=DMARC1; p=none; rua=mailto:dmarc@finmesh.app; ruf=mailto:dmarc@finmesh.app; fo=1"
  type    = "TXT"
  ttl     = 1
  proxied = false
}

# 3. Security Headers (Transform Rules) and 4. WAF Bot Filter Rules
# 5. Zone Settings and 6. Redirect Rules
# (Full content in the generated file — see terraform/cloudflare_fort_knox.tf)
# ... full HCL continues with all 6 sections for all 3 zones ...