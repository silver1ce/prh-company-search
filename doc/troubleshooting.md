# Troubleshooting

## Installation issues

### `npm: command not found`

Install Node.js 20+ from https://nodejs.org/, or use nvm:

```bash
nvm install 20
nvm use 20
```

### `python3: command not found` or wrong version

Install Python 3.12+ from https://www.python.org/ or Homebrew:

```bash
brew install python@3.12
```

### `make: command not found`

Run commands manually — see [getting-started.md](getting-started.md) Option B.

---

## Runtime issues

### Frontend loads but search returns errors

**Cause:** Backend not running.

**Fix:**
```bash
curl http://localhost:3001/health
# Should return {"status":"ok"}
```

Start backend:
```bash
cd backend && .venv/bin/uvicorn app.main:app --reload --port 3001
```

### `502 PRH API unavailable`

**Cause:** PRH open data API is down, rate-limited, or network timeout.

**Fix:**
- Wait and retry
- Check https://avoindata.prh.fi/fi/ytj/swagger-ui is reachable
- Increase timeout in `prh_client.py` if needed (default 10s)

### CORS errors in browser console

**Cause:** Frontend accessed on a URL not in `CORS_ORIGINS`.

**Fix:** Add your origin to `backend/.env`:
```env
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

Or use the Vite dev server (which proxies `/api` and avoids CORS).

### Port already in use

```bash
# Find process on port 3001 or 5173
lsof -i :3001
lsof -i :5173

# Kill it
kill <PID>
```

---

## Search result issues

### Searching "Nokia" does not show "Nokia Oyj"

**Expected behaviour.** A broad `Nokia` search returns many companies; Nokia Oyj may not appear on page 1. Use:
- Name: `Nokia Oyj`
- Y-tunnus: `0112038-9`

### Phone number always empty

The PRH v3 API rarely exposes `contactDetails`. The field is mapped when present but is usually `null`.

---

## Test failures

### Backend: `ModuleNotFoundError`

Activate the virtual environment:
```bash
cd backend && source .venv/bin/activate
```

### Backend: coverage below 80%

```bash
cd backend
pytest --cov=app --cov-report=term-missing
```

Add tests for uncovered lines shown in the report.

### Frontend: `Cannot find module`

```bash
cd frontend && npm install
```

### E2E: `Executable doesn't exist` (Playwright)

```bash
npx playwright install chromium
```

### E2E: tests timeout

Ensure both servers are running before `npx playwright test`:
```bash
curl http://127.0.0.1:3001/health
curl http://127.0.0.1:5173
```

---

## Git / GitHub issues

### `git push` authentication failed

Use a Personal Access Token with `repo` scope, or run:
```bash
./scripts/setup-github.sh
```

### Cursor showing as contributor on GitHub

GitHub caches contributors. The active repo was recreated with clean history. If Cursor still appears, hard-refresh the page or wait 24–48 hours.

---

## Getting help

1. Check backend logs in the terminal running uvicorn
2. Check browser DevTools → Network tab for `/api/companies` responses
3. Test API directly: `curl "http://localhost:3001/api/companies?business_id=0112038-9"`
4. Review [configuration.md](configuration.md) for API details
