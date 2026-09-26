# Issue 01: Database Schema & Relational Modeling

**Milestone:** M1 — Foundations  
**Skills Practiced:** Relational modeling, Prisma ORM, migrations, seeding initial data.

---

## 🎯 Objective
Design and implement the PostgreSQL database schema using Prisma ORM. The schema should support users, refresh tokens, product catalog, categories, persistent cart items, and order history.

---

## 📋 Acceptance Criteria
- [ ] Prisma schema defined in `apps/backend/prisma/schema.prisma`.
- [ ] Models implemented:
  - `User`: id, email, passwordHash, name, role (USER | ADMIN), createdAt, updatedAt
  - `RefreshToken`: id, token, userId, expiresAt, revoked, createdAt
  - `Category`: id, name, slug, createdAt
  - `Product`: id, title, description, price, imageUrl, categoryId, stock, featured, createdAt, updatedAt
  - `CartItem`: id, userId, productId, quantity, createdAt, updatedAt
  - `Order`: id, orderNumber, userId, status (PENDING | PAID | SHIPPED | DELIVERED | CANCELLED), totalAmount, shippingAddress, paymentMethod, paymentId, createdAt, updatedAt
  - `OrderItem`: id, orderId, productId, title, price, quantity
- [ ] Relations established (e.g., User has many CartItems, Product belongs to Category, Order has many OrderItems).
- [ ] Seeding script (`apps/backend/prisma/seed.ts` or `seed.js`) creates:
  - Default categories
  - 8-12 sample products with images and prices
  - Admin user (`admin@shoppy.local` / `admin123`)
  - Test customer user (`user@shoppy.local` / `user123`)
- [ ] Migrations run cleanly via `npx prisma migrate dev`.

---

## 💡 Technical Guidance
- Store money amounts either as Float or Integer in cents (e.g. 1999 = $19.99) or Decimal to avoid floating point inaccuracies.
- Ensure unique constraint on `User.email` and compound unique on `CartItem(userId, productId)` to prevent duplicate cart rows for the same product.

---

## 🧪 Verification
```bash
cd apps/backend
npx prisma migrate dev --name init
npm run seed
npx prisma studio
```
Verify all tables and seeded records appear in Prisma Studio.
