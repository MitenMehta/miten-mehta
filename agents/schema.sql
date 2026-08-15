CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, type TEXT NOT NULL, subject TEXT, request_id TEXT NOT NULL, occurred_at TEXT NOT NULL, detail_json TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS audit_events_request_id ON audit_events(request_id);
CREATE TABLE IF NOT EXISTS learning_candidates (id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('failure','feedback','research')), content_json TEXT NOT NULL, provenance_json TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('staged','scanned','evaluated','approved','rejected','released')), created_by TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS workflow_runs (idempotency_key TEXT PRIMARY KEY, action TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, completed_at TEXT);
CREATE TABLE IF NOT EXISTS request_quotas (subject TEXT NOT NULL, minute_bucket INTEGER NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(subject, minute_bucket));
