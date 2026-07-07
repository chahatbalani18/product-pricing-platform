# Product Pricing & Catalog Intake Platform

A full-stack web application for submitting, validating, storing, and reporting on product pricing data — replacing spreadsheet-based intake with a centralized system backed by a cloud database.

Built as a demonstration of end-to-end product delivery: requirements → data modeling → API → UI → cloud persistence.

---

## The Problem

Organizations launching products across multiple teams or regions often collect pricing data through scattered spreadsheets. This creates predictable failures: duplicate SKUs, inconsistent formats, no validation, no audit trail, and no single source of truth. Someone eventually has to reconcile it all by hand.

This platform replaces that workflow with a structured intake system:

- A **submission form** validates input at entry (positive prices, required fields, unique SKUs).
- A **central API** enforces business rules and writes to a single database.
- A **reporting dashboard** shows the full catalog with status filtering.
- Data **persists to a managed cloud database**, so it survives restarts and is accessible from anywhere.

---

## Architecture

```mermaid
flowchart LR
    subgraph FE["Frontend — React + Vite"]
        A[Intake form]
        B[Reporting dashboard]
    end

    subgraph BE["Backend — FastAPI"]
        C[Validation + CRUD]
        D[CORS + /docs]
    end

    subgraph DB["Neon — Cloud Postgres"]
        E[(products table)]
    end

    A -- "POST product" --> C
    B -- "GET catalog" --> C
    C -- "JSON response" --> B
    C -- "SQLAlchemy / psycopg" --> E
```

**Frontend:** React + Vite, axios for API calls. Two views — a product intake form and a reporting dashboard with client-side status filtering.

**Backend:** FastAPI with SQLAlchemy ORM. Exposes a REST API with full CRUD, request/response validation via Pydantic schemas, and interactive API docs auto-generated at `/docs`.

**Database:** PostgreSQL hosted on Neon (serverless cloud Postgres). Connection credentials are supplied via environment variables and never committed to source control.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, axios               |
| Backend    | FastAPI, Uvicorn, Pydantic          |
| ORM        | SQLAlchemy 2.0                       |
| DB driver  | psycopg (v3)                        |
| Database   | PostgreSQL (Neon serverless)        |
| Config     | python-dotenv (env-based secrets)   |

---

## Data Model

The core `products` table:

| Column        | Type      | Notes                              |
|---------------|-----------|------------------------------------|
| id            | UUID      | Primary key, auto-generated        |
| sku           | String    | Unique, indexed                    |
| product_name  | String    | Required                           |
| category      | String    | Optional                           |
| unit_price    | Numeric   | Required, must be > 0              |
| currency      | String    | Defaults to USD                    |
| submitted_by  | String    | Required (simulates team/region)   |
| region        | String    | Optional                           |
| status        | Enum      | pending / approved / rejected      |
| created_at    | Timestamp | Server-generated                   |
| updated_at    | Timestamp | Auto-updated on change             |

---

## API Endpoints

| Method | Route              | Purpose                          |
|--------|--------------------|----------------------------------|
| POST   | `/products/`       | Create a product (409 on dup SKU)|
| GET    | `/products/`       | List products (paginated)        |
| GET    | `/products/{id}`   | Fetch one product                |
| PATCH  | `/products/{id}`   | Partial update                   |
| DELETE | `/products/{id}`   | Delete a product                 |
| GET    | `/health`          | Health check                     |

Interactive documentation available at `http://127.0.0.1:8000/docs` when running.

---

## Running Locally

### Prerequisites
- Python 3.12+
- Node.js 20+
- A PostgreSQL connection string (e.g. a free Neon database)

### Backend

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql+psycopg://user:password@host/dbname?sslmode=require
```

Then run:

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Both servers must run simultaneously.

---

## Design Decisions

**Separate Pydantic schemas from SQLAlchemy models.** The API's input/output shapes (`ProductCreate`, `ProductOut`) are defined independently from the database model. This decouples the public contract from the storage schema — a change to one doesn't force a change to the other, and it prevents accidentally exposing internal fields.

**Environment-based configuration.** Database credentials live in a gitignored `.env` file and are loaded at runtime, never hardcoded. This is the same pattern required for any real deployment and keeps secrets out of version control.

**Validation at the boundary.** Prices must be positive and SKUs must be unique — enforced both by Pydantic (request validation) and the database (unique constraint), so invalid data is rejected before it can cause downstream problems.

**Explicit CORS policy.** The backend allows requests only from the known frontend origin rather than using a wildcard, which is closer to production-safe practice.

**Schema creation via `create_all` (current) vs. migrations (next step).** Tables are currently auto-created on startup, which is convenient for development. For production, Alembic migrations (already a dependency) would manage schema changes with version history — a documented tradeoff rather than an oversight.

---

## Roadmap

- [ ] Alembic migrations for versioned schema changes
- [ ] Containerization and cloud deployment (public URL)
- [ ] CI/CD pipeline (automated tests + deploy)
- [ ] Price-history audit table
- [ ] Authentication for the approval workflow

---

*Built as a portfolio project demonstrating full-stack development, API design, and cloud data persistence. All data is synthetic.*
