# Zonacrono - Events SaaS Platform

A high-performance, multitenant SaaS platform built with **Next.js 16** and **Tailwind CSS 4**, designed for sports event organizers to quickly deploy branded landing pages and results dashboards.

## 🚀 Architecture Overview

The platform uses a **Subpath-based Multitenancy** approach. Each event is served under its own URL slug, dynamically loading data from local configuration files.

### 1. Multitenancy Strategy (Dynamic Routes)
- **Root Domain:** Requests to the base URL serve the main Zonacrono landing page.
- **Event Slugs:** Requests to `domain.com/[event-slug]` are handled by dynamic routes in `src/app/[event]/page.tsx`.
- **Data Loading:** The application reads event configuration from `src/data/tenants/[event-slug].json` on the server.

### 2. Data Strategy (No-DB Architecture)
- **Event Data:** Stored in `src/data/tenants/[eventId].json`.
- **Dynamic Branding:** Each JSON defines:
  - Event metadata (title, year, description).
  - Visual identity (primary/secondary colors, logo, hero images).
  - Event details (route, categories, awards, kit information).
  - External registration links.

### 3. Routing & Pages
- `src/app/page.tsx`: Main marketing landing page.
- `src/app/[event]/page.tsx`: Master template for event landing pages.
- `src/app/dashboard/page.tsx`: Real-time results dashboard with live RFID telemetry simulation.

## 📁 Project Structure

```text
zonacrono/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Main SaaS Landing Page
│   │   ├── [event]/            # Dynamic Event Pages
│   │   └── dashboard/          # Results Dashboard
│   ├── components/
│   │   └── zonacrono/          # Shared components (Design System)
│   ├── data/
│   │   └── tenants/            # Event JSON configurations
│   │       ├── santarosa10k.json
│   │       └── bici-race.json
│   └── lib/                    # Utilities and mock generators
├── public/                     # Static assets per event
└── next.config.ts              # Next.js configuration (Remote images authorized)
```

## 🛠️ How to Add a New Event

1. Create a new JSON file in `src/data/tenants/[event-slug].json` following the `TenantData` type.
2. Add any specific local assets to `public/tenants/[event-slug]/`.
3. The event page is instantly accessible at `yourdomain.com/[event-slug]`.
4. Update the `events` list in `src/components/zonacrono/EventsSection.tsx` to display it on the main landing page.

## ✨ Current Features

- **Mechanical Aesthetic:** Industrial-inspired UI with high-contrast colors and grid patterns.
- **Live Leaderboard:** Simulated real-time tracking of athletes.
- **Responsive Design:** Optimized for mobile viewing during events.
- **Remote Content:** Integrated with Unsplash for high-quality event placeholders.

---
Built with ⚡ by Antigravity for Jesus Ordosgoitty.
