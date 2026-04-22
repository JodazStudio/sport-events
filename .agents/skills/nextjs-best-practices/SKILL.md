---
name: nextjs-best-practices
description: Next.js App Router principles. Server Components, data fetching, routing patterns.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Next.js Best Practices

> Principles for Next.js App Router development.

---

## 1. Server vs Client Components

### Decision Tree

```
Does it need...?
│
├── useState, useEffect, event handlers
│   └── Client Component ('use client')
│
├── Direct data fetching, no interactivity
│   └── Server Component (default)
│
└── Both? 
    └── Split: Server parent + Client child
```

### By Default

| Type | Use |
|------|-----|
| **Server** | Data fetching, layout, static content (**Default**) |
| **Client** | Interactive UI elements (**Leaves only**: buttons, inputs, hooks) |

---

## 2. Data Fetching Patterns

### Fetch Strategy

| Pattern | Use |
|---------|-----|
| **Default** | Static (cached at build) |
| **Revalidate** | ISR (time-based refresh) |
| **No-store** | Dynamic (every request) |

### Data Flow

| Source | Pattern |
|--------|---------|
| Database | Server Component fetch |
| API | fetch with caching |
| **Feature Service** | Centralized `featureService` (e.g., `eventService`) |
| User input | Client state + server action |
| **Admin UI** | React Query Hooks (fetching + mutations) |

---

## 3. Routing Principles

### File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared layout |
| `loading.tsx` | Loading state |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |

### Route Organization

| Pattern | Use |
|---------|-----|
| Route groups `(name)` | Organize without URL |
| Parallel routes `@slot` | Multiple same-level pages |
| Intercepting `(.)` | Modal overlays |

---

## 4. API Routes

### Route Handlers

| Method | Use |
|--------|-----|
| GET | Read data |
| POST | Create data |
| PUT/PATCH | Update data |
| DELETE | Remove data |

### Best Practices

- Validate input with Zod
- Return proper status codes
- Handle errors gracefully
- Use Edge runtime when possible
- **Bulk Operations**: Implement batch endpoints for high-frequency dashboard actions to minimize latency.

---

## 5. Performance Principles

### Core Pillars

- **Streaming**: Use `Suspense` for progressive loading of slow data.
- **Image Optimization**: Always use `next/image` with proper priority/sizes.
- **Server Components**: Keep logic on the server to reduce client bundle size.

### Image Optimization

- Use next/image component
- Set priority for above-fold
- Provide blur placeholder
- Use responsive sizes

### Bundle Optimization

- Dynamic imports for heavy components
- Route-based code splitting (automatic)
- Analyze with bundle analyzer

---

## 6. Metadata

### Static vs Dynamic

| Type | Use |
|------|-----|
| Static export | Fixed metadata |
| **generateMetadata** | Dynamic per-route (Standard for events/dynamic content) |

### Essential Tags

- title (50-60 chars)
- description (150-160 chars)
- Open Graph images
- Canonical URL

---

## 7. Caching Strategy

### Cache Layers

| Layer | Control |
|-------|---------|
| Request | fetch options |
| Data | revalidate/tags |
| Full route | route config |

### Revalidation

| Method | Use |
|--------|-----|
| Time-based | `revalidate: 60` |
| On-demand | `revalidatePath/Tag` |
| No cache | `no-store` |

---

## 8. Server Actions

### Use Cases

- Form submissions
- Data mutations
- Revalidation triggers

### Best Practices

- Mark with 'use server'
- **Validate all inputs with Zod**
- **End-to-End Type Safety**: Use Server Actions to eliminate manual fetch types.
- Return typed responses
- Handle errors gracefully

---

### Maintainability

### Standardized Barrel Exports (Mandatory)
- **Always** use `index.ts` files in EVERY directory under:
  - `src/components/` (including sub-folders like `auth`, `ui`, `dashboard`, `landing`, `events`)
  - `src/features/`
  - `src/hooks/`, `src/lib/`, `src/store/`, `src/types/`
- Re-export all public components, hooks, schemas, and utilities.
- **Standardize imports** using the root alias: `import { Button } from '@/components/ui'` or `import { useAuth } from '@/hooks'`.

### Features Directory
- Organize by **features** rather than technical layers (e.g., `src/features/auth`, `src/features/events`).
- Each feature must contain an `index.ts` re-exporting its public API.

### Data Validation
- **Always validate data with Zod** (API responses, form inputs, server action arguments).
- Create shared schemas for reuse across client and server.

---

## 10. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| 'use client' everywhere | Server by default |
| Fetch in client components | Fetch in server |
| Skip loading states | Use loading.tsx |
| Ignore error boundaries | Use error.tsx |
| Large client bundles | Dynamic imports |

---

## 10. Styling & Aesthetic Principles

**CRITICAL**: All styling must follow these project-specific rules.

### Tailwind-Only
- **Utility Classes Only**: Use Tailwind utility classes for all styling.
- **No Custom CSS**: Avoid custom CSS files or inline styles unless for dynamic values.
- **Consistency**: Use predefined design tokens (colors, spacing, typography).

### Premium Aesthetics
- **Rich Design**: Implement vibrant colors, dark modes, and glassmorphism.
- **Visual Excellence**: Avoid generic colors. Use curated, harmonious palettes.
- **Animations**: Use smooth gradients and subtle micro-animations for interactions.
- **Dynamic UI**: Ensure the interface feels responsive and alive with hover effects.

---

## 11. Project Structure

src/
├── app/             # Routing and pages
├── features/        # Feature-based logic (Standard)
│   ├── events/
│   └── auth/
├── components/      # Shared UI components (Organized by domain)
│   ├── auth/        # Authentication UI
│   ├── ui/          # Core fundamentals (Button, Inputs, Animations)
│   ├── dashboard/   # Admin and Superadmin components
│   ├── landing/     # Landing page sections
│   └── events/      # Event-specific components (/:slug)
├── hooks/           # Custom React hooks (with index.ts)
├── lib/             # Shared utilities (with index.ts)
├── store/           # State management (Zustand) (with index.ts)
└── types/           # Shared global types (with index.ts)

---

> **Remember:** Server Components are the default for a reason. Start there, add client only when needed.
