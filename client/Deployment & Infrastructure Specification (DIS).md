DEPLOYMENT & INFRASTRUCTURE SPECIFICATION (DIS)
SECTION 1 — Deployment Philosophy
Core Principles

The deployment architecture follows five principles:

Container First
Every runtime component executes inside an isolated Docker container.
Cloud Agnostic
No dependency on AWS-, Azure-, or GCP-specific services.
Immutable Deployments
Build once, deploy the same artifact across environments.
Stateless Services
Application containers never persist business data locally.
Horizontal Scalability
Stateless services can scale without architectural changes.
SECTION 2 — Infrastructure Topology
                    Internet
                        │
                  HTTPS (443)
                        │
                Reverse Proxy (Nginx)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
 React Frontend     Backend API     WebSocket Gateway
     (Static)         (Express)        (Express WS)
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
     MySQL          Redis Cache      AI Runtime
                        │
                        ▼
                  Background Workers
SECTION 3 — Runtime Components
Component	Responsibility	Stateful	Scalable
Frontend	Static UI	No	Yes
API Server	REST APIs	No	Yes
WebSocket Server	Realtime communication	No	Yes
AI Runtime	AI orchestration	No	Yes
Background Worker	Async jobs	No	Yes
MySQL	Persistent storage	Yes	Vertical + Replicas
Redis	Cache & queues	Yes	Yes
Nginx	Reverse proxy	No	Yes
SECTION 4 — Container Architecture
Frontend Container

Contains:

React build
Static assets
Nginx

Responsibilities:

Serve SPA
Compression
Cache headers
Route fallback

Never:

Execute business logic
Access database
Store user data
Backend API Container

Contains

Node.js
Express
REST API
Authentication
Business Engines

Responsibilities

Request validation
Business logic
Database access
Cache access
AI Runtime Container

Contains

AI orchestrator
Prompt manager
Model adapters
Inference pipeline

Communicates only through internal APIs.

No browser access.

Worker Container

Processes:

Telemetry aggregation
Offline queue replay
Notifications
Analytics
Scheduled jobs
Database Container

MySQL

Persistent volume

Automatic backups

No external exposure.

Redis Container

Stores

Cache
Session metadata
Job queues
Rate limiting counters
SECTION 5 — Network Architecture

External Network

Internet
        │
     HTTPS
        │
      Nginx

Internal Network

API
 │
 ├── MySQL
 ├── Redis
 ├── AI Runtime
 └── Worker

Only Nginx exposes ports publicly.

Everything else remains on an internal Docker network.

SECTION 6 — Environment Strategy

Three environments.

Development

Purpose

Developer productivity

Characteristics

Hot reload
Debug logs
Mock AI optional
Local Docker Compose
Staging

Purpose

Pre-production validation

Characteristics

Production configuration
Real integrations
Test database
Internal users only
Production

Characteristics

Optimized

Secure

Immutable

Autoscaled

Monitored

SECTION 7 — Environment Variables

Grouped by ownership.

Platform
NODE_ENV
PORT
APP_VERSION
Database
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
Redis
REDIS_HOST
REDIS_PORT
REDIS_PASSWORD
Authentication
JWT_SECRET
JWT_EXPIRES
REFRESH_SECRET
AI
AI_PROVIDER
AI_API_KEY
AI_MODEL
AI_TIMEOUT
WebSocket
WS_PORT
WS_HEARTBEAT
Storage
UPLOAD_DIRECTORY
MAX_UPLOAD_SIZE

Never committed.

Validated during startup.

SECTION 8 — Reverse Proxy

Nginx Responsibilities

HTTPS termination
Compression
Static assets
WebSocket upgrade
Security headers
Rate limiting
Gzip/Brotli
SPA fallback

Routing

/

↓

Frontend
/api

↓

Backend
/ws

↓

WebSocket
SECTION 9 — Storage Strategy

Persistent

MySQL

Redis persistence

Uploads

Logs

Ephemeral

Containers

Caches

Temporary files

Worker memory

Volumes

mysql-data

redis-data

uploads

logs
SECTION 10 — Backup Strategy

Database

Nightly full backup

Hourly incremental backups (optional based on RPO/RTO)

Retention

30 days

Uploads

Daily snapshot

Verification

Automated restore test

Monthly

SECTION 11 — Scaling Strategy

Stateless Services

Scale horizontally.

API

1 → N
Worker

1 → N
AI Runtime

1 → N

Database

Initially

Single instance

Future

Read replicas

Redis

Initially

Single node

Future

Cluster

SECTION 12 — High Availability

Frontend

Multiple replicas

API

Multiple replicas

Workers

Multiple replicas

Database

Primary

Replica

Redis

Persistence enabled

Automatic restart

SECTION 13 — Health Checks

Every service exposes

/health

Returns

{
  "status":"UP"
}

Readiness

/ready

Checks

Database
Redis
AI Runtime
SECTION 14 — Logging

Structured JSON logs.

Every request contains

Request ID
Timestamp
User ID (if authenticated)
Route
Duration
Status

Centralized aggregation recommended.

SECTION 15 — Monitoring

Metrics

CPU

Memory

Disk

Network

Latency

API Errors

Queue Length

WebSocket Connections

AI Latency

Session Starts

Assessment Success Rate

Alerts

5xx spike

Database unavailable

Redis unavailable

AI unavailable

High response time

SECTION 16 — Deployment Process

Pipeline

Git Push

↓

Build

↓

Tests

↓

Docker Image

↓

Security Scan

↓

Push Registry

↓

Deploy Staging

↓

Smoke Tests

↓

Approval

↓

Deploy Production

Zero-downtime deployment preferred.

SECTION 17 — Rollback Strategy

Every deployment tagged.

Example

v1.3.0

Rollback

v1.3.0

↓

v1.2.9

Database migrations

Must be reversible where feasible.

SECTION 18 — Disaster Recovery

Recoverable

API containers

Frontend

Workers

Redis cache

Database

Recovery Targets

Recovery Time Objective (RTO): ≤ 1 hour

Recovery Point Objective (RPO): ≤ 1 hour (or better if incremental backups are enabled)

SECTION 19 — Security Infrastructure

HTTPS mandatory

TLS

Secrets injected at runtime

Firewall

Internal networking

No public database

Container isolation

Read-only root filesystem where practical

Least privilege

SECTION 20 — Performance Infrastructure

Compression

Brotli/Gzip

HTTP/2 or HTTP/3 where supported

Static asset caching

ETags

CDN optional

Redis caching

Connection pooling

Lazy loading

SECTION 21 — Operational Runbooks

Defined procedures for:

Production deployment
Rollback
Database restore
Redis recovery
AI provider outage
WebSocket outage
Disk full
Certificate renewal
Secret rotation
Emergency maintenance

Each runbook specifies:

Trigger conditions
Responsible owner
Step-by-step actions
Verification checklist
Rollback/escalation path
SECTION 22 — Infrastructure Review
Reliability

Containerized services, health probes, restart policies, backups, and high-availability options provide resilience against infrastructure failures.

Scalability

Stateless application services, Redis-backed coordination, and modular AI runtime allow independent horizontal scaling as load increases.

Maintainability

Clear environment separation, immutable deployments, versioned Docker images, and operational runbooks simplify upgrades and incident response.

Security

Private internal networking, TLS termination, runtime secret injection, least-privilege execution, and isolated containers align with the Security Architecture Specification (SAS).

Cost Efficiency

The topology supports both a single-node Docker Compose deployment for development/small deployments and migration to Kubernetes or Docker Swarm without changing the application architecture.