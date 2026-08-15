# MitenMehta.com Virtual AI Agent — Canonical Launch Plan

**Document ID:** MMVA-MCL-001

**Status:** Canonical integration contract; implementation work in progress

**Repository:** `MitenMehta/miten-mehta`

**Integration branch:** `integrate/virtual-miten-launch`

**Production branch:** `main`
**Last updated:** 2026-08-15

## 1. Authority and evidence rule

This document is the Master Control Ledger (MCL) for the MitenMehta.com Virtual AI Agent launch. It is the shared contract for Miten, AGY, Codex Track A, Codex Track B, GitHub Copilot, CI/CD, and human reviewers.

If another document, comment, agent response, dashboard screenshot, or hard-coded application string conflicts with this plan, this plan governs the launch process. Runtime status must still be established from fresh evidence; this document never turns an untested claim into a verified fact.

Every claim must be labelled **DOCUMENTED**, **CODED**, **TESTED**, **DEPLOYED**, **OPERATIONAL**, or **BLOCKED**. Unsupported claims such as `99.999%`, `verified`, `live`, `sub-50ms`, or fixed layer/agent counts are prohibited from customer-facing surfaces.

## 2. Scope separation

### Track A — MitenMehta.com and Cloudflare

**Owner:** Codex website/edge session

**Branch:** `feature/mitenmehta-launch`

Track A owns the website, browser security, dependencies, quality gates, SEO/social readiness, Cloudflare Pages/DNS/TLS/CSP/cache/security/observability, OpenTofu and edge CI/CD, the browser API client, and degraded-mode behavior. It must not implement or certify the internal OrchestrAIOS learning system.

### Track B — OrchestrAIOS and Ewaya bridge

**Owner:** Separate Codex OrchestrAIOS session

**Branch:** `feature/orchestrai-ewaya-bridge`

Track B owns the authenticated agent API and streaming transport, model routing, governed retrieval, OrchestrAIOS availability, supported MCP and OAuth/OIDC, tool controls, durable workflows, retries/DLQ/idempotency, auditability, and the governed Failures–Feedback–Research pipeline. It owns only the Ewaya bridge, not the future Ewaya UI specification. It must not change the MitenMehta.com UI except through a reviewed contract change.

### Independent verification — AGY

AGY is an independent checker, not the source of truth for its own status. AGY receives only read/test scopes and must not receive Cloudflare DNS write access, production secrets, unrestricted MCP execution, or GitHub merge authority. AGY verifies the exact integration commit and publishes a machine-readable attestation. Narrative statements are not acceptance evidence.

### Continuous governance — GitHub Copilot

Copilot watches repository organization, PR scope, contract drift, required evidence, CI/CD, ADLC and MCL consistency. It may review or propose changes but may not merge, bypass gates, modify secrets, weaken tests, or mark a control operational.

## 3. Branch and promotion model

```text
feature/mitenmehta-launch ---------\
                                     > integrate/virtual-miten-launch
feature/orchestrai-ewaya-bridge ---/                 |
                                                       | all gates + AGY attestation
                                                       | explicit Miten approval
                                                       v
                                                     main
```

1. Sessions never edit the same feature branch concurrently.
2. Feature work reaches `integrate/virtual-miten-launch` through a reviewed PR.
3. `main` receives only a reviewed PR from the integration branch.
4. Direct pushes to `main` are prohibited.
5. A failed or missing required check blocks promotion.
6. Cloudflare mutations require a reviewed plan, explicit target, rollback procedure and post-change probe.
7. Secrets are never committed, pasted into issues, logs, prompts or attestations.

## 4. Canonical interface contracts

Both tracks coordinate through versioned artifacts rather than chat copy/paste:

```text
contracts/
  agent-api.openapi.yaml
  auth-scopes.yaml
  error-codes.json
  event-envelope.schema.json
  health-contract.json
  mcp-tools.json

evidence/
  track-a/
  track-b/
  integration/
```

Contract changes require a dedicated PR, compatibility assessment, version increment and consumer tests. Neither track may silently redefine request, response, authentication, event or error semantics.

## 5. Target architecture

```text
User / Ewaya UI
      |
Cloudflare DNS, TLS, WAF, CDN and Pages
      |
Authenticated Agent Gateway
      |
Policy + authorization + rate/cost/consent controls
      |
Agent runtime and model router
      +---- Governed RAG / knowledge base
      +---- Scoped MCP gateway ---- Approved MCP servers
      +---- OrchestrAIOS bridge
      |
Queues / Workflows / retries / dead-letter handling
      |
Failures + Feedback + Research staging
      |
Provenance + security scan + offline evaluation + human approval
      |
Versioned reversible knowledge/runtime release
```

Raw feedback, model output, external research, MCP output, or failed execution must never directly modify production policy, prompts, code, tools or trusted knowledge.

## 6. Required integration gates

| Gate | Acceptance condition |
|---|---|
| Provenance | Commit, lockfile and build hashes recorded |
| Secrets | No verified secret exposure; approved secret store used |
| Dependencies | No unresolved critical/high reachable runtime advisory |
| Static quality | Lint, typecheck and production build pass |
| Tests | Unit, integration and browser E2E pass |
| Accessibility | Automated checks plus keyboard/screen-reader review pass |
| SEO/social | Valid routes, sitemap, structured data, favicon and social card |
| Agent API | OpenAPI contract, auth, streaming, timeout and degraded-mode tests pass |
| MCP | Protocol conformance, scopes, denial and tool-schema tests pass |
| Infrastructure | OpenTofu format/validate/plan pass with state locking |
| Security | CSP, authorization, injection, rate-limit and abuse tests pass |
| Resilience | Dependency outage, retry, DLQ, idempotency and rollback tests pass |
| Observability | Correlation IDs, logs, metrics, traces and alert paths verified |
| Deployment | Staging receipt and public probes attached |
| AGY | Independent attestation for the exact commit attached |
| Production | Explicit Miten approval recorded before merge/deploy |

## 7. Five-nines policy

`99.999%` is a future service objective, not a launch claim. It may only be advertised after the customer transaction has a defined SLI and independent multi-region monitoring demonstrates the objective over an agreed measurement window. The initial beta target must be defined conservatively from measured evidence.

## 8. Machine-readable evidence minimum

Every handoff and AGY attestation must identify repository and commit SHA, branch and PR, test command and exit status, artifact/checksum locations, deployment ID and environment, probe timestamp/location, redacted results, PASS/FAIL/BLOCKED per control, exception owner/action/acceptance evidence, and rollback result. Evidence from another commit or environment is invalid.

## 9. Operating prompts

### AGY verification prompt

> Act as the independent zero-trust verifier for the MitenMehta.com Virtual AI Agent launch. Read this MCL, but trust only fresh evidence from the exact integration commit. Do not implement fixes, approve your own infrastructure, expose secrets, merge branches, or accept hard-coded health/SLA statements. Verify website-to-gateway-to-OrchestrAIOS-to-MCP-to-response behavior; authentication and denial paths; contract compatibility; dependency failure and degraded mode; retries, idempotency and rollback; logs, metrics, traces and audit provenance. Publish a machine-readable PASS/FAIL/BLOCKED matrix naming the commit, deployment, commands, timestamps and evidence. PASS only when the exact acceptance evidence exists. Post the attestation to the integration PR; do not push to `main`.

### Codex Track B prompt

> Work only on OrchestrAIOS and the Ewaya integration bridge for the Virtual Miten Agent. Read this MCL before acting. Use `feature/orchestrai-ewaya-bridge`; never work directly on `main` or another session's branch. Implement the authenticated agent API, streaming, model routing, governed RAG, supported MCP transport, OAuth/OIDC scopes, tool controls, Workflows/queues/retries/DLQ, observability and governed Failures–Feedback–Research pipeline. Do not change MitenMehta.com UI except through versioned contracts. Do not claim deployment or availability from source code. Run security, contract, unit, integration, failure and load tests and publish evidence for the exact commit. Open a reviewed PR into `integrate/virtual-miten-launch`; do not merge or deploy production without explicit approval.

### GitHub Copilot governance prompt

> Continuously review every issue and PR in this repository against this MCL. Confirm correct branch/base, single-track scope, linked requirement/control, contract compatibility, test coverage, security impact, migration and rollback, evidence for the exact commit, and accurate DOCUMENTED/CODED/TESTED/DEPLOYED/OPERATIONAL status. Detect duplicate artifacts, stale generated files, conflicting SSOT claims, unsupported SLA/health statements, dependency risk, secret exposure, weakened CI, skipped tests and unauthorized Cloudflare changes. Keep PRs small and organized. Request changes when a required gate or evidence item is absent. Never merge, bypass protection, modify secrets, dismiss findings, or declare production operational. Produce a concise PR checklist with PASS/FAIL/BLOCKED and the exact owner/action/evidence for every blocker.

### GitHub control-plane setup and drift prompt

> Audit the repository against this MCL and inspect the live GitHub configuration. Verify automatic Copilot code review, rulesets, protected branches, required checks, required approvals, review-conversation resolution, CODEOWNERS, force-push/deletion prevention, PR templates, Actions permissions, environment approvals, and the integration-to-main promotion path. Distinguish file-backed controls from GitHub server-side settings. Implement only safe file-backed changes on a feature branch. For server-side changes, produce an exact least-privilege proposal and wait for explicit repository-administrator approval. Re-read the live configuration after any approved change and return PASS/FAIL/BLOCKED with evidence. Never claim that a prompt or repository file configured a server-side GitHub setting.

## 10. Current GitHub governance baseline

Read-only GitHub API inspection on 2026-08-15 established:

| Control | Fresh result |
|---|---|
| Repository rulesets | **BLOCKED** — none configured |
| `main` branch protection | **BLOCKED** — branch is not protected |
| GitHub Actions | **PARTIAL** — enabled with all actions allowed |
| Third-party action SHA pinning | **BLOCKED** — not required |
| Automatic Copilot review | **NOT VERIFIED** — repository setting still requires inspection |
| CODEOWNERS | **PROPOSED** in the governance PR |
| PR evidence template | **PROPOSED** in the governance PR |

These are time-sensitive observations and must be re-read after every approved GitHub configuration change. A merged prompt, CODEOWNERS file, or PR template does not substitute for server-side rulesets and branch protection.

## 11. Change control

Changes to scope, architecture, contracts, branch policy, security gates or evidence definitions require a PR updating this document. Chat statements do not supersede the merged MCL.
