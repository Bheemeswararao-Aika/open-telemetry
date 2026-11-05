# OpenTelemetry Astronomy Shop – Advanced Engineering Debugging Challenge

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Challenge Type](https://img.shields.io/badge/Challenge-Full--Stack%20Debugging-orange.svg)]()

---

## 1. Project Overview

Welcome to the **OpenTelemetry Astronomy Shop**, a distributed, microservice-based e-commerce platform designed to simulate a modern enterprise-grade cloud native application. The application provides an online storefront where users can browse astronomy equipment (telescopes, binoculars, accessories), select currencies, manage their shopping carts, receive contextual recommendations, calculate shipping quotes, and place orders.

This repository serves as a hands-on, advanced engineering assessment and debugging lab. The codebase represents a realistic polyglot architecture consisting of frontend services, backend microservices, event streaming pipelines, distributed databases, and an observability stack.

---

## 2. Project Objectives

- Provide a realistic distributed microservices architecture for full-stack engineering analysis.
- Expose engineers to real-world software failures spanning frontends, API contracts, databases, caching layers, and asynchronous consumers.
- Hone diagnostic methodology using code inspection, system logs, browser developer tools, and distributed telemetry traces.
- Evaluate engineering problem-solving, root cause analysis, code craftsmanship, and regression testing.

---

## 3. Technology Stack

The project features a modern polyglot microservices stack:

| Component | Technology | Role |
|---|---|---|
| **Frontend** | Next.js 14, React 18, TypeScript, Styled-Components | Responsive web storefront, UI state management |
| **State Management** | TanStack Query (React Query), React Context | Server-state caching and client session persistence |
| **Cart Service** | .NET 8 / C#, Valkey (Redis protocol) | Fast key-value cart storage and lifecycle management |
| **Checkout Service** | Go 1.22+, gRPC, HTTP | Order processing coordinator & event publisher |
| **Product Catalog** | Go 1.22+, PostgreSQL, gRPC | Relational product inventory & search service |
| **Payment Service** | Node.js (Express / gRPC) | Card validation and transaction processing |
| **Shipping Service** | Rust (Actix-web), HTTP REST | Shipping quote calculation and package tracking |
| **Quote Service** | PHP 8.2 (Slim Framework), HTTP REST | Per-item shipping pricing engine |
| **Currency Service** | C++ 20, gRPC | Multi-currency exchange rate conversions |
| **Accounting Service**| C# (.NET 8), Apache Kafka, PostgreSQL | Event-driven order persistence and audit |
| **Recommendation** | Kotlin / Java (Gradle), gRPC | Contextual product recommendations |
| **Ad Service** | Java (Spring / gRPC) | Targeted banner ad delivery |
| **Email Service** | Ruby, gRPC | Order confirmation email rendering |
| **Database & Cache** | PostgreSQL 16, Valkey 7.2 | Relational datastore & key-value cache |
| **Messaging** | Apache Kafka | Event bus for asynchronous order processing |
| **Proxy & Routing** | Envoy Proxy | API gateway and reverse proxy |
| **Observability** | OpenTelemetry, Prometheus, Grafana, Jaeger | Distributed tracing, metrics, and structured logging |

---

## 4. Architecture Overview

```
                      +-------------------+
                      |   Browser Client  |
                      +---------+---------+
                                | (HTTP :8080)
                                v
                      +---------+---------+
                      |    Envoy Proxy    |
                      +----+---------+----+
                           |         |
          +----------------+         +-----------------+
          |                                            |
          v                                            v
+---------+---------+                        +---------+---------+
|     Frontend      |                        |    Observability  |
|  (Next.js / SSR)  |                        |  (Jaeger/Grafana) |
+----+---------+----+                        +-------------------+
     |         |
     |         +-------------------+
     | (gRPC)                      | (gRPC)
     v                             v
+----+---------------+   +---------+---------+   +-------------------+
|  Product Catalog   |   |   Cart Service    |-->|  Valkey (Cache)   |
|   (Go / Postgres)  |   |    (.NET / C#)    |   +-------------------+
+----+---------------+   +-------------------+
     |
     v
+----+---------------+
|   PostgreSQL DB    |
| (catalog/accounts) |
+----+---------------+
     ^
     |
+----+---------------+   +-------------------+   +-------------------+
|     Checkout       |-->|   Payment (Node)  |   |  Shipping (Rust)  |
|    Service (Go)    |   +-------------------+   +---------+---------+
+----+---------------+                                     | (HTTP)
     |               \                                     v
     | (Kafka)        \--> Shipping / Currency    +--------+---------+
     v                                            |    Quote (PHP)   |
+----+---------------+                            +-------------------+
|   Apache Kafka     |
|   (orders topic)   |
+----+---------------+
     |
     v
+----+---------------+
| Accounting (.NET)  |
+--------------------+
```

---

## 5. Prerequisites

Before setting up the project, ensure your workstation meets the following requirements:

- **Docker Desktop** (version 24.0 or higher) with Docker Compose v2.
- **System Resources:** At least 8 GB of RAM allocated to Docker (16 GB recommended for full stack).
- **Node.js** (v18.x or v20.x LTS) & `npm` (for local frontend inspection).
- **Git** (v2.30+).
- **Web Browser:** Google Chrome, Firefox, or Chromium-based browser with Developer Tools.

---

## 6. Installation & Quick Start Instructions

### Step 1: Clone the Repository

```bash
git clone <STUDENT_REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

### Step 2: Environment Configuration

Inspect the default environment variables provided in `.env`:

```bash
# Verify environment defaults
cat .env
```

The default ports configured are:
- **Frontend / Envoy Proxy:** `http://localhost:8080`
- **Jaeger Tracing UI:** `http://localhost:8080/jaeger/ui/` (or port 16686)
- **Grafana Dashboards:** `http://localhost:8080/grafana/` (or port 3000)
- **Feature Flag UI:** `http://localhost:8080/feature/`

---

## 7. Starting the Application

The fastest and most reliable way to run the complete distributed architecture is via Docker Compose:

### Core & Observability Services (Recommended)

```bash
docker compose up -d
```

### Full Deployment (including Kafka, Accounting, Fraud Detection)

```bash
docker compose -f compose.yaml -f compose.full.yaml -f compose.observability.yaml up -d
```

### Checking Service Health

```bash
docker compose ps
```

Verify that all critical containers are running and healthy (`frontend`, `cart`, `checkout`, `product-catalog`, `payment`, `shipping`, `currency`, `astronomy-db`, `valkey-cart`).

### Viewing Logs

```bash
# View combined logs
docker compose logs -f

# View logs for a specific microservice
docker compose logs -f frontend
docker compose logs -f checkout
docker compose logs -f cart
```

---

## 8. Local Development Setup (Optional)

If you wish to run or inspect individual microservices locally:

### Frontend (Next.js)

```bash
cd src/frontend
npm install
npm run dev
```

The local development server will start on `http://localhost:3000`.

### Database Verification

The PostgreSQL database initializes automatically using `src/postgresql/init.sql`. You can connect using any standard PostgreSQL client:

- **Host:** `localhost` (port `5432`)
- **Database:** `astronomy_db`
- **Username:** `astronomy_user`
- **Password:** `astronomy_password`

---

## 9. Application Access & Routes

Once started, access the following entry points:

- **Storefront Home:** [http://localhost:8080](http://localhost:8080)
- **Shopping Cart:** [http://localhost:8080/cart](http://localhost:8080/cart)
- **Product Detail Pages:** Navigate from home or click any product card
- **Jaeger Distributed Tracing:** [http://localhost:8080/jaeger/ui/](http://localhost:8080/jaeger/ui/)
- **Grafana Monitoring:** [http://localhost:8080/grafana/](http://localhost:8080/grafana/)

---

## 10. Advanced Engineering Debugging Challenge

> ### ⚠️ Debugging Assessment Instructions
> 
> This software release represents an active production candidate that has undergone recent feature additions and service refactorings. While the application builds and boots up, subtle functional defects, architectural regressions, concurrency races, security flaws, and performance bottlenecks have been observed across multiple microservices.
>
> Your mission as a Senior Full-Stack Engineer is to rigorously investigate the system, uncover the hidden issues, identify their root causes, implement production-grade fixes, and validate your solutions.

### Candidate Expectations & Methodology

You are expected to:

1. **Understand System Architecture:** Study the relationships between the frontend, gRPC services, databases, caching layers, and event streams.
2. **Investigate Application Behaviour:** Test user workflows including catalog browsing, currency switching, cart adjustments, checkout, shipping calculations, and order persistence.
3. **Inspect Telemetry & Logs:** Utilize Jaeger distributed traces, OpenTelemetry spans, container logs, and browser DevTools to diagnose anomalies.
4. **Identify Issues:** Detect both obvious visual/functional bugs and hidden systemic flaws (e.g. race conditions, memory leaks, security holes, precision errors).
5. **Analyze Root Causes:** Explain the underlying technical mechanics behind why each issue occurs (distinguishing symptoms from root causes).
6. **Implement Fixes:** Deliver clean, idiomatic, robust code modifications that solve the root problems without introducing regressions.
7. **Write Validation Tests:** Create unit, integration, or manual validation procedures to prove the efficacy of your fixes.
8. **Document Findings:** Compile a comprehensive engineering report detailing your diagnostic findings, code diffs, and verification proof.

---

## 11. Submission Guidelines

Your completed submission must include:

1. **Source Code Repository:** A fork or clean branch containing your code changes organized into descriptive, atomic Git commits.
2. **Debugging Report (`DEBUGGING_REPORT.md`):** A Markdown report detailing:
   - **Issue Summary:** What anomalous behavior was observed?
   - **Affected Services & Files:** Exact file paths, functions, or components.
   - **Root Cause Analysis:** Technical explanation of the failure mechanism.
   - **Resolution:** Explanation of your fix and the engineering principles applied.
   - **Verification:** Test cases or reproduction steps demonstrating resolution.
3. **Validation Proof:** Screenshots or terminal logs confirming the fix (e.g. clean traces in Jaeger, passing test suites).

---

## 12. Troubleshooting & Diagnostics

- **Containers failing to connect:** Ensure Docker has sufficient memory allocated ($\ge 8$ GB) and ports `8080`, `5432`, `6379`, `9092` are not occupied by local host processes.
- **Telemetry traces missing:** Verify `otel-collector` is healthy: `docker compose logs otel-collector`.
- **Database resets:** To reset persistent volumes: `docker compose down -v && docker compose up -d`.

Happy debugging!
