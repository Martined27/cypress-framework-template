# Cypress E2E Framework Template (`cypress-framework-template`)

[![Cypress E2E Suite (Parallel)](https://github.com/Martined27/cypress-framework-template/actions/workflows/e2e.yml/badge.svg)](https://github.com/Martined27/cypress-framework-template/actions/workflows/e2e.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-style **Cypress 13** end-to-end and API test automation framework built around **Lambda Page Objects**, **Scoped Module Helpers vs. Global Commands**, **`cy.session()` authentication caching**, **`.env` configuration (`dotenv`)**, **readable test steps (`cy.step()`)**, **suite & environment tag filtering (`@cypress/grep`)**, **REST API test data seeding**, and **weight-balanced parallel spec execution (`cypress-parallel`)**.

### Target Application (Hybrid Live + Docker CI)
- **Local Development (Default)**: Runs directly against the live **[Practice Software Testing - Toolshop](https://practicesoftwaretesting.com)** Angular SPA and its REST API (`https://api.practicesoftwaretesting.com`) with zero container setup required.
- **GitHub Actions CI (and optional local Docker)**: Boots the official **Practice Software Testing** Docker stack (`docker-compose.yml` — Angular UI on `:4200`, Nginx + Laravel API on `:8091`, and MariaDB) and seeds a fresh database before running the suite, bypassing public Cloudflare WAF blocks on cloud runner IPs.

---

## Core Architecture & Design Conventions

### 1. Global `cy.*` Commands vs. Imported Scoped Methods (No Namespace Collisions)
As a Cypress suite grows across dozens of product areas, putting every helper into `cypress/support/commands.js` pollutes the global `cy.*` namespace and forces verbose, awkward command names (`cy.loginFormSubmit()` vs. `cy.registrationFormSubmit()`) to avoid overwriting commands across modules.

This framework enforces a strict three-tier boundary and avoids single-use helper abstractions:

| Layer | Location | Scope | What Belongs Here |
| :--- | :--- | :--- | :--- |
| **1. Global Commands** | [`cypress/support/commands.js`](cypress/support/commands.js) | Global (`cy.*`) | Strictly cross-application primitives (`cy.loginViaApi()` with `cy.session()` caching). |
| **2. Page Objects (POM)** | [`cypress/pages/*.js`](cypress/pages/) | Imported per spec | Object-literal Page Objects (`LoginPage`, `RegistrationPage`, `CatalogPage`, `BasketPage`) using single-line arrow function locators (`locator: () => cy.get('...')`) and shared view actions (`submit`, `visit`). |
| **3. Scoped Domain Helpers** | [`cypress/helpers/*.js`](cypress/helpers/) | Imported per spec | Reusable multi-spec API setup and network intercept aliases (`auth.helpers.js`, `basket.helpers.js`, `intercepts.js`). Single-use actions remain inline inside their spec. |

### 2. Fast Session Caching (`cy.session()`) & API-First State Seeding
Only the dedicated login and registration specs drive the authentication UI. Authenticated specs call `cy.loginViaApi()`, which wraps `cy.session([email, password], setup, { validate })` to authenticate once via `POST /users/login`, cache the JWT in `localStorage`, and restore the session across subsequent `it()` blocks without repeating network login calls.

### 3. Self-Documenting Test Steps (`cypress-plugin-steps`)
Every test uses `cy.step('...')` from [`cypress-plugin-steps`](https://github.com/filiphric/cypress-plugin-steps) to log numbered, human-readable step headers directly in the Cypress Command Log and failure output:
```js
cy.step('Open shopping basket view with seeded cart ID');
BasketPage.visit(testCartId);
cy.wait('@getBasket').its('response.statusCode').should('be.oneOf', [200, 304]);

cy.step('Delete item from basket and verify API call');
BasketPage.basketRows().first().find('a').last().click();
cy.wait('@deleteBasketItem').its('response.statusCode').should('eq', 204);
```

### 4. Suite & Environment Tag Filtering (`@cypress/grep`)
Specs carry both **suite tags** (`@smoke`, `@regression`, `@api`) and **target environment tags** (`#integration`, `#staging`, `#prod`) with `grepFilterSpecs: true` and `grepOmitFiltered: true` enabled so filtered specs are skipped before browser launch:

| Tag Type | Tag | Purpose | Command |
| :--- | :--- | :--- | :--- |
| **Suite** | `@smoke` | Fast critical-path UI + API readiness checks | `npm run test:smoke` |
| **Suite** | `@regression` | Full functional, negative-path, and API contract suite | `npm run test:regression` |
| **Suite** | `@api` | Headless REST contract & authorization checks only | `npm run test:api` |
| **Environment** | `#integration` | Full suite including account creation & state-mutating flows | `npm run test:integration` |
| **Environment** | `#staging` | Pre-production verification excluding noisy user registration spam | `npm run test:staging` |
| **Environment** | `#prod` | Strictly read-only, non-destructive checks safe for live production | `npm run test:prod` |

Tags can also be combined with `+` (AND) or space (OR) using `@cypress/grep`:
```bash
# Run only @smoke tests that are safe for #prod:
npx cypress run --env grepTags="@smoke+#prod"
```

---

## Weight-Balanced Parallel Execution (`cypress-parallel`)

Running specs in parallel by splitting file counts evenly (`4 specs + 4 specs`) often leaves one worker bottlenecked on the longest E2E walkthroughs.

This repo uses [`cypress-parallel`](https://www.npmjs.com/package/cypress-parallel) (`cypress-parallel -s cy:run -t 2 -d 'cypress/e2e/**/*.cy.js'`), which automatically discovers Cypress specs, balances threads by spec execution weight, and aggregates results into a unified summary table.

---

## Repository Structure

```text
cypress-framework-template/
├── README.md
├── LICENSE
├── Makefile                         # Targets: demo, app-up, app-down, test, smoke, regression, parallel, lint
├── docker-compose.yml               # Local & CI Practice Software Testing stack (UI, API, Nginx, MariaDB)
├── _docker/
│   └── vhost.conf                   # Multi-arch Nginx FastCGI config for Laravel API container
├── cypress.config.js                # Cypress 13 config + dotenv + @cypress/grep + mochawesome reporter
├── .env.example                     # Environment variable template (URLs & test credentials)
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
│   │   └── intercepts.js
│   ├── support/
│   │   ├── commands.js
│   │   └── e2e.js
│   └── fixtures/
│       └── users.json
└── .github/workflows/
    └── e2e.yml                      # GitHub Actions CI: Lint + Docker stack + parallel Chrome run
```

---

## How to Run

### 1. Initial Setup (Dependencies & `.env`)
```bash
npm ci
cp .env.example .env
```

### 2. Mode A — Run Against Live App (Default, Zero Docker Required)
By default, `.env` points to `https://practicesoftwaretesting.com` and `https://api.practicesoftwaretesting.com`:
```bash
# Run linter + parallel suite (2 threads) against the live target:
make demo

# Or run via npm scripts:
npm run test:parallel        # Parallel execution (2 threads)
npm test                     # Sequential headless execution
npm run cy:open              # Interactive Cypress Test Runner UI
```

### 3. Mode B — Run Against Local Docker Stack (Same as GitHub Actions CI)
To run completely offline/locally without hitting Cloudflare or the public internet:
```bash
# 1. Start MariaDB, Laravel API (:8091), Nginx, and Angular UI (:4200) and seed DB:
make app-up

# 2. Run the parallel Cypress suite against localhost:4200 & localhost:8091:
make test-local
# (or: npm run test:local)

# 3. Stop and remove containers + volumes when finished:
make app-down
```

### 4. Run by Suite or Environment Tag (`@cypress/grep`)
```bash
# Suite tags:
npm run test:smoke           # @smoke critical path only
npm run test:regression      # @regression full functional suite
npm run test:api             # @api headless REST contract checks only

# Environment tags:
npm run test:integration     # #integration (includes registration & state mutation)
npm run test:staging         # #staging (pre-prod verification)
npm run test:prod            # #prod (strictly read-only checks)

# Combine tags (e.g., @smoke tests safe for #prod):
npx cypress run --env grepTags="@smoke+#prod"
```

---

## License

[MIT](LICENSE) © 2026 Martin De Leon
