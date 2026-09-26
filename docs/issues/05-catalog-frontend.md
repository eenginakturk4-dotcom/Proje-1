# Issue 05: Catalog Frontend

**Milestone:** M2 — Core Loop  
**Skills Practiced:** Data fetching, debounce hooks, URL search params synchronization, component design, responsive grids, loading skeletons.

---

## 🎯 Objective
Build a clean, responsive product catalog UI in React with live search, category tabs/pills, sorting dropdown, pagination controls, and product detail modals.

---

## 📋 Acceptance Criteria
- [ ] Catalog page with:
  - Search bar that updates search query with debounce.
  - Category selector (All, Electronics, Clothing, Home, Books).
  - Sort dropdown ("Price: Low to High", "Price: High to Low", "Newest").
  - Responsive product grid (1 column mobile, 2 col tablet, 3-4 col desktop).
- [ ] Product Card component displaying:
  - Clean image with placeholder fallback.
  - Category badge.
  - Title and price formatted as currency (e.g. `$49.99`).
  - Stock indicator (In Stock vs. Out of Stock).
  - "Add to Cart" quick action button.
- [ ] Product Detail view (modal or page) showing full description, category, and quantity selector.
- [ ] Skeleton loaders while products are fetching and pleasant empty states when no items match search.

---

## 💡 Technical Guidance
- Sync filters and page number with browser URL query parameters (`?category=electronics&search=phone&page=1`) so that URLs are shareable and browser back/forward buttons work naturally.
- Keep UI components small and reusable (`ProductCard`, `CategoryFilter`, `Pagination`, `SearchBar`).

---

## 🧪 Verification
1. Visit `http://localhost:5173`.
2. Type in the search bar and verify results filter smoothly.
3. Switch categories and sort orders; verify the product grid updates accurately.
