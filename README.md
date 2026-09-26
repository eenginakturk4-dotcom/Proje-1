# Shoppy — A Learning E-Commerce Platform

> Scope is deliberately small. This is not meant to become a real store — it's meant to touch auth, a real database, a REST API, and a frontend that talks to it, without sprawling into features nobody needs to practice.

---

## 🎯 What We're Building

A minimal but complete e-commerce flow:
- **Browse products, search and filter by category**
- **User accounts** (register / log in / log out)
- **A cart that persists per user**
- **Checkout** (mock payment for v1; real Stripe test-mode integration is a stretch goal)
- **Order history** for the logged-in user
- **A small admin panel** to add/edit products and view orders

*That's it. No recommendations engine, no reviews, no wishlist — those are fine as stretch issues once the core loop works.*

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
| :--- | :--- | :--- |
| **Frontend** | React + Vite + Tailwind CSS | Fastest path from zero to a working UI; huge amount of learning material |
| **Backend** | Node.js + Express (REST API) | Same language as the frontend — one less context switch for beginners |
| **Database** | PostgreSQL + Prisma ORM | Prisma's schema file doubles as living documentation of the data model |
| **Auth** | JWT (access + refresh tokens), bcrypt | The standard pattern you'll see in almost every real-world API |
| **Payments** | Mock checkout for v1 → Stripe test mode | Stripe test mode is free and genuinely useful to learn, but not a v1 blocker |
| **Local Dev** | Docker Compose (Postgres only) | Nobody has to install Postgres by hand |
| **Deployment** | Render / Railway / Fly.io / Docker | Free/hobby tiers, simple enough to deploy from Dockerfile |

---

## 🏛️ Architecture

```text
┌─────────────┐       REST / JSON      ┌──────────────┐          SQL          ┌────────────┐
│    React    │ ─────────────────────▶ │   Express    │ ────────────────────▶ │ PostgreSQL │
│ (Vite app)  │ ◀───────────────────── │   REST API   │ ◀──────────────────── │  (Prisma)  │
└─────────────┘                        └──────────────┘                       └────────────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │ Stripe (test │
                                       │mode, stretch)│
                                       └──────────────┘
```

> The frontend never talks to the database directly — everything goes through the API. That boundary is strictly maintained even though it's a small project.

---

## 📂 Repo Structure

```text
Shoppy/
├── apps/
│   ├── backend/          # Express API
│   │   ├── src/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── .env.example
│   │   └── README.md     # backend-specific setup
│   └── frontend/         # React + Vite app
│       └── README.md     # frontend-specific setup
├── docs/
│   └── issues/           # one file per issue — copy each into a GitHub issue
├── docker-compose.yml    # local Postgres
├── .env.example
├── CONTRIBUTING.md
└── README.md             # this file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+**
- **Docker Desktop** (or any Docker engine for PostgreSQL)
- **Git**

### Step-by-Step Setup

```bash
# 1. Clone and enter the repository
git clone <your-repo-url> teamcart && cd teamcart

# 2. Start PostgreSQL locally
docker compose up -d

# 3. Set up the backend
cd apps/backend
cp .env.example .env
# fill in DATABASE_URL / JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run seed              # populates catalog with initial demo items
npm run dev               # API runs on http://localhost:4000

# 4. In a second terminal, set up the frontend
cd apps/frontend
npm install
npm run dev               # App runs on http://localhost:5173
```

> **Tip for local dev without Docker:**
> You can also run the database directly with SQLite using `npm run db:sqlite` in `apps/backend` if PostgreSQL or Docker is not installed on your local system!

---

## 📚 Learning Modules / Workstreams

Each row is roughly one issue. Assign by current strength, not by who "should" learn it — pair the person newer to the topic with whoever's more confident in it, working the same issue together rather than in isolation.

| Workstream | Skills Practiced | Issue File |
| :--- | :--- | :--- |
| **Project scaffolding & tooling** | Monorepo setup, linting, Docker, CI basics | [`docs/issues/00-scaffolding.md`](file:///docs/issues/00-scaffolding.md) |
| **Database schema** | Relational modeling, Prisma, migrations | [`docs/issues/01-database-schema.md`](file:///docs/issues/01-database-schema.md) |
| **Auth API** | JWT, password hashing, middleware | [`docs/issues/02-auth-api.md`](file:///docs/issues/02-auth-api.md) |
| **Auth frontend** | Forms, client-side auth state, protected routes | [`docs/issues/03-auth-frontend.md`](file:///docs/issues/03-auth-frontend.md) |
| **Catalog API** | REST design, pagination, search/filter queries | [`docs/issues/04-catalog-api.md`](file:///docs/issues/04-catalog-api.md) |
| **Catalog frontend** | Data fetching, component design, loading/error states | [`docs/issues/05-catalog-frontend.md`](file:///docs/issues/05-catalog-frontend.md) |
| **Cart & checkout** | Client state, API design for a stateful flow | [`docs/issues/06-cart-checkout.md`](file:///docs/issues/06-cart-checkout.md) |
| **Orders & admin panel** | CRUD, role-based access | [`docs/issues/07-orders-admin.md`](file:///docs/issues/07-orders-admin.md) |
| **Testing & CI** | Unit/integration tests, GitHub Actions | [`docs/issues/08-testing-ci.md`](file:///docs/issues/08-testing-ci.md) |
| **Deployment** | Dockerfiles, environment config, hosting | [`docs/issues/09-deployment.md`](file:///docs/issues/09-deployment.md) |

---

## 🏁 Suggested Milestones

- **M0 — Setup**: Scaffolding issue done, everyone's dev environment runs
- **M1 — Foundations**: Database schema + auth (API and frontend) merged
- **M2 — Core loop**: Catalog (API and frontend) merged, products are browsable
- **M3 — Transactions**: Cart, checkout, and orders merged — a user can complete a full purchase
- **M4 — Polish**: Admin panel, tests, CI green
- **M5 — Ship it**: Deployed somewhere with a real URL, even a free-tier one

---

## 🤝 How We Work

See [`CONTRIBUTING.md`](file:///CONTRIBUTING.md) for branch naming, commit style, and the PR checklist.

**Short version:**
`one issue → one branch → one PR that links back to the issue → one teammate reviews it before merge.`

---

## 📄 License

MIT — see [`LICENSE`](file:///LICENSE). This is a learning project; do whatever's useful with it!
