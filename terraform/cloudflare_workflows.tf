# Cloudflare Workflows are intentionally not managed by this Terraform module.
#
# This module pins cloudflare/cloudflare ~> 4.52 because the Fort Knox zone
# resources below use the provider-v4 schema. The cloudflare_workflow resource
# was introduced in provider v5.11, whose schemas are not backward-compatible
# with this module. Keeping a v5-only resource in this directory makes
# `tofu validate` fail before the zone hardening plan can run.
#
# The OrchestrAI workflow remains deployed through its Wrangler configuration.
# Migrate this declaration into a separate provider-v5 module before managing
# it with OpenTofu; do not mix provider-v4 and provider-v5 resources here.
