# Contributing to Shoppy

Welcome to the **Shoppy** project! This repository is designed as a collaborative, learning-focused e-commerce application. We emphasize clean code, incremental pull requests, and peer learning.

---

## 🧭 Workflow Overview

We follow a strict **One Issue → One Branch → One PR** workflow:

1. **Pick an issue** from `docs/issues/` (or your team's GitHub Project board).
2. **Pair up**: Pair the person newer to the topic with someone more confident. Work on the issue together.
3. **Create a branch** matching our branch naming conventions.
4. **Implement changes** and write corresponding tests.
5. **Open a Pull Request** linking back to the issue (`Fixes #<number>`).
6. **Code Review**: At least one teammate reviews and tests the PR locally.
7. **Merge**: Merge once approved and CI passes!

---

## 🌿 Branch Naming Conventions

Always prefix branch names with the issue type and number:

- `feat/01-database-schema`
- `feat/02-auth-api`
- `fix/cart-quantity-calculation`
- `test/auth-integration`
- `docs/setup-troubleshooting`
- `refactor/catalog-filter-query`

---

## 💬 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

Format:
```text
<type>(<scope>): <short description>

[optional body]
[optional footer(s)]
```

### Types:
- `feat`: A new feature (e.g., `feat(auth): implement refresh token rotation`)
- `fix`: A bug fix (e.g., `fix(cart): prevent negative item quantity`)
- `docs`: Documentation changes only (e.g., `docs: update backend setup instructions`)
- `test`: Adding or correcting tests (e.g., `test(catalog): add pagination unit tests`)
- `refactor`: Code change that neither fixes a bug nor adds a feature (e.g., `refactor(db): extract prisma client singleton`)
- `chore`: Maintenance tasks, config changes, package updates

---

## 📋 Pull Request Checklist

Before asking for review, verify:

- [ ] Branch is branched off up-to-date `main`.
- [ ] Code follows existing project style and patterns.
- [ ] Added or updated automated tests.
- [ ] Tested locally end-to-end (both frontend and backend).
- [ ] Environment variables documented in `.env.example`.
- [ ] PR description clearly explains *what* changed and *how to test* it.
- [ ] GitHub issue is linked (e.g., `Closes #4`).

---

## 🧪 Running Tests Locally

```bash
# In backend
cd apps/backend
npm test

# In frontend
cd apps/frontend
npm test
```

Happy coding! Remember: the primary goal is learning together and building confidence across the entire web stack.
