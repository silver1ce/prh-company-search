# PRH Company Search / PRH Yrityshaku

[![CI](https://github.com/silver1ce/prh-company-search/actions/workflows/ci.yml/badge.svg)](https://github.com/silver1ce/prh-company-search/actions/workflows/ci.yml)

**Owner / Author / Contributor:** Jahangir

**English:** Production-ready web application for searching Finnish companies via the PRH (Patent and Registration Office) open data API. Search by company name or business ID (Y-tunnus) and browse results in a responsive table.

**Suomeksi:** Tuotantokelpoinen verkkosovellus suomalaisten yritysten hakemiseen PRH:n avoimen datan rajapinnan kautta. Hae yrityksen nimellä tai Y-tunnuksella ja selaa tuloksia taulukossa.

## Architecture

```
┌─────────────┐     HTTP      ┌──────────────────┐     HTTP      ┌─────────────────┐
│   React     │ ────────────► │  FastAPI Backend │ ────────────► │  PRH YTJ API v3 │
│  (Vite)     │  /api/companies│  (port 3001)     │  /companies   │  (avoindata.prh)│
│  port 5173  │               │                  │               │                 │
└─────────────┘               └──────────────────┘               └─────────────────┘
```

```
prh-company-search/
├── backend/          # Python FastAPI API proxy & mapper
├── frontend/         # React + TypeScript + TanStack Query UI
├── e2e/              # Playwright end-to-end tests
├── .github/workflows/# CI pipeline
└── Makefile          # Developer shortcuts
```

## Prerequisites

- Python 3.12+
- Node.js 20+
- Make (optional, recommended)

## Setup

```bash
make install
```

Or manually:

```bash
cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt -r requirements-dev.txt
cd frontend && npm install
npm install   # Playwright (root)
```

Copy environment variables:

```bash
cp backend/.env.example backend/.env
```

## Development

Start both servers:

```bash
make dev
```

- Backend API: http://localhost:3001
- Frontend UI: http://localhost:5173
- Health check: http://localhost:3001/health

The Vite dev server proxies `/api` requests to the backend.

## Testing

```bash
make test        # Backend pytest + frontend Vitest
make test-cov    # Backend coverage report (opens htmlcov)
make e2e         # Playwright (requires both servers or CI preview setup)
make lint        # ruff + mypy + eslint + tsc
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PRH_BASE_URL` | `https://avoindata.prh.fi/opendata-ytj-api/v3` | PRH open data API base URL |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Allowed CORS origins (JSON list) |
| `LOG_LEVEL` | `INFO` | Python logging level |

> **Note:** The live PRH API is the YTJ v3 endpoint. The older `opendata/tr/v1` path referenced in some docs returns 404.

## API

### `GET /api/companies`

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Company name search |
| `business_id` | string | Finnish business ID (Y-tunnus) |
| `page` | int | Page number (default 1) |
| `limit` | int | Results per page (default 20, max 100) |

At least one of `name` or `business_id` is required.

## Tech stack

- **Backend:** FastAPI, httpx, Pydantic v2, pytest, respx
- **Frontend:** React 18, TypeScript, Vite, TanStack Query v5, Tailwind CSS
- **E2E:** Playwright
- **CI:** GitHub Actions

## License

Uses PRH open data under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
