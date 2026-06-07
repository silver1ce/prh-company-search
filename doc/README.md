# PRH Company Search — Documentation

**Suomeksi:** PRH Yrityshaku — projektin dokumentaatio  
**English:** Documentation index for running, testing, and maintaining this project.

---

## Document index

| Document | Description |
|----------|-------------|
| [Getting started](getting-started.md) | Prerequisites, installation, first run |
| [Development guide](development.md) | Daily dev workflow, demo searches, URLs |
| [Configuration](configuration.md) | Environment variables, API reference |
| [Testing guide](testing.md) | Unit, integration, E2E, coverage, lint |
| [Architecture](architecture.md) | System design, folder structure, data flow |
| [Troubleshooting](troubleshooting.md) | Common problems and fixes |
| [GitHub & CI](github-and-ci.md) | Repository, CI pipeline, deployment notes |

---

## Quick start (30 seconds)

```bash
cd /path/to/prh-company-search
make install
cp backend/.env.example backend/.env
make dev
```

Open http://localhost:5173 and search for **Nokia Oyj** or Y-tunnus **0112038-9**.

---

## Project at a glance

| Item | Value |
|------|-------|
| Frontend | React 18 + TypeScript + Vite (port **5173**) |
| Backend | FastAPI + Python (port **3001**) |
| External API | PRH YTJ v3 open data |
| Repo (GitHub) | https://github.com/silver1ce/prh-company-search |
| Owner | Jahangir |
