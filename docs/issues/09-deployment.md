# Issue 09: Production Containerization & Deployment

**Milestone:** M5 — Ship it  
**Skills Practiced:** Multi-stage Dockerfiles, Nginx production serving, environment configuration, cloud hosting (Render / Railway / Fly.io).

---

## 🎯 Objective
Create production-grade Docker containers for both backend and frontend, and document straightforward deployment paths to free/hobby cloud platforms.

---

## 📋 Acceptance Criteria
- [ ] Backend Dockerfile (`apps/backend/Dockerfile`):
  - Multi-stage build (build stage + minimal node-alpine runtime stage).
  - Runs Prisma client generation.
  - Exposes port 4000.
- [ ] Frontend Dockerfile (`apps/frontend/Dockerfile`):
  - Multi-stage build (Vite build + Nginx alpine static server).
  - Includes custom `nginx.conf` with Single Page Application (SPA) routing support (`try_files $uri /index.html`).
  - Exposes port 80.
- [ ] Docker Compose production configuration / guide:
  - Explains how to bundle frontend + backend + PostgreSQL into a unified stack.
- [ ] Deployment guide for Render / Railway / Fly.io documented in `README.md`.

---

## 💡 Technical Guidance
- Never embed secrets or `.env` files into Docker images. Use container environment variables injected at runtime.
- For Vite SPA in Nginx, make sure all requests fall back to `/index.html` so client-side routing works on hard refreshes.

---

## 🧪 Verification
```bash
# Build backend image
docker build -t shoppy-backend ./apps/backend

# Build frontend image
docker build -t shoppy-frontend ./apps/frontend
```
Both images should build successfully with minimal footprint.
