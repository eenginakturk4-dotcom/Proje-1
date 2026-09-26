# Shoppy Backend API

Express.js REST API with Prisma ORM and PostgreSQL.

---

## 🛠️ Stack & Libraries
- **Node.js 20+** & **Express**
- **Prisma ORM** with **PostgreSQL** (and SQLite fallback option)
- **JWT** (Access Token + Refresh Token rotation)
- **bcryptjs** for secure password hashing
- **Vitest & Supertest** for testing

---

## 🚀 Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Initialize Database
#### Option A: PostgreSQL with Docker Compose (Recommended)
From repo root:
```bash
docker compose up -d
```
Then run migrations and seed:
```bash
npx prisma migrate dev --name init
npm run seed
```

#### Option B: Instant Local SQLite (No Docker required)
```bash
npm run setup:sqlite
```

### 4. Run Development Server
```bash
npm run dev
```
API will be live at `http://localhost:4000`.

---

## 📡 Key Endpoints

### Auth
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Log in and receive access + refresh tokens
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Revoke refresh token
- `GET /api/auth/me` — Get current user profile (Bearer token required)

### Catalog
- `GET /api/categories` — List all categories
- `GET /api/products` — Search and filter products (`?search=`, `?category=`, `?sort=`, `?page=`)
- `GET /api/products/:id` — Product details
- `GET /api/products/featured` — Featured products

### Cart (Auth required)
- `GET /api/cart` — Get user cart items
- `POST /api/cart` — Add product to cart `{ productId, quantity }`
- `PUT /api/cart/:id` — Update quantity `{ quantity }`
- `DELETE /api/cart/:id` — Remove item
- `DELETE /api/cart` — Clear cart

### Orders & Checkout (Auth required)
- `POST /api/checkout/mock` — Complete mock payment and convert cart to order
- `GET /api/orders` — List customer orders
- `GET /api/orders/:id` — Order details

### Admin (`role: ADMIN` required)
- `GET /api/admin/stats` — Store statistics
- `GET /api/admin/products` — List all products
- `POST /api/admin/products` — Create new product
- `PUT /api/admin/products/:id` — Update product
- `DELETE /api/admin/products/:id` — Delete product
- `GET /api/admin/orders` — View all store orders
- `PATCH /api/admin/orders/:id/status` — Update order status

---

## 🧪 Testing
```bash
npm test
```
