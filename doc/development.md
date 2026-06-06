# Development Guide

## Daily workflow

```bash
make dev          # start backend + frontend
make test         # run all tests
make lint         # check code quality
```

---

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React UI |
| Backend API | http://localhost:3001 | FastAPI |
| Swagger docs | http://localhost:3001/docs | Interactive API explorer |
| Health check | http://localhost:3001/health | CI / monitoring |

The Vite dev server **proxies** `/api/*` requests to the backend on port 3001. You do not need to configure CORS for local dev.

---

## Demo searches

Try these in the UI:

| Search type | Input | Expected result |
|-------------|-------|-----------------|
| Company name | `Nokia Oyj` | Nokia Oyj (0112038-9) |
| Y-tunnus | `0112038-9` | Single result: Nokia Oyj |
| Broad name | `Nokia` | Many results, pagination |
| Empty submit | (leave both empty) | Validation: *Anna yrityksen nimi tai Y-tunnus* |

**Direct URL examples:**
```
http://localhost:5173/?name=Nokia+Oyj
http://localhost:5173/?business_id=0112038-9
http://localhost:5173/?name=Nokia&page=2
```

---

## UI features (Finnish labels)

| Component | Finnish label | Behaviour |
|-----------|---------------|-----------|
| SearchBar | Yrityksen nimi, Y-tunnus | Search + Tyhjennä buttons |
| ResultsTable | Nimi, Y-tunnus, Yritysmuoto… | Sortable columns, row click expands detail |
| Pagination | Näytetään X–Y / Z tuloksesta | Previous / Next page |
| Empty state | Ei hakutuloksia | Shown when no results |

Search parameters sync to the browser URL (`?name=`, `?business_id=`, `?page=`).

---

## Backend development

```bash
cd backend
source .venv/bin/activate

# Run with auto-reload
uvicorn app.main:app --reload --port 3001

# Run tests only
pytest

# Run with coverage
pytest --cov=app --cov-report=term-missing

# Lint
ruff check .
mypy app
```

### Key backend files

```
backend/app/
├── main.py              # FastAPI app, CORS, /health
├── core/config.py       # Settings from .env
├── models/company.py    # Pydantic response models
├── services/prh_client.py  # PRH API HTTP client
└── routers/companies.py    # GET /api/companies
```

---

## Frontend development

```bash
cd frontend

npm run dev      # dev server with HMR
npm run build    # production build → dist/
npm run preview  # serve dist/ (used in CI E2E)
npm test         # Vitest unit tests
npm run lint     # ESLint + TypeScript check
```

### Key frontend files

```
frontend/src/
├── App.tsx                    # URL sync, query state
├── components/SearchBar.tsx
├── components/ResultsTable.tsx
├── components/Pagination.tsx
├── hooks/useCompanySearch.ts  # TanStack Query
└── api/companiesApi.ts        # fetch wrapper
```

---

## Production-like local preview

To test the built frontend (as CI does):

```bash
# Terminal 1
cd backend && .venv/bin/uvicorn app.main:app --port 3001

# Terminal 2
cd frontend && npm run build && npm run preview -- --port 5173
```

The Vite preview server also proxies `/api` to port 3001.

---

## Makefile reference

| Command | What it does |
|---------|--------------|
| `make install` | Install all dependencies |
| `make dev` | Start backend + frontend |
| `make test` | Backend pytest + frontend vitest |
| `make test-cov` | Backend coverage report (opens browser) |
| `make lint` | ruff, mypy, eslint, tsc |
| `make e2e` | Playwright tests (servers must be running) |
