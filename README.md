# Zonacrono - High Performance Events SaaS

A high-performance SaaS platform built with **Next.js 16**, **Tailwind CSS 4**, and **Supabase**, designed for sports event organizers to manage registrations, results, and branding from a single dashboard.

## 🚀 Architecture Overview

Zonacrono has evolved from a static-tenant model to a fully dynamic, database-driven platform.

### 1. Dynamic Multitenancy
- **Event Slugs:** Each event has a unique URL slug (`domain.com/[event-slug]`).
- **Database Driven:** Event data, categories, stages, and registrations are stored in PostgreSQL (Supabase).
- **Branding:** Visual identity (colors, logos, banners) is configured per-event via the admin dashboard.

### 2. Tech Stack
- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4, React Query.
- **Backend:** Next.js Route Handlers (Server-side validation with Zod).
- **Auth & Database:** Supabase (Auth, PostgreSQL, Storage).
- **Integrations:** Telegram Bot API for real-time registration alerts.

### 3. Role-Based Access Control (RBAC)
- **Superadmin:** Global system management, manager CRUD, and platform-wide metrics.
- **Admin (Manager):** Event-specific management, registration tracking, and configuration.

## 📁 Project Structure

```text
zonacrono/
├── src/
│   ├── app/
│   │   ├── [event]/            # Dynamic Public Event Landing Pages
│   │   ├── api/                # Secure Route Handlers
│   │   ├── dashboard/          # RBAC Admin Panels
│   │   └── login/              # Authentication Flow
│   ├── components/
│   │   ├── ui/                 # Neobrutalist Component Library
│   │   └── dashboard/          # Admin-specific Views
│   ├── hooks/                  # React Query Custom Hooks
│   ├── lib/                    # Core Utilities & Shared Logic
│   └── store/                  # Global State (Zustand)
├── db/                         # SQL Migrations & Schema Docs
└── public/                     # Static Assets
```

## 🛠️ Local Development

### 1. Setup Environment
Copy the example environment file and fill in your Supabase and Telegram credentials:
```bash
cp .env.example .env.local
```

### 2. Install Dependencies
Always use **pnpm** as the package manager:
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```

## ✨ Core Features

- **Full CRUD for Events:** Manage categories, registration stages, and payment details.
- **Athlete Registration:** Validated registration flow with automated category assignment.
- **Real-time Notifications:** Instant Telegram alerts for new event registrations.
- **Management Panel:** Complete suite for managers to track payments and participant stats.
- **Neobrutalist UI:** Modern, high-contrast design system optimized for readability and performance.

---
Built with ⚡ by Antigravity for Jesus Ordosgoitty.
