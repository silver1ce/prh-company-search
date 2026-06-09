# Use project-local Node/npm when system npm is missing (see doc/getting-started.md)
ifneq (,$(wildcard .node/bin/npm))
export PATH := $(CURDIR)/.node/bin:$(PATH)
endif

install:
	cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt -r requirements-dev.txt
	cd frontend && npm install
	npm install

dev:
	trap 'kill 0' EXIT; \
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 3001 & \
	cd frontend && npm run dev

test:
	cd backend && .venv/bin/pytest
	cd frontend && npm test

test-cov:
	cd backend && .venv/bin/pytest --cov=app --cov-report=html
	open backend/htmlcov/index.html

lint:
	cd backend && .venv/bin/ruff check . && .venv/bin/mypy app
	cd frontend && npm run lint

e2e:
	npx playwright test
