---
name: zonacrono-dev-guide
description: Master patterns for Zonacrono: Database-driven events, root-level routing, and internal API integration.
---

# Zonacrono Development Guide

This skill provides the core architectural patterns and development standards for the Zonacrono project. Use this skill when adding new events, refactoring data fetching, or modifying route structures.

## 1. Database-Driven Events

Zonacrono uses a database-driven approach for all events. All event data is stored in Supabase.

### Core Tables
- **`events`**: Main event information (name, slug, date, description, banners).
- **`categories`**: Event categories (e.g., 10K, 5K, Cyclism).
- **`registration_stages`**: Pricing stages based on dates or capacity.
- **`managers`**: Users who manage the events.

### Adding a New Event
New events are created via the Dashboard or directly in the `events` table in Supabase.
1. Define the unique `slug`.
2. Set the `event_date` and `event_time`.
3. Configure `categories` and `registration_stages` to enable registration.

## 2. Routing Strategy

Zonacrono uses a root-level slug pattern for events: `zonacrono.com/[event]`.

- **Implementation**: Handled in `src/app/[event]/page.tsx`.
- **Precedence**: Static routes (like `/login`, `/dashboard`, `/api`) take precedence over dynamic routes.
- **Discovery**: The `[event]` segment is used to fetch the corresponding record from the `events` table via the internal API.

## 3. Data Fetching Patterns

We use an internal API layer to interface with the database, prioritizing Server Components and Streaming.

- **Server Components**: Fetch data directly in server components to benefit from SSR and SEO.
- **Streaming with Suspense**: Use `Suspense` boundaries for progressive loading of event data and results.
- **Internal API**: Use `/api/events` and `/api/events?slug=[slug]` for data retrieval.
- **eventService**: Use the centralized **`eventService`** from `@/features/events` for all event data fetching.
- **Supabase Client**: Use `supabase` for client-side interactions (leaves) and `supabaseAdmin` for protected server-side operations.

## 4. Reusable Utilities

Standardized utilities for common project tasks.

- **Date Formatting**: Use **`formatDate(dateStr)`** from `@/lib` to format event dates for the UI (returns `{ day, month, year }` in Spanish).

## 5. Language & Content

**Preferred Language**: Spanish (ES).
- **Content**: All user-facing content is generated and displayed in Spanish only. Multilingual support is NOT required.
- **Codebase**: All code, comments, and internal logic must be written in English.

## 6. SEO & OpenGraph

Dynamic SEO is critical for event discovery.
- **Meta Generation**: Always use **`generateMetadata`** in `src/app/[event]/page.tsx` to fetch event details and inject meta tags dynamically.
- **OpenGraph**: Use the dynamic `opengraph-image.tsx` and **`next/image`** for optimized social previews and banners.

---

## 7. Maintainability & Quality

### Standardized Barrel Exports (Mandatory)
- **Always** use `index.ts` files in every directory under `src/components/`, `src/features/`, `src/hooks/`, `src/lib/`, `src/store/`, and `src/types/`.
- **Component Sub-directories**: Components must be organized into:
  - `src/components/auth`: Authentication components.
  - `src/components/ui`: Core UI fundamentals (Button, Inputs, Animations).
  - `src/components/dashboard`: Admin/Superadmin dashboard elements.
  - `src/components/landing`: Landing page sections.
  - `src/components/events`: Event-specific components.
- Re-export all public components and logic.
- Standardize on clean imports: `import { Button } from '@/components/ui'`.

### Features Directory
- Organize logic into **`src/features/`** (e.g., `features/events`, `features/results`).
- Every feature folder must have an `index.ts` re-exporting its public API.

### Data Validation (Zod)
- **Mandatory validation**: All external data (API, forms, actions) must be validated with **Zod**.
- Use Zod schemas to ensure type safety from the API down to the UI.

---

## Example: Fetching Event with Service
```typescript
// Inside src/app/[event]/page.tsx (Server Component)
import { eventService } from '@/features/events';

const eventData = await eventService.getEventBySlug(params.event);

if (!eventData) {
  return notFound();
}
```

## Example: Displaying Formatted Date
```typescript
import { formatDate } from '@/lib';

const { day, month, year } = formatDate(event.event_date);
// Renders: 21 ABR 2026
```

## Example: Updating an Event (Server Action or API)
```typescript
const { data, error } = await supabase
  .from('events')
  .update({ name: 'Nuevo Nombre del Evento' })
  .eq('slug', 'bici-race');
```
