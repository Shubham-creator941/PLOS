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
    session_id CHAR(36) PRIMARY KEY,
    journey_id CHAR(36) NOT NULL,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME NULL,
    duration_minutes INT NULL,
    energy_level TINYINT NOT NULL DEFAULT 5,
    confidence_level TINYINT NOT NULL DEFAULT 5,
    difficulty_level ENUM('too_easy', 'optimal', 'too_hard') NOT NULL,
    reflection TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_journey FOREIGN KEY (journey_id) REFERENCES learning_journeys(journey_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_session_energy CHECK (energy_level BETWEEN 1 AND 10),
    CONSTRAINT chk_session_confidence CHECK (confidence_level BETWEEN 1 AND 10),
    CONSTRAINT chk_session_times CHECK (ended_at IS NULL OR ended_at >= started_at),
    CONSTRAINT chk_session_duration CHECK (duration_minutes IS NULL OR duration_minutes >= 0)
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
