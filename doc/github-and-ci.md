# GitHub & CI

## Repository

| Item | Value |
|------|-------|
| URL | https://github.com/silver1ce/prh-company-search |
| Owner | Jahangir (`silver1ce`) |
| Default branch | `main` |
| Visibility | Public |

---

## Clone and contribute

```bash
git clone https://github.com/silver1ce/prh-company-search.git
cd prh-company-search
make install
make dev
```

---

## CI pipeline

Workflow file: `.github/workflows/ci.yml`

Triggered on: push to `main`, all pull requests.

| Job | Purpose |
|-----|---------|
| `lint-backend` | `ruff check` + `mypy app` |
| `test-backend` | `pytest` with ≥80% coverage |
| `lint-frontend` | `eslint` + `tsc --noEmit` |
| `test-frontend` | `vitest run` |
| `e2e` | Playwright against live PRH API |
| `build` | Backend startup check + `npm run build` |

View runs: https://github.com/silver1ce/prh-company-search/actions

---

## Pushing changes

```bash
git add <files>
git commit -m "feat: your message"
git push origin main
```

Commit style: [Conventional Commits](https://www.conventionalcommits.org/) — e.g. `feat:`, `fix:`, `docs:`, `test:`, `chore:`.

---

## Publishing the `doc/` folder

The `doc/` folder is currently **local only**. When ready to publish:

```bash
git add doc/
git commit -m "docs: add project documentation"
git push origin main
```

Review all files in `doc/` before committing.

---

## Environment secrets

No GitHub secrets are required for CI — the PRH API is public and requires no API key.

For local development, keep secrets in `backend/.env` (never commit).
