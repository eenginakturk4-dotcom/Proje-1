# Issue 06: Cart & Checkout

**Milestone:** M3 — Transactions  
**Skills Practiced:** Stateful business flows, cart persistence in DB, optimistic UI updates, checkout workflow, mock payment processing.

---

## 🎯 Objective
Implement persistent user cart management and an intuitive checkout flow with mock payment processing (and Stripe stretch readiness).

---

## 📋 Acceptance Criteria
- [ ] Backend Cart Endpoints:
  - `GET /api/cart` — Retrieves current user's cart items with product details and subtotal.
  - `POST /api/cart` — Adds item (or increments quantity if already in cart).
  - `PUT /api/cart/:id` — Updates quantity (or removes if quantity <= 0).
  - `DELETE /api/cart/:id` — Removes an item.
  - `DELETE /api/cart` — Clears entire cart.
- [ ] Checkout API:
  - `POST /api/checkout/mock` — Accepts shipping address and payment method, verifies cart is not empty, creates an `Order` and `OrderItems` in a database transaction, clears the user's cart, and returns the confirmed order.
- [ ] Frontend Cart Experience:
  - Slide-over Cart drawer / Cart page showing item thumbnails, quantities, line totals, and order subtotal.
  - Increment / decrement buttons with immediate responsive feedback.
  - Header badge displaying real-time total item count.
- [ ] Frontend Checkout Experience:
  - Shipping address form (Full Name, Street Address, City, Postal Code, Country).
  - Payment selection (Mock Instant Checkout for v1 with "Pay Now" simulation; Stripe test mode option).
  - Order success confirmation screen with order reference number and button to "View Order History".

---

## 💡 Technical Guidance
- **Database Transaction:** In Express, wrap order creation and cart clearing in `prisma.$transaction([...])` to guarantee that orders are never duplicated or carts cleared without an order being created.
- Always recalculate total prices on the backend from database product records, never trust the price sent from the client!

---

## 🧪 Verification
1. Add 2 products to cart.
2. Adjust quantity and refresh page — cart state remains intact.
3. Click Checkout, enter shipping details, and complete mock payment.
4. Verify cart empties and order confirmation appears with order ID.
