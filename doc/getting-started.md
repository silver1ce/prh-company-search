# Getting Started

## Prerequisites

| Tool | Minimum version | Check command |
|------|-----------------|---------------|
| Python | 3.12+ | `python3 --version` |
| Node.js | 20+ | `node --version` |
| npm | 10+ (bundled with Node) | `npm --version` |
| Make | any (optional) | `make --version` |
| Git | any | `git --version` |

**macOS / VS Code tip:** If `npm: command not found` appears in the terminal, use one of these fixes:

1. **Recommended** — run from the **project root** (not the `frontend` folder):
   ```bash
   cd /path/to/prh-company-search
   make dev
   ```
   The Makefile automatically uses the project’s local Node at `.node/bin/` when system `npm` is missing.

2. **Manual frontend** — add local Node to your PATH first:
   ```bash
   export PATH="/path/to/prh-company-search/.node/bin:$PATH"
   cd frontend
   npm run dev
   ```

3. **Permanent fix** — install Node.js 20+ LTS from https://nodejs.org/ (then `npm` works everywhere).

---

## 1. Clone the repository

```bash
git clone https://github.com/silver1ce/prh-company-search.git
cd prh-company-search
```

---

## 2. Install dependencies

### Option A — Makefile (recommended)

```bash
make install
```

This will:
- Create `backend/.venv` and install Python packages
- Run `npm install` in `frontend/`
- Run `npm install` at project root (Playwright)

### Option B — Manual install

```bash
# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
cd ..

# Frontend
cd frontend
npm install
cd ..

# Playwright (root, for E2E)
npm install
npx playwright install chromium
```

---

## 3. Configure environment

```bash
cp backend/.env.example backend/.env
```

Default values work for local development. See [configuration.md](configuration.md) for details.

---

## 4. Run the application

**Always start from the project root** (folder that contains `Makefile`, `backend/`, and `frontend/`):

```bash
make dev
```

This starts both backend and frontend in one terminal. Do **not** run `npm run dev` inside `frontend/` unless `npm` is on your PATH (see macOS tip above).

Or manually in two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 3001
```

**Terminal 2 — Frontend:**
```bash
export PATH="/path/to/prh-company-search/.node/bin:$PATH"   # if npm not found
cd frontend
npm run dev
```

---

## 5. Verify it works

| Check | URL | Expected |
|-------|-----|----------|
| Frontend UI | http://localhost:5173 | Search form loads |
| Backend health | http://localhost:3001/health | `{"status":"ok"}` |
| API docs | http://localhost:3001/docs | Swagger UI |
| Sample search | http://localhost:5173/?business_id=0112038-9 | Nokia Oyj appears |

---

## 6. Stop the servers

Press `Ctrl+C` in the terminal running `make dev`, or stop each terminal separately.

---

## Next steps

- [Development guide](development.md) — demo searches, UI features
- [Testing guide](testing.md) — run tests before committing
- [Troubleshooting](troubleshooting.md) — if something fails
