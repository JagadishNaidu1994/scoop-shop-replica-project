# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce web application for NASTEA (premium matcha & wellness products), built as a "Scoop Shop Replica Project" using the Lovable platform. It includes a full-featured online shop, user authentication, admin dashboard, content management (blog/journal/recipes), and PWA support.

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm preview
```

## Tech Stack

- **Frontend**: Vite + React 18 + TypeScript
- **Routing**: React Router v6
- **Backend**: Supabase (authentication, database, edge functions)
- **UI Components**: shadcn-ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API + TanStack Query
- **PWA**: vite-plugin-pwa with Workbox

## Project Architecture

### Directory Structure

- **src/pages/**: All page components (Index, Shop, ProductDetail, Checkout, AdminDashboard, etc.)
- **src/components/**: Reusable components organized by feature
  - `ui/` - shadcn-ui component library
  - `shop/` - Shop-specific components (ProductGrid, ProductCard, etc.)
  - `science/` - Science page sections
  - `admin/` - Admin dashboard components (OrdersTab, ProductsTab, etc.)
- **src/contexts/**: React Context providers for global state
  - `AuthContext` - User authentication and session management
  - `CartContext` - Shopping cart state and operations
  - `AdminEditContext` - Admin inline editing mode
  - `AdminImageContext` - Admin image upload/management
- **src/hooks/**: Custom React hooks
- **src/integrations/supabase/**: Supabase client configuration and TypeScript types
- **src/lib/**: Utility functions
- **src/data/**: Sample/seed data
- **supabase/migrations/**: Database schema migrations
- **supabase/functions/**: Supabase Edge Functions (e.g., send-wholesale-email)

### Context Providers Hierarchy

The app is wrapped in multiple context providers in this order (outer to inner):
1. QueryClientProvider (TanStack Query)
2. AuthProvider
3. CartProvider
4. AdminEditProvider
5. AdminImageProvider
6. TooltipProvider

### Routing Structure

All routes are defined in `src/App.tsx`. Main routes include:
- `/` - Home page
- `/shop` - Product catalog
- `/products/:id` - Product detail
- `/checkout` - Checkout flow
- `/account` - User account/orders
- `/admin` - Admin dashboard (requires admin privileges)
- `/recipes`, `/journal`, `/blog` - Content pages
- `/science`, `/our-story`, `/wholesale` - Marketing pages

### Authentication Flow

- Managed by `AuthContext` using Supabase Auth
- Provides `user`, `session`, `loading`, `signUp`, `signIn`, `signOut`
- Auth state persists in localStorage
- Admin access controlled by `useAdminCheck` hook checking user roles in Supabase

### Database & Supabase

- Database schema defined through Supabase migrations in `supabase/migrations/`
- TypeScript types auto-generated in `src/integrations/supabase/types.ts`
- Supabase client configured in `src/integrations/supabase/client.ts`
- Edge Functions in `supabase/functions/` (e.g., wholesale email handler)

### Admin Features

The admin dashboard (`/admin`) provides management interfaces for:
- Products
- Orders and order fulfillment
- Users and permissions
- Coupons/discounts
- Shipping settings
- Contact form submissions
- Journal/blog posts
- Recipes

Admin mode supports inline editing via `AdminEditContext` and `AdminEditableText` component.

## Important Patterns

### Component Imports

The project uses path aliases configured in `vite.config.ts`:
- `@/` maps to `src/`
- Example: `import { Button } from "@/components/ui/button"`

### Styling

- Tailwind CSS is the primary styling solution
- Components use `cn()` utility from `src/lib/utils.ts` for conditional classes
- shadcn-ui components follow their standard patterns
- Mobile-responsive design throughout

### Data Fetching

- TanStack Query for server state management
- Supabase client for database queries
- Example pattern: Use `useQuery` hooks with Supabase queries in components

### Form Handling

- React Hook Form for form state
- Zod for schema validation
- shadcn-ui Form components for consistent UI

## PWA Configuration

The app is configured as a Progressive Web App:
- Configured in `vite.config.ts` with vite-plugin-pwa
- Service worker for offline support
- Supabase API calls cached with NetworkFirst strategy
- Manifest defined for installability

## Environment Variables

Required environment variables (in `.env`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID

## Key Considerations

- This project was built with Lovable, a visual development platform
- Changes can be synced bidirectionally between local development and Lovable
- The project uses Bun lock file (`bun.lockb`) but package.json scripts use npm
- Server runs on port 8080 by default (not 5173)
- Admin permissions are role-based via Supabase
