-- =============================================================================
-- database/indexes.sql
-- Covering indexes for high-frequency non-FK lookup columns.
--
-- These complement the implicit InnoDB indexes on FK columns and primary keys.
-- Run once after schema.sql during initial setup or apply as a migration.
-- All are — safe to re-run.
-- =============================================================================

-- ── Platform ──────────────────────────────────────────────────────────────────

-- Settings are looked up by key frequently (GET /platform/settings/:key)

-- Announcements filtered by status in list queries
CREATE INDEX idx_announcements_status
  ON platform_announcements(status);

-- ── Learning Intelligence ─────────────────────────────────────────────────────

-- Analytics are fetched per-learner (one row per learner, but indexed for lookup)
CREATE INDEX idx_analytics_learner
  ON learning_analytics(learner_id);

-- Recommendations ordered by generated_at DESC per learner
CREATE INDEX idx_recommendations_learner
  ON recommendation_history(learner_id, generated_at DESC);

-- Knowledge gaps ordered by identified_at DESC per learner
CREATE INDEX idx_knowledge_gaps_learner
  ON knowledge_gap_analysis(learner_id, identified_at DESC);

-- ── Session ───────────────────────────────────────────────────────────────────

-- Sessions ordered by started_at DESC for learner history
CREATE INDEX idx_sessions_learner_started
  ON learning_sessions(learner_id, started_at DESC);

-- ── Assessment ────────────────────────────────────────────────────────────────

-- Attempts ordered by created_at DESC for learner history
CREATE INDEX idx_attempts_learner
  ON assessment_attempts(learner_id, created_at DESC);

-- ── Audit ─────────────────────────────────────────────────────────────────────

-- Audit log filtered by actor + timestamp (compliance queries)
CREATE INDEX idx_audit_actor_time
  ON audit_logs(learner_id, created_at DESC);

-- ── Notifications ─────────────────────────────────────────────────────────────

-- Unread notifications per learner
CREATE INDEX idx_notifications_learner_read
  ON notifications(learner_id, status, created_at DESC);
