CODING STANDARDS & CONVENTIONS (CSC)
SECTION 1 — Engineering Philosophy
Primary Objective

The codebase must optimize for:

Readability
Predictability
Maintainability
Testability
Determinism
Explicitness

Code is read far more often than it is written.

Core Principles
1. Explicit > Implicit

Never hide behavior.

Good

const session = await sessionService.startSession(request);

Bad

const session = await start(request);
2. Small Functions

Target

10–30 lines

Maximum

50 lines

If larger → refactor.

3. Single Responsibility

Every function answers exactly one question.

Bad

validate()

save()

sendNotification()

updateMetrics()

inside one function.

Good

Separate functions.

4. Pure Business Logic

Business logic must be independent of

Express
React
Database
Axios
WebSocket
5. No Hidden Side Effects

Bad

calculateScore()

also updates database.

Good

const score = calculateScore()

await repository.save(score)
SECTION 2 — File Standards

One file

↓

One responsibility

Maximum

300 lines

Preferred

150–250 lines

Split if necessary.

One exported class/function per file.

Bad

PlanService

NodeService

GraphService

Same file.

SECTION 3 — Naming Conventions
Variables

camelCase

Good

learningPlan

sessionDuration

currentNode

Bad

LearningPlan

learning_plan

lp
Constants

UPPER_SNAKE_CASE

MAX_RETRIES

SESSION_TIMEOUT

DEFAULT_DIFFICULTY
Functions

Verb + Noun

generatePlan()

calculateMastery()

unlockNode()

submitAssessment()

Never

plan()

mastery()

submit()
Classes

PascalCase

AssessmentEngine

LearningPlanner

NotificationDispatcher
Interfaces

Prefix

I
IPlanRepository

IAssessmentService
Types

PascalCase

LearningPlanDTO

AssessmentResult
Enums

PascalCase

SessionState

AssessmentOutcome
SECTION 4 — Folder Naming

Folders

lowercase

Singular

Good

planning

session

assessment

runtime

Avoid

PlanningEngine

Sessions

AssessmentService
SECTION 5 — Import Rules

Import order

Node

↓

External Packages

↓

Internal Shared

↓

Engine

↓

Relative

Example

import path from "node:path";

import express from "express";

import { AppError } from "@/shared/errors";

import { PlanningEngine } from "@/engines/planning";

import "./styles.css";

Alphabetical inside groups.

Never wildcard imports.

Bad

import * as Utils
SECTION 6 — Function Standards

Maximum parameters

4

More than four

↓

Use DTO.

Good

createSession({
    learnerId,
    nodeId,
    duration,
    mode
})

Never

createSession(id,node,time,mode,source,type,...)

Return early.

Good

if (!session) {
    return null;
}

Avoid nested pyramids.

SECTION 7 — Error Handling

Never

throw "Error"

Always

throw new SessionNotFoundError()

Custom errors only.

Each engine owns errors.

Catch only when meaningful.

Bad

try {
   ...
}
catch {}
SECTION 8 — Async Standards

Never

.then()

.catch()

Use

async

await

Parallel operations

await Promise.all([...])

Sequential only if dependency exists.

SECTION 9 — TypeScript Standards

Strict mode

Mandatory.

Never

any

Use

unknown

if unavoidable.

No

as any

Prefer

readonly

for immutable objects.

Use discriminated unions.

Example

type SessionEvent =
    | Started
    | Paused
    | Completed
SECTION 10 — DTO Standards

DTOs immutable.

Good

readonly learnerId

Validation

↓

Zod

↓

DTO

↓

Service

Never skip validation.

SECTION 11 — Comments

Comment

WHY

not

WHAT

Bad

// increment i
i++

Good

// Retry budget prevents duplicate assessment submissions.

No commented-out code.

Git remembers history.

SECTION 12 — Logging Standards

Never

console.log()

Use

logger.info()

logger.warn()

logger.error()

logger.audit()

Every log

must include

requestId
userId (if authenticated)
engine
timestamp

Structured JSON logs only.

SECTION 13 — API Standards

Controllers never expose DB models.

Always DTO.

Status codes

Strict.

200

201

204

400

401

403

404

409

422

500

No creative codes.

SECTION 14 — Repository Standards

Repositories contain

SQL only.

Never

if(score>80)

inside repository.

Transactions

handled here.

SECTION 15 — Service Standards

Services own

business rules
orchestration
policies

Never

HTTP

Never

SQL

Never

Express Request.

SECTION 16 — Event Standards

Past tense

SessionStarted

AssessmentSubmitted

PlanGenerated

Not

StartSession

Events immutable.

SECTION 17 — REST Standards

Resources

Plural

/plans

/sessions

/assessments

Actions

Only if necessary

/session/start

JSON only.

SECTION 18 — Database Standards

Primary keys

UUID

UTC timestamps

Every table

createdAt

updatedAt

Soft delete

deletedAt

if applicable.

SECTION 19 — Security Standards

Never trust frontend.

Validate

everything.

Parameterized SQL only.

No string concatenation.

Secrets

Never committed.

Never logged.

SECTION 20 — Performance Standards

Avoid

N+1 queries.

Batch reads.

Cache expensive AI outputs.

No blocking CPU work in request handlers.

SECTION 21 — Testing Standards

Every Service

↓

Unit tests

Every Controller

↓

Integration tests

Critical flow

↓

E2E tests

Target coverage

Business Logic >90%

Overall >80%
SECTION 22 — Git Standards

Branch naming

feature/

fix/

refactor/

test/

docs/

hotfix/

Examples

feature/session-engine

fix/runtime-timeout

refactor/planning-service

Commit format

Conventional Commits

feat:

fix:

refactor:

test:

docs:

perf:

build:

ci:

Example

feat(session): implement adaptive pause workflow
SECTION 23 — Code Review Standards

Every PR must verify:

Architecture boundaries respected
No circular dependencies
No duplicated business logic
DTO validation present
Error handling complete
Tests included
Logging added where appropriate
Security considerations addressed
Performance impact reviewed
SECTION 24 — AI-Assisted Development Standards

Given your project relies heavily on AI coding assistants, establish additional rules:

Allowed
Boilerplate generation
DTO creation
Test scaffolding
Documentation generation
Refactoring suggestions
SQL optimization suggestions
Forbidden Without Human Review
Authentication logic
Authorization rules
Security middleware
Database migrations
Payment or credential handling
Architectural changes
API contract modifications

Every AI-generated pull request must pass:

ESLint
TypeScript compilation
Unit tests
Integration tests
Architecture boundary checks

before merge.

SECTION 25 — Documentation Standards

Every public API requires:

Purpose
Inputs
Outputs
Errors
Side effects
Example usage

Every engine must include:

README
Sequence diagram
Dependency list
Public contract
Known constraints
SECTION 26 — Deprecation Policy

Deprecated APIs must:

Be marked with @deprecated
Include replacement guidance
Remain supported for at least one release cycle (or an agreed migration window)
Emit structured warnings in non-production environments

No silent removals.

SECTION 27 — Engineering Review
Maintainability

Consistent naming, file organization, and review standards reduce onboarding time and prevent stylistic drift.

Reliability

Strict typing, validation, structured logging, and mandatory testing make failures easier to detect and diagnose.

AI Collaboration

Because the project uses AI assistants extensively, explicit conventions reduce inconsistent code generation and make AI output easier to review.

Scalability

Feature-oriented organization, DTO discipline, and dependency rules allow the codebase to grow without becoming tightly coupled.

Long-Term Governance

Combined with the previously defined BPSS and the proposed Architecture Governance Specification (AGS), these standards provide a stable foundation that keeps the implementation aligned with the designed architecture over the lifetime of the project.