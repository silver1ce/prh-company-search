# Business Overview — For Non-Technical Leaders

**Suomeksi:** Liiketoimintakatsaus — ei-teknisille johtajille  
**English:** A plain-language guide to what this project does, how it works, and why it matters for the business.

**Audience:** Product owners, team leads, managers, and stakeholders who need to understand the project without reading code.

**Owner / Author:** Jahangir

---

## In one sentence

This is a **web application that lets anyone search Finnish company information** — by company name or Y-tunnus (business ID) — using official data from PRH (Patent and Registration Office).

---

## The business problem

Teams often need to look up company details quickly:

- Verify a customer or partner’s legal name and registration status
- Confirm a Y-tunnus before contracts or invoicing
- Check registered address, company form, and website
- Research companies without opening multiple government websites

**Before:** Staff might search PRH’s raw data tools manually, copy-paste into spreadsheets, or rely on outdated lists.

**After:** One simple search page returns structured results in seconds.

---

## What users can do

| Action | Example |
|--------|---------|
| Search by company name | Type **Nokia Oyj** → see matching companies |
| Search by Y-tunnus | Enter **0112038-9** → see that exact company |
| Browse multiple results | Paginate through long result lists |
| Share a search | Copy the browser URL — search criteria stay in the link |
| View key details | Name, Y-tunnus, company form, registration date, status, address, website |

The interface is in Finnish and works on desktop and mobile browsers.

---

## How it works — simple picture

Think of three layers, like a shop:

```
  Customer (browser)
        │
        ▼
  Shop front  ──  What people see and click (search box, results table)
        │
        ▼
  Back office ──  Organises requests, checks rules, formats answers
        │
        ▼
  Supplier    ──  PRH official open data (source of truth)
```

| Layer | Business role | What it does |
|-------|---------------|--------------|
| **Shop front** (web page) | Customer experience | Search form, results table, loading states, error messages |
| **Back office** (application server) | Operations & control | Validates searches, talks to PRH, returns clean, consistent data |
| **Supplier** (PRH API) | Official data source | Finnish company register — always up to date from the government |

**Important:** The application does **not** store its own copy of the company register. Every search fetches live data from PRH. That means results reflect the official register at the time of the search.

---

## How the project was built

The work followed a standard, professional software delivery approach:

### 1. Define the need
- Search Finnish companies by name or Y-tunnus
- Show results in a clear, readable table
- Use official PRH open data only

### 2. Build in two parts
- **User-facing part** — the website people interact with
- **Processing part** — the service that connects to PRH and prepares data for display

This split is common in modern software: the user experience can evolve independently from data and security rules.

### 3. Connect to official data
- Integrated with PRH’s **YTJ open data API** (the current live register interface)
- Mapped government data fields into a consistent format for the application

### 4. Quality checks at every stage
Automated checks run before any change is accepted:

| Check type | Business meaning |
|------------|------------------|
| Code standards | Reduces bugs and makes future changes safer |
| Automated tests | Proves search, pagination, and error handling work |
| End-to-end tests | Simulates a real user search against live PRH data |
| Build verification | Confirms the application can be packaged and deployed |

All checks run automatically on **GitHub** whenever code is updated. The latest builds are passing.

### 5. Documentation
Technical guides exist for developers. This document explains the same project in business terms.

---

## Business impact

### Time savings
- **Seconds instead of minutes** per company lookup
- No manual copying between systems
- Shareable search links reduce repeated questions (“Can you look up this Y-tunnus again?”)

### Accuracy & trust
- Data comes directly from **PRH**, the official source
- Reduces risk of outdated or incorrect company details in internal notes

### Low operating cost
- Uses **free open data** (PRH YTJ API)
- No proprietary data licence fees for the register itself
- Standard web stack — easy to host on common cloud or internal servers

### Scalability
- The design supports many concurrent users
- Search results are cached briefly (60 seconds) to reduce load without showing stale data for long

### Compliance & transparency
- Data used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (PRH open data terms)
- Clear separation: application logic vs. official register data

### Maintainability
- Automated testing and continuous integration mean changes can be made with confidence
- Documented setup so new team members can take over without hidden knowledge

---

## What has been delivered

| Deliverable | Status |
|-------------|--------|
| Working company search web application | Done |
| Search by name and Y-tunnus | Done |
| Results table with pagination | Done |
| Backend service connected to PRH | Done |
| Automated test suite | Done |
| Continuous integration on GitHub | Done |
| Project documentation | Done |
| Public source repository | [github.com/silver1ce/prh-company-search](https://github.com/silver1ce/prh-company-search) |

---

## How to run it (for your team)

You do not need to understand the technology to **use** the application. For **running** it on a laptop or server, ask a developer or IT contact to follow these steps:

```bash
git clone https://github.com/silver1ce/prh-company-search.git
cd prh-company-search
make install
cp backend/.env.example backend/.env
make dev
```

Then open **http://localhost:5173** in a browser.

| Step | Who | Time |
|------|-----|------|
| Clone & install | Developer / IT | ~5–10 minutes (first time) |
| Start application | Developer / IT | ~30 seconds |
| Search companies | Any business user | Immediate |

For day-to-day development and deployment details, see [getting-started.md](getting-started.md) and [github-and-ci.md](github-and-ci.md).

---

## Demo searches (try these)

| Search type | Value | Expected result |
|-------------|-------|-----------------|
| Company name | Nokia Oyj | Nokia and related entities |
| Y-tunnus | 0112038-9 | Nokia Oyj details |

---

## Risks & limitations (honest view)

| Topic | What to know |
|-------|--------------|
| **Depends on PRH** | If PRH’s API is down or slow, searches may fail or take longer. The app retries once on timeout. |
| **Live data only** | No offline database; every search needs network access to PRH. |
| **Search rules** | At least a name or Y-tunnus is required; empty searches are rejected. |
| **Not a CRM** | This is a lookup tool, not customer relationship management or contract storage. |

These are normal for register-lookup tools and are documented for technical teams in [troubleshooting.md](troubleshooting.md).

---

## Possible next steps (business ideas)

If the organisation wants to extend value beyond lookup:

- **Embed in internal portals** — iframe or link from intranet
- **Export results** — CSV download for audit or sales lists
- **Saved searches** — history for frequent lookups (would need user accounts)
- **Alerts** — notify when a company’s status changes (would need scheduled jobs)
- **Production hosting** — deploy to Azure, AWS, or on-premise for organisation-wide access

These are optional enhancements; the current delivery is a complete, working search product.

---

## Where to learn more

| If you want… | Read… |
|--------------|-------|
| Plain business summary (this page) | [business-overview.md](business-overview.md) |
| Install and first run | [getting-started.md](getting-started.md) |
| How the system is designed | [architecture.md](architecture.md) |
| Repository and automated quality checks | [github-and-ci.md](github-and-ci.md) |
| Full documentation index | [README.md](README.md) |

---

## Summary for leadership

**PRH Company Search** turns official Finnish company register data into a fast, easy web search. It was built with professional practices — automated testing, continuous integration, and clear documentation — so it is reliable today and maintainable tomorrow. The business gains quicker lookups, trusted official data, and a foundation that can grow if the organisation needs more features later.
