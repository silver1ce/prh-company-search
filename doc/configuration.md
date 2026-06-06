# Configuration

## Environment variables

Copy the example file before first run:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PRH_BASE_URL` | `https://avoindata.prh.fi/opendata-ytj-api/v3` | PRH open data API base URL |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | JSON list of allowed browser origins |
| `LOG_LEVEL` | `INFO` | Python log level (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |

### Example `.env`

```env
PRH_BASE_URL=https://avoindata.prh.fi/opendata-ytj-api/v3
CORS_ORIGINS=["http://localhost:5173"]
LOG_LEVEL=INFO
```

### Production notes

- Add your production frontend URL to `CORS_ORIGINS`, e.g. `["https://your-app.example.com"]`
- Never commit `.env` — it is listed in `.gitignore`

---

## Backend API reference

### `GET /health`

Returns service status.

```bash
curl http://localhost:3001/health
# {"status":"ok"}
```

### `GET /api/companies`

Search Finnish companies via PRH open data.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | one of name/business_id | — | Company name search |
| `business_id` | string | one of name/business_id | — | Y-tunnus, e.g. `0112038-9` |
| `page` | int | no | `1` | Page number (≥ 1) |
| `limit` | int | no | `20` | Results per page (1–100) |

**Examples:**

```bash
# Search by name
curl "http://localhost:3001/api/companies?name=Nokia+Oyj"

# Search by Y-tunnus
curl "http://localhost:3001/api/companies?business_id=0112038-9"

# Pagination
curl "http://localhost:3001/api/companies?name=Nokia&page=2&limit=10"
```

**Response shape:**

```json
{
  "results": [
    {
      "business_id": "0112038-9",
      "name": "Nokia Oyj",
      "company_form": "Julkinen osakeyhtiö",
      "registration_date": "1896-12-19",
      "status": "1",
      "address": {
        "street": "Karakaari 7",
        "post_code": "02610",
        "city": "ESPOO"
      },
      "website": "www.nokia.com",
      "phone": null
    }
  ],
  "total_results": 1,
  "page": 1
}
```

**Error codes:**

| Code | Meaning |
|------|---------|
| 422 | Neither `name` nor `business_id` provided |
| 404 | Business ID not found |
| 502 | PRH API unavailable or timeout |

---

## PRH external API

| Item | Value |
|------|-------|
| Live endpoint | `https://avoindata.prh.fi/opendata-ytj-api/v3` |
| Swagger | https://avoindata.prh.fi/fi/ytj/swagger-ui |
| License | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

> **Note:** The path `opendata/tr/v1` mentioned in some older specs returns 404. This project uses the **YTJ v3** API.

---

## Frontend configuration

The frontend reads an optional build-time variable:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE` | `""` (empty) | API base URL. Empty = same origin (proxied in dev/preview) |

For production without a proxy, set at build time:

```bash
VITE_API_BASE=https://api.your-domain.com npm run build
```
