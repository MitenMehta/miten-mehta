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

## Repository control-plane audit

For every PR, verify and report whether these GitHub controls are actually configured rather than merely documented:

- automatic Copilot code review, where supported by the repository plan;
- branch protection or repository rulesets for `main` and `integrate/virtual-miten-launch`;
- required successful status checks before merge;
- required approving review and resolution of review conversations;
- CODEOWNERS review where supported;
- prevention of direct pushes and force pushes;
- prevention of branch deletion;
- a PR evidence template;
- integration-to-main promotion through a reviewed workflow;
- least-privilege GitHub Actions permissions and pinned third-party actions.

If a control is missing, mark it **BLOCKED**, name the repository administrator as owner, and provide the exact GitHub setting, ruleset change, or reviewed configuration required. Never claim that this instruction file configured a server-side GitHub setting.

Copilot may prepare a proposed workflow, ruleset payload, CODEOWNERS change, or PR template on a feature branch. It must not apply repository-admin settings, grant itself authority, weaken protections, merge, or deploy without explicit approval.

## GitHub setup and drift prompt

When asked to configure or audit GitHub governance, use this operating prompt:

> Audit the repository against the canonical MCL and inspect the live GitHub configuration. Verify automatic Copilot review, rulesets, protected branches, required checks, required approvals, review-conversation resolution, CODEOWNERS, force-push/deletion prevention, PR templates, Actions permissions, environment approvals, and the integration-to-main promotion path. Distinguish file-backed controls from GitHub server-side settings. Implement only safe file-backed changes on a feature branch. For server-side changes, produce an exact least-privilege proposal and wait for explicit repository-administrator approval. Re-read the live configuration after any approved change and return PASS/FAIL/BLOCKED with evidence.
