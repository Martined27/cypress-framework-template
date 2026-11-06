# Cypress E2E Framework Template (`cypress-framework-template`)

[![Cypress E2E Suite (Parallel)](https://github.com/Martined27/cypress-framework-template/actions/workflows/e2e.yml/badge.svg)](https://github.com/Martined27/cypress-framework-template/actions/workflows/e2e.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-style **Cypress 13** end-to-end and API test automation framework built around **Singleton Page Objects**, **Scoped Module Helpers vs. Global Commands**, **tag-based suite filtering (`@cypress/grep`)**, **REST API test data seeding**, and **weight-balanced parallel spec execution (`cypress-parallel`)**.

Tested against a local containerized [OWASP Juice Shop](https://github.com/juice-shop/juice-shop) instance (`docker compose up -d`).

---

## Core Architecture & Design Conventions

### 1. Global `cy.*` Commands vs. Imported Scoped Methods (No Namespace Collisions)
As a Cypress suite grows across dozens of product areas, putting every helper into `cypress/support/commands.js` pollutes the global `cy.*` namespace and forces verbose, awkward command names (`cy.loginFormSubmit()` vs. `cy.registrationFormSubmit()`) to avoid overwriting commands across modules.

This framework enforces a strict three-tier boundary:

| Layer | Location | Scope | What Belongs Here |
| :--- | :--- | :--- | :--- |
| **1. Global Commands** | [`cypress/support/commands.js`](cypress/support/commands.js) | Global (`cy.*`) | Strictly cross-application primitives needed by almost every spec (`cy.loginViaApi()`, `cy.dismissOverlays()`). |
| **2. Page Objects (POM)** | [`cypress/pages/*.js`](cypress/pages/) | Imported per spec | Singleton classes (`LoginPage`, `RegistrationPage`, `CatalogPage`, `BasketPage`) owning selectors and view-scoped actions. Both `LoginPage.submit()` and `RegistrationPage.submit()` share clean method names because they are scoped to their imported Page Object instance. |
| **3. Scoped Domain Helpers** | [`cypress/helpers/*.js`](cypress/helpers/) | Imported per spec | Domain-specific API setup/teardown and network intercept aliases (`auth.helpers.js`, `basket.helpers.js`, `intercepts.js`) imported only where needed. |

### 2. API-First Setup & State Seeding
Only the dedicated login and registration specs drive the authentication UI. All other functional specs provision users, obtain JWTs, and seed or clear shopping-basket items directly via `cy.request()` before visiting the target route, keeping UI specs fast and independent.

### 3. Tag-Based Suite Filtering (`@cypress/grep`)
Specs carry suite and layer tags (`@smoke`, `@regression`, `@api`) with `grepFilterSpecs: true` and `grepOmitFiltered: true` enabled so filtered specs are skipped before browser launch:
- `npm run test:smoke` — Fast critical-path UI + API readiness checks
- `npm run test:regression` — Full functional, negative-path, and API contract suite
- `npm run test:api` — Headless REST contract & authorization checks only

---

## Weight-Balanced Parallel Execution (`cypress-parallel`)

Running specs in parallel by splitting file counts evenly (`4 specs + 4 specs`) often leaves one worker bottlenecked on the longest E2E walkthroughs.

This repo uses [`cypress-parallel`](https://www.npmjs.com/package/cypress-parallel) with a committed [`parallel-weights.json`](parallel-weights.json) profile. After each run, spec durations and relative weights are recorded so slow and fast specs are balanced across worker threads:

### Real Benchmark (Local Electron Headless against OWASP Juice Shop)

| Execution Mode | Command | Specs / Tests | Wall-Clock Time | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Sequential (1 Worker)** | `npm test` | 8 specs (14 tests) | **23.72s** | Runs all 8 specs serially in a single process |
| **Weighted Parallel (2 Workers)** | `npm run test:parallel` | 8 specs (14 tests) | **17.16s** (**~28% faster**) | Balances spec weights across 2 concurrent workers |

#### Worker Bucket Allocation from `parallel-weights.json`
- **Worker 1 (Total weight `35` — 1 heavy UI walkthrough + 2 fast API specs):**
  - `regression/registration-flow.cy.js` (`5.89s`, weight `35`)
  - `regression/api-contracts.cy.js` (`0.12s`, weight `0`)
  - `smoke/api-health.cy.js` (`0.10s`, weight `0`)
- **Worker 2 (Total weight `40` — 5 medium UI specs):**
  - `regression/auth-negative.cy.js` (`1.80s`, weight `10`)
  - `regression/product-search.cy.js` (`1.78s`, weight `10`)
  - `smoke/auth-login.cy.js` (`1.62s`, weight `9`)
  - `regression/basket-management.cy.js` (`1.16s`, weight `6`)
  - `smoke/catalog-load.cy.js` (`0.87s`, weight `5`)

---

## Repository Structure

```text
cypress-framework-template/
├── README.md
├── LICENSE
├── Makefile                         # One-command targets: demo, up, test, smoke, regression, parallel, lint, down
├── Dockerfile                       # Containerized runner (cypress/included:13.15.0)
├── docker-compose.yml               # Local OWASP Juice Shop target (:3000)
├── cypress.config.js                # Cypress 13 config + @cypress/grep + mochawesome reporter
├── cypress.env.json.example         # Environment variable template
├── parallel-weights.json            # Spec duration weights for balanced parallel execution
├── .eslintrc.cjs                    # ESLint + eslint-plugin-cypress (forbids hard waits)
├── cypress/
│   ├── e2e/
│   │   ├── smoke/
│   │   │   ├── api-health.cy.js
│   │   │   ├── auth-login.cy.js
│   │   │   └── catalog-load.cy.js
│   │   └── regression/
│   │       ├── api-contracts.cy.js
│   │       ├── auth-negative.cy.js
│   │       ├── basket-management.cy.js
│   │       ├── product-search.cy.js
│   │       └── registration-flow.cy.js
│   ├── pages/
│   │   ├── BasketPage.js
│   │   ├── CatalogPage.js
│   │   ├── LoginPage.js
│   │   └── RegistrationPage.js
│   ├── helpers/
│   │   ├── auth.helpers.js
│   │   ├── basket.helpers.js
│   │       └── intercepts.js
│   ├── support/
│   │   ├── commands.js
│   │   └── e2e.js
│   └── fixtures/
│       └── users.json
└── .github/workflows/
    └── e2e.yml                      # GitHub Actions CI: Lint + Juice Shop service + parallel run + HTML report artifact
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm ci
```

### 2. Run the Full Local Demo (Starts Juice Shop + Lints + Runs Parallel Suite)
```bash
make demo
```

### 3. Run Individual Suites or Target Another Environment
```bash
# Smoke suite only (@smoke):
npm run test:smoke

# Regression suite only (@regression):
npm run test:regression

# API contract suite only (@api):
npm run test:api

# Override target URL (e.g., against a deployed staging environment):
CYPRESS_BASE_URL=https://staging.my-webapp.com npm run test:smoke
```

---

## License

[MIT](LICENSE) © 2026 Martin De Leon
