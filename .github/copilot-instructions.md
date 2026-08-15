# GitHub Copilot repository instructions

The canonical launch governance document is [`docs/MITENMEHTA_VIRTUAL_AGENT_MASTER_PLAN.md`](../docs/MITENMEHTA_VIRTUAL_AGENT_MASTER_PLAN.md). Read and apply it to every suggestion, issue, pull request and review in this repository.

## Non-negotiable controls

- Never push or merge directly to `main`.
- Keep website/Cloudflare and OrchestrAIOS/Ewaya work on separate feature branches.
- Integrate only through `integrate/virtual-miten-launch`.
- Never print, commit, request in a PR, or copy a secret.
- Never weaken or bypass a required CI/security test to make a PR green.
- Never describe code or documentation as deployed or operational.
- Reject unsupported SLA, latency, health, layer-count and certification claims.
- Require versioned contract changes for API, MCP, auth, event and error semantics.
- Require tests, security impact, migration/rollback and exact-commit evidence.
- Do not authorize Cloudflare mutations without a reviewed plan and rollback path.

## PR review output

Return a compact matrix covering scope/branch compliance, MCL compliance, security/secrets, tests/CI, contract compatibility, deployment/rollback evidence, and PASS/FAIL/BLOCKED. Name the exact owner, action and acceptance evidence for every blocker. When a PR conflicts with the MCL, request changes and link the relevant section.
