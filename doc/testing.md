# Testing Guide

## Overview

| Layer | Tool | Location | Command |
|-------|------|----------|---------|
| Backend unit + integration | pytest, respx | `backend/tests/` | `cd backend && .venv/bin/pytest` |
| Frontend unit | Vitest, RTL | `frontend/src/__tests__/` | `cd frontend && npm test` |
| End-to-end | Playwright | `e2e/` | `npx playwright test` |
| Lint / types | ruff, mypy, eslint, tsc | — | `make lint` |

---

## Run all tests

```bash
make test
```

---

## Backend tests

```bash
cd backend
source .venv/bin/activate
pytest
```

### With HTML coverage report

```bash
make test-cov
# Opens backend/htmlcov/index.html in browser
```

### Coverage requirement

Minimum **80%** coverage enforced in `pyproject.toml`:

```toml
addopts = "--cov=app --cov-report=term-missing --cov-fail-under=80"
```

### Test files

| File | What it tests |
|------|---------------|
| `test_models.py` | Pydantic model validation |
| `test_prh_client.py` | PRH client mapping (mocked with respx) |
| `test_companies_router.py` | FastAPI routes (mocked service) |

### Example: run a single test

```bash
cd backend
pytest tests/test_prh_client.py -v
pytest tests/test_prh_client.py::test_search_by_business_id_success -v
```

---

## Frontend tests

```bash
cd frontend
npm test
```

### Test files

| File | What it tests |
|------|---------------|
| `SearchBar.test.tsx` | Renders, submits, validates empty |
| `ResultsTable.test.tsx` | Rows, skeleton, empty state |
| `useCompanySearch.test.ts` | TanStack Query hook |

### Watch mode (during development)

```bash
cd frontend
npx vitest
```

---

## End-to-end tests (Playwright)

E2E tests hit the **real PRH API** through your local backend.

### Prerequisites

1. Install Playwright browsers (once):

```bash
npm install          # root
npx playwright install chromium
```

2. Start both servers:

```bash
# Terminal 1
cd backend && .venv/bin/uvicorn app.main:app --port 3001

# Terminal 2
cd frontend && npm run build && npm run preview -- --port 5173
```

3. Run tests:

```bash
npx playwright test
```

Or use `make e2e` (requires servers already running).

### E2E scenarios

| Test | What it verifies |
|------|------------------|
| Search by name | `Nokia Oyj` appears in results |
| Search by Y-tunnus | `0112038-9` returns Nokia Oyj |
| Row click | Detail panel expands (Verkkosivu) |
| Pagination | Page 2 loads for broad `Nokia` search |
| Empty submit | Validation alert shown |

### View test report

```bash
npx playwright show-report
```

---

## Linting and type checking

```bash
make lint
```

Breakdown:

```bash
# Backend
cd backend
ruff check .
mypy app

# Frontend
cd frontend
npm run lint    # eslint + tsc --noEmit
```

---

## CI (GitHub Actions)

Every push to `main` runs the full pipeline automatically:

| Job | Steps |
|-----|-------|
| `lint-backend` | ruff + mypy (with deps installed) |
| `test-backend` | pytest with 80% coverage gate |
| `lint-frontend` | eslint + tsc |
| `test-frontend` | vitest |
| `e2e` | uvicorn + vite preview + Playwright |
| `build` | verify backend starts + frontend builds |

Badge: https://github.com/silver1ce/prh-company-search/actions
