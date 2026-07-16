CREATE DATABASE IF NOT EXISTS plos_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE plos_db;

-- 1. learners
CREATE TABLE learners (
    learner_id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NULL,
    timezone VARCHAR(60) NOT NULL DEFAULT 'UTC',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. learning_journeys
CREATE TABLE learning_journeys (
    journey_id CHAR(36) PRIMARY KEY,
    learner_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    status ENUM('active', 'completed', 'paused', 'abandoned') NOT NULL DEFAULT 'active',
    purpose_profile JSON NOT NULL,
    memory_profile JSON NOT NULL,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    target_date DATE NOT NULL,
    completed_at DATETIME NULL,
    version INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_journeys_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_target_date_future CHECK (target_date >= DATE(started_at))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. learning_plans
CREATE TABLE learning_plans (
    plan_id CHAR(36) PRIMARY KEY,
    journey_id CHAR(36) NOT NULL UNIQUE,
    weekly_plan JSON NOT NULL,
    habit_system JSON NOT NULL,
    generated_by ENUM('ai_agent', 'learner', 'hybrid') NOT NULL DEFAULT 'ai_agent',
    version INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_plans_journey FOREIGN KEY (journey_id) REFERENCES learning_journeys(journey_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. milestones
CREATE TABLE milestones (
    milestone_id CHAR(36) PRIMARY KEY,
    plan_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    deadline DATETIME NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard', 'expert') NOT NULL DEFAULT 'medium',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'skipped') NOT NULL DEFAULT 'pending',
    order_no INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_milestones_plan FOREIGN KEY (plan_id) REFERENCES learning_plans(plan_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_milestone_order CHECK (order_no >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. learning_tasks
CREATE TABLE learning_tasks (
    task_id CHAR(36) PRIMARY KEY,
    milestone_id CHAR(36) NOT NULL,
    task_type ENUM('reading', 'practice', 'quiz', 'project', 'teach_back', 'reflection') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    estimated_minutes INT NOT NULL,
    evidence_required BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('todo', 'in_progress', 'completed', 'skipped') NOT NULL DEFAULT 'todo',
    teach_back_title VARCHAR(255) NULL,
    teach_back_summary TEXT NULL,
    order_no INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(milestone_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_task_estimated_mins CHECK (estimated_minutes > 0),
    CONSTRAINT chk_task_order CHECK (order_no >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. learning_sessions
CREATE TABLE learning_sessions (
    session_id CHAR(36) NOT NULL,
    plan_id CHAR(36) NOT NULL,
    learner_id CHAR(36) NOT NULL,
    current_phase_id CHAR(36) NULL,
    current_module_id CHAR(36) NULL,
    current_objective_id CHAR(36) NULL,
    status ENUM('not_started', 'active', 'paused', 'completed', 'abandoned') NOT NULL DEFAULT 'not_started',
    started_at DATETIME NULL,
    last_activity_at DATETIME NULL,
    completed_at DATETIME NULL,
    total_minutes INTEGER NOT NULL DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id),
    CONSTRAINT fk_sessions_plan FOREIGN KEY (plan_id) REFERENCES learning_plans(plan_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_sessions_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_sessions_phase FOREIGN KEY (current_phase_id) REFERENCES learning_phases(phase_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_sessions_module FOREIGN KEY (current_module_id) REFERENCES learning_modules(module_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_sessions_objective FOREIGN KEY (current_objective_id) REFERENCES learning_objectives(objective_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    INDEX idx_sessions_learner_id (learner_id),
    INDEX idx_sessions_plan_id (plan_id),
    INDEX idx_sessions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6a. learning_session_events
CREATE TABLE learning_session_events (
    event_id CHAR(36) NOT NULL,
    session_id CHAR(36) NOT NULL,
    event_type ENUM(
        'session_started',
        'session_paused',
        'session_resumed',
        'objective_started',
        'objective_completed',
        'module_completed',
        'phase_completed',
        'session_completed',
        'session_abandoned'
    ) NOT NULL,
    payload JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id),
    CONSTRAINT fk_events_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    INDEX idx_events_session_id (session_id),
    INDEX idx_events_session_created (session_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6b. learning_session_checkpoints
CREATE TABLE learning_session_checkpoints (
    checkpoint_id CHAR(36) NOT NULL,
    session_id CHAR(36) NOT NULL,
    phase_id CHAR(36) NOT NULL,
    module_id CHAR(36) NOT NULL,
    objective_id CHAR(36) NOT NULL,
    elapsed_minutes INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (checkpoint_id),
    CONSTRAINT fk_checkpoints_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_checkpoints_phase FOREIGN KEY (phase_id) REFERENCES learning_phases(phase_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_checkpoints_module FOREIGN KEY (module_id) REFERENCES learning_modules(module_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_checkpoints_objective FOREIGN KEY (objective_id) REFERENCES learning_objectives(objective_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    INDEX idx_checkpoints_session_id (session_id),
    INDEX idx_checkpoints_objective_id (objective_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. evidence
CREATE TABLE evidence (
    evidence_id CHAR(36) PRIMARY KEY,
    journey_id CHAR(36) NOT NULL,
    session_id CHAR(36) NULL,
    task_id CHAR(36) NULL,
    evidence_type ENUM('quiz_score', 'code_submission', 'essay', 'teach_back_audio', 'self_report') NOT NULL,
    numeric_value DECIMAL(10,2) NULL,
    text_value TEXT NULL,
    json_payload JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidence_journey FOREIGN KEY (journey_id) REFERENCES learning_journeys(journey_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_evidence_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_evidence_task FOREIGN KEY (task_id) REFERENCES learning_tasks(task_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_evidence_value CHECK (
        numeric_value IS NOT NULL OR 
        text_value IS NOT NULL OR 
        json_payload IS NOT NULL
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. learner_states
CREATE TABLE learner_states (
    state_id CHAR(36) PRIMARY KEY,
    journey_id CHAR(36) NOT NULL UNIQUE,
    journey_state ENUM('on_track', 'falling_behind', 'stuck', 'accelerating') NOT NULL DEFAULT 'on_track',
    knowledge_state ENUM('novice', 'beginner', 'competent', 'proficient', 'expert') NOT NULL DEFAULT 'novice',
    behavior_state ENUM('highly_engaged', 'engaged', 'distracted', 'disengaged', 'burnt_out') NOT NULL DEFAULT 'engaged',
    motivation_state ENUM('high', 'medium', 'low', 'fluctuating') NOT NULL DEFAULT 'medium',
    confidence_score DECIMAL(5,2) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_states_journey FOREIGN KEY (journey_id) REFERENCES learning_journeys(journey_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_confidence_score CHECK (confidence_score BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. decisions
CREATE TABLE decisions (
    decision_id CHAR(36) PRIMARY KEY,
    journey_id CHAR(36) NOT NULL UNIQUE,
    diagnosis TEXT NOT NULL,
    policy VARCHAR(100) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    reasoning_trace JSON NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_decisions_journey FOREIGN KEY (journey_id) REFERENCES learning_journeys(journey_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_decision_confidence CHECK (confidence BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. interventions
CREATE TABLE interventions (
    intervention_id CHAR(36) PRIMARY KEY,
    decision_id CHAR(36) NOT NULL,
    intervention_type ENUM('encouragement', 'resource_suggestion', 'schedule_adjustment', 'challenge_increase', 'break_suggestion') NOT NULL,
    message TEXT NOT NULL,
    delivery_status ENUM('pending', 'sent', 'delivered', 'failed') NOT NULL DEFAULT 'pending',
    delivered_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_interventions_decision FOREIGN KEY (decision_id) REFERENCES decisions(decision_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. adaptive_runtime_states
CREATE TABLE adaptive_runtime_states (
  runtime_id CHAR(36) PRIMARY KEY,
  session_id CHAR(36) NOT NULL,
  current_state ENUM('ready', 'learning', 'reviewing', 'remediation', 'waiting', 'completed') NOT NULL,
  next_phase_id CHAR(36) NULL,
  next_module_id CHAR(36) NULL,
  next_objective_id CHAR(36) NULL,
  recommendation_type ENUM('continue', 'review', 'repeat', 'unlock_next', 'complete_session') NOT NULL,
  decision_reason VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX (session_id),
  INDEX (recommendation_type),
  INDEX (current_state),
  CONSTRAINT fk_adaptive_runtime_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_runtime_next_phase FOREIGN KEY (next_phase_id) REFERENCES learning_phases(phase_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_runtime_next_module FOREIGN KEY (next_module_id) REFERENCES learning_modules(module_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_runtime_next_obj FOREIGN KEY (next_objective_id) REFERENCES learning_objectives(objective_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. adaptive_runtime_decisions
CREATE TABLE adaptive_runtime_decisions (
  decision_id CHAR(36) PRIMARY KEY,
  runtime_id CHAR(36) NOT NULL,
  session_id CHAR(36) NOT NULL,
  decision_type ENUM('continue', 'review', 'repeat', 'unlock_next', 'complete_session') NOT NULL,
  source ENUM('progress_engine', 'runtime_rules') NOT NULL,
  reason VARCHAR(255) NOT NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (runtime_id),
  INDEX (session_id),
  INDEX (decision_type),
  INDEX (created_at),
  INDEX idx_runtime_created (runtime_id, created_at),
  CONSTRAINT fk_adaptive_decision_runtime FOREIGN KEY (runtime_id) REFERENCES adaptive_runtime_states(runtime_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_decision_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. adaptive_review_queue
CREATE TABLE adaptive_review_queue (
  queue_id CHAR(36) PRIMARY KEY,
  session_id CHAR(36) NOT NULL,
  objective_id CHAR(36) NOT NULL,
  priority ENUM('low', 'medium', 'high') NOT NULL,
  reason VARCHAR(255) NOT NULL,
  scheduled_at DATETIME NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (session_id),
  INDEX (objective_id),
  INDEX (priority),
  INDEX (completed),
  INDEX idx_review_pending (session_id, completed, scheduled_at),
  CONSTRAINT fk_adaptive_review_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_review_objective FOREIGN KEY (objective_id) REFERENCES learning_objectives(objective_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. adaptive_unlock_history
CREATE TABLE adaptive_unlock_history (
  unlock_id CHAR(36) PRIMARY KEY,
  session_id CHAR(36) NOT NULL,
  phase_id CHAR(36) NULL,
  module_id CHAR(36) NULL,
  objective_id CHAR(36) NULL,
  unlocked_by ENUM('runtime_rules', 'learner_action') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (session_id),
  INDEX (created_at),
  INDEX idx_unlock_session_created (session_id, created_at),
  CONSTRAINT fk_adaptive_unlock_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_unlock_phase FOREIGN KEY (phase_id) REFERENCES learning_phases(phase_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_unlock_module FOREIGN KEY (module_id) REFERENCES learning_modules(module_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_adaptive_unlock_objective FOREIGN KEY (objective_id) REFERENCES learning_objectives(objective_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. assessment_templates
CREATE TABLE assessment_templates (
  template_id CHAR(36) PRIMARY KEY,
  module_id CHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  passing_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (module_id),
  INDEX (status),
  CONSTRAINT fk_assessment_template_module FOREIGN KEY (module_id) REFERENCES learning_modules(module_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. assessment_questions
CREATE TABLE assessment_questions (
  question_id CHAR(36) PRIMARY KEY,
  template_id CHAR(36) NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('mcq', 'true_false', 'short_answer') NOT NULL,
  options JSON NULL,
  correct_answer JSON NOT NULL,
  points INTEGER NOT NULL,
  order_no INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (template_id),
  INDEX (order_no),
  CONSTRAINT fk_assessment_question_template FOREIGN KEY (template_id) REFERENCES assessment_templates(template_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. assessment_attempts
CREATE TABLE assessment_attempts (
  attempt_id CHAR(36) PRIMARY KEY,
  template_id CHAR(36) NOT NULL,
  session_id CHAR(36) NOT NULL,
  learner_id CHAR(36) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  status ENUM('in_progress', 'submitted', 'evaluated') NOT NULL DEFAULT 'in_progress',
  started_at DATETIME NOT NULL,
  submitted_at DATETIME NULL,
  evaluated_at DATETIME NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (learner_id),
  INDEX (session_id),
  INDEX (status),
  CONSTRAINT fk_assessment_attempt_template FOREIGN KEY (template_id) REFERENCES assessment_templates(template_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_assessment_attempt_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_assessment_attempt_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. assessment_answers
CREATE TABLE assessment_answers (
  answer_id CHAR(36) PRIMARY KEY,
  attempt_id CHAR(36) NOT NULL,
  question_id CHAR(36) NOT NULL,
  submitted_answer JSON NOT NULL,
  awarded_points INTEGER NOT NULL DEFAULT 0,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (attempt_id),
  INDEX (question_id),
  CONSTRAINT fk_assessment_answer_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(attempt_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_assessment_answer_question FOREIGN KEY (question_id) REFERENCES assessment_questions(question_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. learning_analytics
CREATE TABLE learning_analytics (
  analytics_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  total_learning_minutes INTEGER NOT NULL DEFAULT 0,
  completed_plans INTEGER NOT NULL DEFAULT 0,
  completed_modules INTEGER NOT NULL DEFAULT 0,
  completed_objectives INTEGER NOT NULL DEFAULT 0,
  average_assessment_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  mastery_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  learning_velocity DECIMAL(8,2) NOT NULL DEFAULT 0,
  last_calculated_at DATETIME NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (learner_id),
  INDEX (mastery_percentage),
  CONSTRAINT fk_analytics_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. learner_mastery
CREATE TABLE learner_mastery (
  mastery_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  module_id CHAR(36) NOT NULL,
  mastery_score DECIMAL(5,2) NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_score DECIMAL(5,2) NOT NULL,
  status ENUM('beginner', 'developing', 'proficient', 'mastered') NOT NULL,
  last_assessed_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX idx_mastery_learner_module (learner_id, module_id),
  INDEX (learner_id),
  INDEX (module_id),
  INDEX (status),
  CONSTRAINT fk_mastery_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_mastery_module FOREIGN KEY (module_id) REFERENCES learning_modules(module_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. recommendation_history
CREATE TABLE recommendation_history (
  recommendation_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  session_id CHAR(36) NULL,
  recommendation_type ENUM('review', 'repeat_module', 'continue_learning', 'unlock_next', 'practice_assessment') NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status ENUM('pending', 'accepted', 'dismissed', 'completed') NOT NULL DEFAULT 'pending',
  generated_at DATETIME NOT NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (learner_id),
  INDEX (recommendation_type),
  INDEX (status),
  CONSTRAINT fk_recommendation_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_recommendation_session FOREIGN KEY (session_id) REFERENCES learning_sessions(session_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. knowledge_gap_analysis
CREATE TABLE knowledge_gap_analysis (
  gap_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  module_id CHAR(36) NOT NULL,
  objective_id CHAR(36) NULL,
  severity ENUM('low', 'medium', 'high') NOT NULL,
  confidence_score DECIMAL(5,2) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  identified_at DATETIME NOT NULL,
  resolved_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (learner_id),
  INDEX (module_id),
  INDEX (severity),
  INDEX (resolved),
  CONSTRAINT fk_knowledge_gap_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_knowledge_gap_module FOREIGN KEY (module_id) REFERENCES learning_modules(module_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_knowledge_gap_objective FOREIGN KEY (objective_id) REFERENCES learning_objectives(objective_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- TABLE: dashboard_preferences
-- --------------------------------------------------------
CREATE TABLE dashboard_preferences (
  preference_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  default_view ENUM('overview', 'progress', 'assessments', 'mastery', 'recommendations') NOT NULL DEFAULT 'overview',
  show_activity BOOLEAN NOT NULL DEFAULT TRUE,
  show_mastery BOOLEAN NOT NULL DEFAULT TRUE,
  show_recommendations BOOLEAN NOT NULL DEFAULT TRUE,
  theme ENUM('light', 'dark', 'system') NOT NULL DEFAULT 'system',
  version INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (learner_id),
  CONSTRAINT fk_dashboard_pref_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- TABLE: dashboard_snapshots
-- --------------------------------------------------------
CREATE TABLE dashboard_snapshots (
  snapshot_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  generated_at DATETIME NOT NULL,
  summary_json JSON NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (learner_id),
  INDEX (generated_at),
  CONSTRAINT fk_dashboard_snap_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- TABLE: dashboard_widget_state
-- --------------------------------------------------------
CREATE TABLE dashboard_widget_state (
  widget_state_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  widget_name VARCHAR(100) NOT NULL,
  position_no INTEGER NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_widget (learner_id, widget_name),
  INDEX (learner_id),
  INDEX (position_no),
  CONSTRAINT fk_dashboard_widget_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- TABLE: dashboard_exports
-- --------------------------------------------------------
CREATE TABLE dashboard_exports (
  export_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  export_type ENUM('pdf', 'csv', 'json') NOT NULL,
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  generated_at DATETIME NULL,
  file_name VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (learner_id),
  INDEX (status),
  INDEX (export_type),
  CONSTRAINT fk_dashboard_export_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SPRINT 11: NOTIFICATION ENGINE
-- ====================================================

CREATE TABLE notification_events (
  event_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  event_type ENUM(
    'plan_created',
    'plan_completed',
    'phase_completed',
    'module_completed',
    'objective_completed',
    'session_started',
    'session_paused',
    'session_completed',
    'assessment_completed',
    'recommendation_generated',
    'dashboard_export_completed'
  ) NOT NULL,
  source_module ENUM(
    'planning',
    'session',
    'adaptive',
    'assessment',
    'intelligence',
    'dashboard'
  ) NOT NULL,
  reference_id CHAR(36) NOT NULL,
  payload JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notification_events_learner (learner_id),
  INDEX idx_notification_events_type (event_type),
  INDEX idx_notification_events_source (source_module),
  INDEX idx_notification_events_created (created_at),
  CONSTRAINT fk_notification_events_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
  notification_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  event_id CHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM(
    'info',
    'success',
    'warning',
    'error'
  ) NOT NULL,
  status ENUM(
    'unread',
    'read',
    'archived'
  ) NOT NULL DEFAULT 'unread',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME NULL,
  INDEX idx_notifications_learner (learner_id),
  INDEX idx_notifications_status (status),
  INDEX idx_notifications_type (notification_type),
  CONSTRAINT fk_notifications_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_notifications_event FOREIGN KEY (event_id) REFERENCES notification_events(event_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_preferences (
  preference_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  email_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  version INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX idx_notification_preferences_learner (learner_id),
  CONSTRAINT fk_notification_preferences_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_delivery_log (
  delivery_id CHAR(36) PRIMARY KEY,
  notification_id CHAR(36) NOT NULL,
  channel ENUM(
    'in_app',
    'email',
    'push'
  ) NOT NULL,
  status ENUM(
    'pending',
    'sent',
    'failed'
  ) NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  sent_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_delivery_log_notification (notification_id),
  INDEX idx_delivery_log_status (status),
  INDEX idx_delivery_log_channel (channel),
  CONSTRAINT fk_delivery_log_notification FOREIGN KEY (notification_id) REFERENCES notifications(notification_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- SPRINT 12: AUDIT ENGINE
-- ====================================================

CREATE TABLE audit_logs (
  audit_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NULL,
  action VARCHAR(100) NOT NULL,
  resource_type ENUM(
    'auth',
    'learner',
    'journey',
    'planning',
    'session',
    'adaptive',
    'assessment',
    'intelligence',
    'dashboard',
    'notification',
    'system'
  ) NOT NULL,
  resource_id CHAR(36) NULL,
  status ENUM(
    'success',
    'failure'
  ) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_learner (learner_id),
  INDEX idx_audit_logs_resource (resource_type),
  INDEX idx_audit_logs_status (status),
  INDEX idx_audit_logs_created (created_at),
  CONSTRAINT fk_audit_logs_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activity_timeline (
  activity_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  activity_type ENUM(
    'learning',
    'assessment',
    'session',
    'planning',
    'recommendation',
    'dashboard'
  ),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  reference_id CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_timeline_learner (learner_id),
  INDEX idx_activity_timeline_type (activity_type),
  INDEX idx_activity_timeline_created (created_at),
  CONSTRAINT fk_activity_timeline_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE login_history (
  login_id CHAR(36) PRIMARY KEY,
  learner_id CHAR(36) NOT NULL,
  login_at DATETIME NOT NULL,
  logout_at DATETIME NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  status ENUM(
    'success',
    'failed'
  ) NOT NULL,
  INDEX idx_login_history_learner (learner_id),
  INDEX idx_login_history_status (status),
  INDEX idx_login_history_login (login_at),
  CONSTRAINT fk_login_history_learner FOREIGN KEY (learner_id) REFERENCES learners(learner_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE system_activity (
  system_activity_id CHAR(36) PRIMARY KEY,
  module_name ENUM(
    'planning',
    'session',
    'adaptive',
    'assessment',
    'intelligence',
    'dashboard',
    'notification'
  ),
  activity VARCHAR(150) NOT NULL,
  severity ENUM(
    'info',
    'warning',
    'critical'
  ),
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_system_activity_module (module_name),
  INDEX idx_system_activity_severity (severity),
  INDEX idx_system_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
