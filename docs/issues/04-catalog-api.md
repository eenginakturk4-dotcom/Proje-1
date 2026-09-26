# Issue 04: Catalog API

**Milestone:** M2 — Core Loop  
**Skills Practiced:** REST API design, query parameters, full-text / ILIKE search, filtering, pagination, sorting.

---

## 🎯 Objective
Expose product catalog endpoints with search, category filtering, price sorting, and pagination.

---

## 📋 Acceptance Criteria
- [ ] Endpoints implemented:
  - `GET /api/categories` — Returns list of all categories with product counts.
  - `GET /api/products` — Returns paginated list of products supporting query parameters:
    - `page` (default 1) & `limit` (default 12)
    - `search` (case-insensitive search across title and description)
    - `category` (filter by category slug or ID)
    - `sort` (`price_asc`, `price_desc`, `newest`, `popular`)
  - `GET /api/products/:id` — Returns single product details including its category.
  - `GET /api/products/featured` — Returns featured products for homepage spotlight.
- [ ] Response includes metadata for pagination:
  ```json
  {
    "products": [...],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 12,
      "totalPages": 4
    }
  }
  ```

---

## 💡 Technical Guidance
- In Prisma, build dynamic `where` clauses based on incoming query params:
  ```ts
  const where: Prisma.ProductWhereInput = {};
  if (category) where.category = { slug: category };
  if (search) where.title = { contains: search, mode: 'insensitive' };
  ```
- Always clamp `limit` to prevent denial-of-service (e.g. max limit = 50).

---

## 🧪 Verification
```bash
# Test search
curl "http://localhost:4000/api/products?search=headphone"

# Test category filter & sorting
curl "http://localhost:4000/api/products?category=electronics&sort=price_asc"
```
