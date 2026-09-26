# Issue 07: Orders & Admin Panel

**Milestone:** M4 — Polish  
**Skills Practiced:** Role-Based Access Control (RBAC), CRUD operations, administrative analytics, status lifecycle.

---

## 🎯 Objective
Build customer order history and a clean, responsive Admin Panel for product management and order fulfillment.

---

## 📋 Acceptance Criteria
- [ ] Customer Order History:
  - `GET /api/orders` — Returns list of orders placed by the authenticated user with order items.
  - `GET /api/orders/:id` — Returns single order with shipping info and status timeline.
  - Frontend Orders page displaying past purchases, status badges (Paid, Shipped, Delivered), item previews, and dates.
- [ ] Admin API (`/api/admin/*` guarded by `requireAdmin`):
  - `GET /api/admin/stats` — Dashboard metrics (total sales revenue, count of orders, products, and registered users).
  - `GET /api/admin/products` — Full product list for management.
  - `POST /api/admin/products` — Add a new product (title, description, price, categoryId, imageUrl, stock).
  - `PUT /api/admin/products/:id` — Update existing product.
  - `DELETE /api/admin/products/:id` — Delete product.
  - `GET /api/admin/orders` — All orders placed across the store.
  - `PATCH /api/admin/orders/:id/status` — Update order status (`PENDING` -> `PAID` -> `SHIPPED` -> `DELIVERED` -> `CANCELLED`).
- [ ] Admin Frontend:
  - Accessible only to users with role `ADMIN`.
  - Overview cards: Total Revenue, Total Orders, Total Products, Total Users.
  - Product Catalog table with "Add Product" modal, "Edit Product" modal, and delete action.
  - Orders table with customer email, date, amount, and interactive status selector.

---

## 💡 Technical Guidance
- Implement a reusable middleware `requireAdmin` that checks `req.user?.role === 'ADMIN'`.
- Provide sensible fallbacks if images fail to load or products are assigned to deleted categories.

---

## 🧪 Verification
1. Log in as `admin@shoppy.local` (password: `admin123`).
2. Navigate to Admin Panel.
3. Add a new product: "Wireless Mouse", $29.99, Stock: 50.
4. Verify it immediately appears in the customer store.
5. Change an order status from `PAID` to `SHIPPED` and confirm status update.
