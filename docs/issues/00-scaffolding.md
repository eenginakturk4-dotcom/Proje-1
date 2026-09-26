# Issue 00: Project Scaffolding & Tooling

**Milestone:** M0 — Setup  
**Skills Practiced:** Monorepo structure, tooling configuration, Docker basics, git workflow.

---

## 🎯 Objective
Establish the repository foundation so that every team member can clone, run, and develop both frontend and backend without conflicting configurations.

---

## 📋 Acceptance Criteria
- [ ] Monorepo layout created (`apps/backend`, `apps/frontend`, `docs/issues`).
- [ ] Root configuration files added (`.gitignore`, `.env.example`, `CONTRIBUTING.md`, `README.md`, `LICENSE`).
- [ ] `docker-compose.yml` provides a local PostgreSQL 16 container with a healthcheck and volume persistence.
- [ ] Both frontend and backend have their own `package.json` with scripts (`dev`, `build`, `test`).
- [ ] Root `package.json` contains helper scripts to run both apps easily.
- [ ] Clear setup instructions documented in each app's `README.md`.

---

## 💡 Technical Guidance
1. **Docker Compose:** Ensure PostgreSQL runs on port `5432` with a persistent volume named `postgres_data`.
2. **Environment Variables:** Provide sensible defaults in `.env.example` so beginners don't encounter missing key crashes.
3. **Clean Boundaries:** The frontend and backend should be separate directories with independent dependencies to simulate a microservice or multi-app architecture.

---

## 🧪 Verification
Run:
```bash
docker compose up -d
docker compose ps
```
The `shoppy-postgres` container should show as healthy on port 5432.
