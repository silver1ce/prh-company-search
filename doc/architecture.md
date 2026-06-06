# Architecture

## System overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (user)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend — React + Vite (port 5173)                            │
│  • SearchBar, ResultsTable, Pagination                          │
│  • TanStack Query (60s cache)                                   │
│  • URL param sync (?name=, ?business_id=, ?page=)              │
└────────────────────────────┬────────────────────────────────────┘
                             │ GET /api/companies
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend — FastAPI (port 3001)                                  │
│  • Router: validates params, returns SearchResponse             │
│  • PrhClient: maps PRH v3 JSON → Pydantic models                │
│  • Retry once on PRH network timeout                            │
└────────────────────────────┬────────────────────────────────────┘
                             │ GET /companies
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  PRH YTJ Open Data API v3                                       │
│  https://avoindata.prh.fi/opendata-ytj-api/v3                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Repository structure

```
prh-company-search/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry, CORS, /health
│   │   ├── core/config.py       # pydantic-settings
│   │   ├── models/company.py    # Address, CompanyResult, SearchResponse
│   │   ├── routers/companies.py # GET /api/companies
│   │   └── services/prh_client.py
│   ├── tests/
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pyproject.toml           # pytest, ruff, mypy config
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/          # SearchBar, ResultsTable, Pagination, …
│   │   ├── hooks/useCompanySearch.ts
│   │   ├── api/companiesApi.ts
│   │   └── types/company.ts
│   ├── package.json
│   └── vite.config.ts           # dev + preview proxy to :3001
├── e2e/search.spec.ts           # Playwright
├── .github/workflows/ci.yml
├── doc/                         # This documentation (local, not on GitHub yet)
├── Makefile
└── README.md
```

---

## Data mapping (PRH → application)

| PRH v3 field | App field | Notes |
|--------------|-----------|-------|
| `companies[].businessId.value` | `business_id` | Y-tunnus |
| `names[]` (type 1, no endDate) | `name` | Current primary name |
| `companyForms[]` (Finnish desc) | `company_form` | languageCode `"1"` |
| `registrationDate` | `registration_date` | Company level |
| `tradeRegisterStatus` | `status` | Trade register code |
| `addresses[]` (type 1) | `address` | Registered office first |
| `website.url` | `website` | |
| `contactDetails` | `phone` | Rarely present in v3 API |
| `totalResults` | `total_results` | |
| — | `page` | Client-side pagination over PRH pages |

PRH returns up to **100 results per page**. The backend maps `page`/`limit` to the correct PRH page and slices results.

---

## Request flow example

1. User enters `0112038-9` and clicks **Hae**
2. `SearchBar` calls `onSearch` → `App` updates URL and query params
3. `useCompanySearch` fetches `GET /api/companies?business_id=0112038-9`
4. Vite proxy forwards to `http://localhost:3001/api/companies?...`
5. FastAPI router calls `PrhClient.search_by_business_id()`
6. PrhClient calls `https://avoindata.prh.fi/.../companies?businessId=0112038-9`
7. Response mapped to `SearchResponse` → JSON → React table

---

## Tech stack

| Layer | Technologies |
|-------|-------------|
| Backend | Python 3.12, FastAPI, httpx, Pydantic v2, uvicorn |
| Frontend | React 18, TypeScript, Vite 5, TanStack Query v5, Tailwind CSS |
| Testing | pytest, respx, Vitest, React Testing Library, Playwright |
| CI | GitHub Actions |
| Code quality | ruff, mypy, ESLint, strict TypeScript |
