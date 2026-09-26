# Issue 03: Authentication Frontend

**Milestone:** M1 — Foundations  
**Skills Practiced:** Client-side auth state, React Context, token storage, Axios/fetch interceptors, protected routes.

---

## 🎯 Objective
Create a responsive, intuitive client-side authentication flow in React with registration, login, logout, and protected route wrappers.

---

## 📋 Acceptance Criteria
- [ ] `AuthContext` provides `user`, `login`, `register`, `logout`, `isLoading`, and `isAuthenticated`.
- [ ] Token storage in localStorage / memory with automatic refresh token rotation when access token expires.
- [ ] Registration page/modal with form validation and friendly error messages.
- [ ] Login page/modal with "Quick Fill" demo buttons for easy testing (Admin & Customer).
- [ ] Navigation updates dynamically:
  - If guest: Show "Log In" and "Register" buttons.
  - If authenticated: Show user avatar/name, "My Orders", "Admin Panel" (if admin), and "Log Out".
- [ ] `ProtectedRoute` component to redirect unauthenticated users to `/login`.
- [ ] `AdminRoute` component to restrict access to admin pages.

---

## 💡 Technical Guidance
- Set up an API client helper (with Axios or fetch) that automatically injects `Authorization: Bearer <token>` into outgoing requests.
- Handle 401 Unauthorized responses by calling `/api/auth/refresh` to transparently re-authenticate before failing.

---

## 🧪 Verification
1. Open the frontend at `http://localhost:5173`.
2. Register a new user and confirm immediate login state.
3. Refresh the page — session should persist.
4. Log out — session should clear immediately.
