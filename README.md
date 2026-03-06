# Events SaaS Platform

A high-performance, multitenant SaaS platform built with Next.js 15+ and Tailwind CSS 4+, designed for sports event organizers to quickly deploy branded landing pages.

## 🚀 Architecture Overview

The platform uses a **Subdomain-based Multitenancy** approach without a database (initially), relying on local JSON configuration files for tenant data.

### 1. Multitenancy Strategy (Middleware Rewrite)
- **Logic:** `src/middleware.ts` intercepts incoming requests.
- **Root Domain:** Requests to `pricedineth.xyz` (or `localhost:3000`) serve the main SaaS landing page.
- **Subdomains:** Requests to `tenant.pricedineth.xyz` are internally rewritten to `/sites/tenant`.
- **Result:** Tenants get a clean, branded URL without a generic loading state or client-side redirects.

### 2. Data Strategy (No-DB Prototype)
- **Tenant Data:** Stored in `src/data/tenants/[tenantId].json`.
- **Minimal Brand Swap:** Each JSON defines:
  - `name`, `title`, `description`
  - `heroImage`, `logo`, `primaryColor`
  - `registrationLink` (External redirect to WhatsApp, Eventbrite, etc.)
  - `eventDate`, `location`

### 3. Routing & Pages
- `src/app/page.tsx`: The main SaaS homepage (Platform marketing).
- `src/app/sites/[tenant]/page.tsx`: The **Master Template** that dynamically renders a tenant's landing page based on their JSON config.

## 📁 Project Structure

```text
events-saas/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Main SaaS Landing Page
│   │   └── sites/
│   │       └── [tenant]/
│   │           └── page.tsx    # Master Tenant Template
│   ├── data/
│   │   └── tenants/
│   │       └── santarosa.json  # Sample Tenant Config
│   └── middleware.ts           # Subdomain Routing Logic
├── public/
│   └── tenants/
│       └── santarosa/          # Static assets for the demo
└── tailwind.config.ts          # Modern styling with CSS variables
```

## 🛠️ How to Add a New Tenant

1. Create a new JSON file in `src/data/tenants/[tenant-id].json`.
2. Add the tenant's assets (logo, hero) to `public/tenants/[tenant-id]/`.
3. The site is instantly live at `[tenant-id].pricedineth.xyz`.

## 🛡️ Decisions & Rationale

- **Next.js Middleware:** Chosen for SEO-friendly, server-side multitenancy.
- **JSON Files over DB:** Provides zero-latency data fetching and simplifies the initial prototype.
- **External Registration:** Avoids the complexity of payments/auth in the MVP while providing immediate value to organizers.
- **Minimal Brand Swap:** Balances speed of onboarding with effective visual identity.

---
Built by Gemini CLI for Jesus Ordosgoitty.
