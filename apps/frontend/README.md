# Shoppy Frontend

Modern, fast, and responsive e-commerce web application built with React, Vite, and Tailwind CSS.

---

## 🛠️ Stack
- **React 18**
- **Vite** for blazing fast builds and Hot Module Replacement (HMR)
- **Tailwind CSS** for modern utility-first styling
- **Lucide Icons** for UI iconography
- **Native Context & Interceptors** for Auth and Cart state

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌟 Key Features
- **Product Catalog:** Real-time search, category filtering, sorting by price/newest, pagination.
- **Product Detail Modal:** Image zoom, description, category badge, stock status, quantity picker.
- **Persistent User Cart:** Slide-over drawer with line items, instant quantity controls, subtotal computation.
- **Smooth Checkout:** Mock checkout flow with shipping address form, mock payment processing, and instant order creation.
- **Account & Orders:** Login and Register with handy "Demo Fill" buttons, order history tracking with status badges.
- **Admin Panel:** Store metrics dashboard, complete product CRUD management, and order status fulfillment controls.

---

## 🏗️ Build for Production
```bash
npm run build
```
Generates production assets in the `dist/` directory.
