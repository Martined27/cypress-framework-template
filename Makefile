SHELL := /bin/bash

.PHONY: help up down wait test smoke regression parallel lint demo

help: ## Show available Make targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

up: ## Start local OWASP Juice Shop container on port 3000
	docker compose up -d juice-shop
	@$(MAKE) wait

wait: ## Wait for OWASP Juice Shop to respond on http://localhost:3000
	@for i in {1..25}; do \
		if curl -sf http://localhost:3000 >/dev/null 2>&1; then \
			echo "Juice Shop is ready at http://localhost:3000"; \
			exit 0; \
		fi; \
		sleep 2; \
	done; \
	echo "Timed out waiting for Juice Shop"; exit 1

test: ## Run full Cypress suite sequentially (1 worker)
	npm test

smoke: ## Run @smoke tagged specs only
	npm run test:smoke

regression: ## Run @regression tagged specs only
	npm run test:regression

parallel: ## Run weight-balanced parallel suite via cypress-parallel (2 threads)
	npm run test:parallel

lint: ## Run ESLint across all specs, page objects, and helpers
	npm run lint

demo: up lint parallel ## Start target container, lint code, and run parallel E2E suite

down: ## Stop and remove local OWASP Juice Shop container
	docker compose down -v --remove-orphans
