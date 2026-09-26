# Issue 08: Testing & CI Pipeline

**Milestone:** M4 — Polish  
**Skills Practiced:** Automated testing (Unit & Integration), Supertest / Vitest, GitHub Actions continuous integration.

---

## 🎯 Objective
Set up automated test suites for critical backend endpoints and configure a GitHub Actions CI workflow to run linting and tests on every Pull Request.

---

## 📋 Acceptance Criteria
- [ ] Backend tests covering:
  - Auth registration, duplicate email rejection, and password verification.
  - JWT token generation and validation middleware.
  - Product catalog listing and category filtering.
  - Cart addition and order calculation.
- [ ] Frontend test / lint verification:
  - Vite build check passes without errors.
  - TypeScript compilation passes without errors.
- [ ] GitHub Actions workflow (`.github/workflows/ci.yml`):
  - Triggers on push to `main` and on pull requests.
  - Sets up Node.js 20.
  - Installs dependencies in `apps/backend` and `apps/frontend`.
  - Runs lint and tests.
  - Verifies production builds.

---

## 💡 Technical Guidance
- Use Vitest or Jest with Supertest for backend integration tests.
- Mock external network calls so tests run fast (<15s) and reliably without depending on external services.

---

## 🧪 Verification
```bash
# In backend
cd apps/backend
npm test

# In frontend
cd apps/frontend
npm run build
```
Verify all checks exit with code 0.
