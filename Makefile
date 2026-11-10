SHELL := /bin/bash

.PHONY: help app-up app-down wait test smoke regression integration staging prod parallel lint demo

help: ## Show available Make targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

app-up: ## Start Practice Software Testing locally via Docker Compose and seed database
	docker compose up -d
	@for i in {1..30}; do \
		if docker compose exec -T mariadb mysqladmin ping -h localhost -u root -proot --silent 2>/dev/null; then \
			break; \
		fi; \
		sleep 2; \
	done
	docker compose exec -T laravel-api php artisan migrate:fresh --seed --force

app-down: ## Stop and remove local Docker Compose containers
	docker compose down -v

wait: ## Verify live Practice Software Testing site is reachable
	@for i in {1..10}; do \
		if curl -sf https://practicesoftwaretesting.com >/dev/null 2>&1; then \
			echo "Practice Software Testing is reachable at https://practicesoftwaretesting.com"; \
			exit 0; \
		fi; \
		sleep 2; \
	done; \
	echo "Timed out connecting to https://practicesoftwaretesting.com"; exit 1

test: ## Run full Cypress suite sequentially (1 worker)
	npm test

smoke: ## Run @smoke tagged specs only
	npm run test:smoke

regression: ## Run @regression tagged specs only
	npm run test:regression

api: ## Run @api REST contract & health check specs only
	npm run test:api

integration: ## Run #integration environment-tagged tests only
	npm run test:integration

staging: ## Run #staging environment-tagged tests only
	npm run test:staging

prod: ## Run #prod safe read-only tests only
	npm run test:prod

parallel: ## Run weight-balanced parallel suite via cypress-parallel (2 threads)
	npm run test:parallel

lint: ## Run ESLint across all specs, page objects, and helpers
	npm run lint

demo: lint parallel ## Lint code and run parallel E2E suite against live target
