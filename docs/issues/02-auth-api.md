# Issue 02: Authentication API

**Milestone:** M1 — Foundations  
**Skills Practiced:** JWT authentication, refresh token rotation, bcrypt password hashing, auth middleware.

---

## 🎯 Objective
Build a robust REST authentication system in Express using JSON Web Tokens (access + refresh tokens) and bcrypt for password security.

---

## 📋 Acceptance Criteria
- [ ] Endpoints implemented under `/api/auth`:
  - `POST /api/auth/register` — Validates email/password, hashes password with `bcrypt`, creates user, issues tokens.
  - `POST /api/auth/login` — Verifies credentials, generates access token (short-lived, e.g., 15m) and refresh token (long-lived, e.g., 7d).
  - `POST /api/auth/refresh` — Verifies refresh token, validates against DB, rotates token, issues new pair.
  - `POST /api/auth/logout` — Revokes the supplied refresh token.
  - `GET /api/auth/me` — Protected endpoint returning the authenticated user's profile.
- [ ] Middleware:
  - `requireAuth`: validates Bearer access token and attaches `req.user`.
  - `requireAdmin`: enforces `role === 'ADMIN'`.
- [ ] Error handling: Returns appropriate HTTP status codes (400, 401, 403, 409).

---

## 💡 Technical Guidance
- Never store plaintext passwords in the database. Use `bcrypt.hash(password, 10)`.
- Use separate secrets for access tokens (`JWT_ACCESS_SECRET`) and refresh tokens (`JWT_REFRESH_SECRET`).
- Always strip `passwordHash` before sending user objects back to clients.

---

## 🧪 Verification
Send curl or Postman requests:
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'

# Me (Protected)
curl http://localhost:4000/api/auth/me -H "Authorization: Bearer <access_token>"
```
