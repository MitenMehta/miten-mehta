# MitenMehta.com Track A infrastructure

This module deliberately contains only `mitenmehta.com` resources. It must not manage `orchestraios.com`, `finmesh.app`, AGY, MCP, or Ewaya resources.

CI performs formatting, initialization without a backend, and validation. CI does **not** apply this module.

Before the first production plan or apply:

1. Configure an approved remote backend with locking and restricted credentials.
2. Import the existing zone settings, DNSSEC, DMARC record, and response-header ruleset into that backend.
3. Run a refresh-only plan and retain the receipt.
4. Review a normal plan and confirm it targets only the zone ID in this module.
5. Obtain explicit production approval and document rollback probes.

Never use `-lock=false`, scheduled mutation, cached local state, or unattended `-auto-approve` for production.
