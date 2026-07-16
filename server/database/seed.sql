USE plos_db;

-- 1. learners
INSERT INTO learners (learner_id, full_name, email, password_hash, avatar_url, timezone, created_at)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'Priya Sharma',
    'priya@example.com',
    '$2b$10$abcdefghijklmnopqrstuv',
    'https://example.com/avatar/priya.png',
    'Asia/Kolkata',
    '2026-06-01 10:00:00'
);

-- 2. learning_journeys
INSERT INTO learning_journeys (journey_id, learner_id, title, domain, status, purpose_profile, memory_profile, started_at, target_date, version)
VALUES (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Become an AI Engineer',
    'Artificial Intelligence',
    'active',
    '{
        "goal": "Build production-ready AI applications",
        "why": "I enjoy solving meaningful problems with technology. I want to build systems that improve peoples lives and secure a strong software engineering career.",
        "future_identity": "Senior AI Systems Engineer",
        "motivation_style": "Intrinsic problem-solving and tangible career growth",
        "commitment_statement": "I commit to studying 15 hours a week for 16 weeks to achieve this goal."
    }',
    '{
        "learning_style": "Visual and Kinesthetic (Building projects)",
        "best_study_hours": "07:00 - 09:00, 20:00 - 22:00",
        "weekly_availability": "15 hours",
        "strengths": ["Logical reasoning", "Python scripting"],
        "weaknesses": ["Advanced calculus", "Distracted easily during long reading blocks"]
    }',
    '2026-06-02 08:00:00',
    '2026-09-22',
    1
);

-- 3. learning_plans
INSERT INTO learning_plans (plan_id, journey_id, weekly_plan, habit_system, generated_by, version)
VALUES (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '{
        "week_1": "Python Fundamentals",
        "week_2": "Data Structures & Algorithms",
        "week_3": "Machine Learning Basics (Scikit-Learn)",
        "week_4": "Deep Learning Foundations (PyTorch)",
        "week_5": "Large Language Models (LLMs) & Transformers",
        "week_6": "Prompt Engineering & RAG Systems",
        "week_7": "AI Agent Orchestration",
        "week_8": "Deployment & MLOps Basics"
    }',
    '{
        "routines": [
            {"routine": "Daily Study Block", "trigger": "After morning coffee", "duration": "90 mins"},
            {"routine": "End of Day Reflection", "trigger": "Before shutting down laptop", "duration": "10 mins"},
            {"routine": "Weekly Review", "trigger": "Sunday 7 PM", "duration": "30 mins"},
            {"routine": "Teach-back Session", "trigger": "Friday afternoon", "duration": "45 mins"}
        ],
        "reward_system": "Tech-free Sunday mornings"
    }',
    'ai_agent',
    1
);

-- 4. milestones
INSERT INTO milestones (milestone_id, plan_id, title, description, deadline, difficulty, priority, status, order_no)
VALUES
    ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Python & DSA Foundation', 'Master core programming concepts and essential data structures.', '2026-06-16 23:59:59', 'medium', 'high', 'completed', 1),
    ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Machine Learning Basics', 'Understand supervised/unsupervised learning and scikit-learn.', '2026-06-30 23:59:59', 'hard', 'critical', 'completed', 2),
    ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'Deep Learning Foundations', 'Neural networks, backpropagation, and PyTorch essentials.', '2026-07-14 23:59:59', 'expert', 'critical', 'in_progress', 3),
    ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'LLMs and Agentic AI', 'Work with Transformers, RAG pipelines, and agent orchestration.', '2026-08-11 23:59:59', 'expert', 'high', 'pending', 4),
    ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 'Portfolio Project', 'Build an end-to-end production AI app and deploy it.', '2026-09-22 23:59:59', 'hard', 'critical', 'pending', 5);

-- 5. learning_tasks
INSERT INTO learning_tasks (task_id, milestone_id, task_type, title, description, estimated_minutes, evidence_required, status, teach_back_title, teach_back_summary, order_no)
VALUES
    -- Milestone 1 (Completed)
    ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'reading', 'Python Decorators & Generators', 'Read the advanced Python documentation.', 60, FALSE, 'completed', NULL, NULL, 1),
    ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'practice', 'Algorithm Implementation', 'Implement quicksort and binary tree traversal.', 120, TRUE, 'completed', NULL, NULL, 2),
    ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'quiz', 'DSA Quiz', 'Test your data structure knowledge.', 30, TRUE, 'completed', NULL, NULL, 3),
    ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'teach_back', 'Explain Big O Notation', 'Record a 5 minute explanation of time complexity.', 45, TRUE, 'completed', 'Demystifying Big O', 'I explained how O(N^2) differs from O(N log N) using sorting algorithms.', 4),
    ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'reflection', 'Foundation Reflection', 'Reflect on Python basics and DSA.', 20, TRUE, 'completed', NULL, NULL, 5),

    -- Milestone 2 (Completed)
    ('50000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000002', 'reading', 'Introduction to Machine Learning', 'Read chapters 1-3 of hands-on ML.', 90, FALSE, 'completed', NULL, NULL, 6),
    ('50000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000002', 'practice', 'Scikit-Learn Pipeline', 'Build a data preprocessing and modeling pipeline.', 120, TRUE, 'completed', NULL, NULL, 7),
    ('50000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000002', 'quiz', 'Linear & Logistic Regression', 'Check understanding of loss functions.', 45, TRUE, 'completed', NULL, NULL, 8),
    ('50000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000002', 'project', 'House Price Prediction Model', 'Kaggle dataset modeling with random forests.', 180, TRUE, 'completed', NULL, NULL, 9),
    ('50000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000002', 'reflection', 'ML Basics Reflection', 'Review supervised learning challenges.', 30, TRUE, 'completed', NULL, NULL, 10),

    -- Milestone 3 (In Progress)
    ('50000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000003', 'reading', 'Neural Network Architecture', 'Understand nodes, weights, and biases.', 60, FALSE, 'completed', NULL, NULL, 11),
    ('50000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000003', 'practice', 'Building a Perceptron', 'Implement a basic neural net in raw NumPy.', 120, TRUE, 'completed', NULL, NULL, 12),
    ('50000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000003', 'teach_back', 'Explain Backpropagation', 'Break down the chain rule in backprop.', 60, TRUE, 'in_progress', NULL, NULL, 13),
    ('50000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000003', 'practice', 'PyTorch Tensors', 'Basic PyTorch API practice.', 90, TRUE, 'todo', NULL, NULL, 14),
    ('50000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000003', 'quiz', 'Deep Learning Math Quiz', 'Test calculus and linear algebra for DL.', 45, TRUE, 'todo', NULL, NULL, 15),

    -- Milestone 4 (Pending)
    ('50000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000004', 'reading', 'Attention is All You Need', 'Read the original Transformer paper.', 120, FALSE, 'todo', NULL, NULL, 16),
    ('50000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000004', 'practice', 'Hugging Face Basics', 'Download and fine-tune a small model.', 150, TRUE, 'todo', NULL, NULL, 17),
    ('50000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000004', 'project', 'RAG Document Q&A', 'Build a retrieval augmented generation app.', 240, TRUE, 'todo', NULL, NULL, 18),
    ('50000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000004', 'teach_back', 'Agentic Orchestration', 'Explain how LLM agents use tools.', 60, TRUE, 'todo', NULL, NULL, 19),
    ('50000000-0000-0000-0000-000000000020', '40000000-0000-0000-0000-000000000004', 'reflection', 'LLM Module Reflection', 'Reflect on prompt engineering techniques.', 30, TRUE, 'todo', NULL, NULL, 20),

    -- Milestone 5 (Pending)
    ('50000000-0000-0000-0000-000000000021', '40000000-0000-0000-0000-000000000005', 'project', 'Full Stack AI App', 'Build the final capstone project.', 600, TRUE, 'todo', NULL, NULL, 21),
    ('50000000-0000-0000-0000-000000000022', '40000000-0000-0000-0000-000000000005', 'reflection', 'Journey Completion', 'Write a post-mortem on the entire learning journey.', 60, TRUE, 'todo', NULL, NULL, 22);

-- 6. learning_sessions
INSERT INTO learning_sessions (session_id, journey_id, started_at, ended_at, duration_minutes, energy_level, confidence_level, difficulty_level, reflection)
VALUES
    ('60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-06-03 07:00:00', '2026-06-03 08:00:00', 60, 8, 7, 'optimal', 'Good start with decorators. Need to practice more.'),
    ('60000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '2026-06-05 20:00:00', '2026-06-05 22:00:00', 120, 7, 8, 'too_easy', 'Algorithms were fun. Binary tree traversal is intuitive.'),
    ('60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '2026-06-10 07:00:00', '2026-06-10 08:15:00', 75, 9, 8, 'optimal', 'Nailed the Big O explaination on audio!'),
    ('60000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '2026-06-17 20:00:00', '2026-06-17 21:30:00', 90, 6, 6, 'optimal', 'Reading about ML models. A lot of new terminology.'),
    ('60000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '2026-06-22 07:00:00', '2026-06-22 09:00:00', 120, 8, 7, 'optimal', 'Scikit-learn pipeline built successfully.'),
    ('60000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '2026-06-28 14:00:00', '2026-06-28 17:00:00', 180, 7, 8, 'optimal', 'Kaggle house pricing model works great! RF is powerful.'),
    ('60000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', '2026-07-05 07:00:00', '2026-07-05 08:00:00', 60, 5, 5, 'too_hard', 'Neural nets make sense conceptually, but math is tough.'),
    ('60000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000001', '2026-07-08 20:00:00', '2026-07-08 22:00:00', 120, 6, 6, 'too_hard', 'Struggled with the NumPy perceptron. I finally understood recursion, but backpropagation math is tricky.'),
    ('60000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000001', '2026-07-13 07:00:00', NULL, NULL, 5, 4, 'too_hard', 'Currently trying to teach backpropagation. Finding it difficult to formulate words.');

-- 7. evidence
INSERT INTO evidence (evidence_id, journey_id, session_id, task_id, evidence_type, numeric_value, text_value, json_payload)
VALUES
    ('70000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000003', 'quiz_score', 95.00, NULL, NULL),
    ('70000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000004', 'teach_back_audio', NULL, 'Audio transcript: Big O is about scaling...', '{"duration_sec": 310, "clarity_score": 0.85}'),
    ('70000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000005', 'self_report', NULL, 'Feeling confident about Python basics.', NULL),
    ('70000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000007', 'code_submission', NULL, 'Pipeline code on GitHub repo.', '{"loc": 150, "tests_passed": true}'),
    ('70000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000008', 'quiz_score', 88.00, NULL, NULL),
    ('70000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000009', 'code_submission', NULL, 'House price prediction Kaggle notebook link.', '{"accuracy": 0.92, "model": "RandomForest"}'),
    ('70000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000012', 'code_submission', NULL, 'NumPy Perceptron implemented.', '{"loss_curve": "converged", "loc": 65}');

-- 8. learner_states
INSERT INTO learner_states (state_id, journey_id, journey_state, knowledge_state, behavior_state, motivation_state, confidence_score, updated_at, version)
VALUES (
    '80000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'falling_behind',
    'competent',
    'engaged',
    'high',
    65.00,
    '2026-07-15 10:00:00',
    3
);

-- 9. decisions
INSERT INTO decisions (decision_id, journey_id, diagnosis, policy, confidence, priority, reasoning_trace)
VALUES (
    '90000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'The learner exhibits high motivation but reduced recent activity and delayed project progress. They are struggling with the mathematical complexity of backpropagation, causing a slight dip in confidence and pacing.',
    'adaptive_pacing_and_reinforcement',
    85.50,
    'high',
    '{
        "factors": [
            {"type": "motivation", "status": "high", "weight": 0.8},
            {"type": "activity", "trend": "reduced_duration", "metric": -25},
            {"type": "performance", "indicator": "backprop_struggle", "source": "session_008_reflection"}
        ],
        "inferred_state": "Cognitive overload on math concepts.",
        "chosen_actions": [
            {"action": "increase_practice", "target": "PyTorch basics before math deep dive"},
            {"action": "delay_milestone", "days": 2, "target": "40000000-0000-0000-0000-000000000003"},
            {"action": "recommend_teach_back", "target": "50000000-0000-0000-0000-000000000013"}
        ]
    }'
);

-- 10. interventions
INSERT INTO interventions (intervention_id, decision_id, intervention_type, message, delivery_status, delivered_at)
VALUES (
    'A0000000-0000-0000-0000-000000000001',
    '90000000-0000-0000-0000-000000000001',
    'encouragement',
    'Remember why you started. You want to build systems that improve people''s lives and secure a strong AI engineering career. It''s completely normal to find backpropagation math challenging. I''ve adjusted your schedule to give you two extra days for this milestone. Spend just 30 minutes today completing the PyTorch Tensors practice task to build momentum.',
    'delivered',
    '2026-07-16 08:00:00'
);
