# Track B — OrchestrAIOS and Ewaya bridge

This feature implements the versioned Track B contracts in `contracts/`. It does not implement the website UI or the future Ewaya UI.

## Security and governance invariants

- Every non-health route requires an RS256 OIDC access token with exact issuer, audience, expiry, signature, scope and revocation checks.
- Ewaya handoff additionally requires an explicit `ewaya.handoff` consent claim.
- Raw failures, feedback, research, model output and MCP output can only enter `learning_candidates` with `staged` status. Queue messages enumerate the mandatory provenance, scan, evaluation, regression, approval and versioned-release gates. No runtime route can promote or publish a candidate.
- Retrieval returns only records whose metadata says `releaseStatus=approved`, including provenance and version.
- Model fallbacks are a configured allow-list; they occur only on retryable upstream responses.
- Health is split into liveness and fresh dependency readiness. It contains no fixed latency, layer-count or availability claims.

## Runtime configuration

Provision the binding IDs in `agents/wrangler.jsonc`, configure `OIDC_ISSUER`, `OIDC_AUDIENCE` and optionally `OIDC_JWKS_URL`, then apply `agents/schema.sql`. Secrets must use the platform secret store. `ORCHESTRAI` and `EWAYA` are service bindings; no public URL or shared secret is required.

This repository does not contain staging or production deployment receipts. Until an exact-commit deployment and probes exist, deployment and operational status remain BLOCKED.
