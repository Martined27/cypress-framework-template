# Cypress E2E Framework Template (`cypress-framework-template`)

[![Cypress E2E Suite (Parallel)](https://github.com/Martined27/cypress-framework-template/actions/workflows/e2e.yml/badge.svg)](https://github.com/Martined27/cypress-framework-template/actions/workflows/e2e.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-style **Cypress 13** end-to-end and API test automation framework built around **Singleton Page Objects**, **Scoped Module Helpers vs. Global Commands**, **readable test steps (`cy.step()`)**, **suite & environment tag filtering (`@cypress/grep`)**, **REST API test data seeding**, and **weight-balanced parallel spec execution (`cypress-parallel`)**.

Tested against the live modern web application **[Practice Software Testing - Toolshop](https://practicesoftwaretesting.com)** with its public REST API backend at `https://api.practicesoftwaretesting.com`.

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

### 3. Self-Documenting Test Steps (`cypress-plugin-steps`)
Every test uses `cy.step('...')` from [`cypress-plugin-steps`](https://github.com/filiphric/cypress-plugin-steps) to log numbered, human-readable step headers directly in the Cypress Command Log and failure output without relying on stale comments:
```js
cy.step('Open shopping basket view with seeded cart ID');
BasketPage.visit(testCartId);
cy.wait('@getBasket').its('response.statusCode').should('be.oneOf', [200, 304]);

cy.step('Delete item from basket and verify API call');
BasketPage.removeFirstItem();
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

This repo uses [`cypress-parallel`](https://www.npmjs.com/package/cypress-parallel) out of the box (`cypress-parallel -s cy:run -t 2 -d 'cypress/e2e/**/*.cy.js'`), which automatically searches for Cypress specs, generates and reads its weights file on its own, splits specs across threads, and collects the results into a single table.

---

## Repository Structure

```text
cypress-framework-template/
├── README.md
├── LICENSE
├── Makefile                         # One-command targets: demo, test, smoke, regression, parallel, lint
├── cypress.config.js                # Cypress 13 config + @cypress/grep + mochawesome reporter
├── cypress.env.json.example         # Environment variable template
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
    └── e2e.yml                      # GitHub Actions CI: Lint + reachability check + parallel run + HTML report artifact
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm ci
```

### 2. Run the Full Demo (Lints + Runs Parallel Suite against live target)
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

# Environment-scoped runs (#integration, #staging, #prod):
npm run test:integration
npm run test:staging
npm run test:prod

# Combine suite + environment tags (e.g., @smoke tests safe for #prod):
npx cypress run --env grepTags="@smoke+#prod"

# Override target URL:
CYPRESS_BASE_URL=https://practicesoftwaretesting.com npm run test:smoke
```

---

## License

[MIT](LICENSE) © 2026 Martin De Leon
