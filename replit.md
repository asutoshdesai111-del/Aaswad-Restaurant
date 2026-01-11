# Lumière Restaurant Website

## Overview

A fine dining restaurant website built with React frontend and Express backend. The application features a menu browsing system with categories, a reservation booking system, and informational pages (About, Contact). The design uses an elegant dark theme with gold accents, featuring smooth animations and a responsive layout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side navigation with pages for Home, Menu, Reservations, About, Contact
- **State Management**: TanStack Query (React Query) for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark/gold theme using CSS variables
- **Animations**: Framer Motion for scroll reveals and transitions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Structure**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Vite middleware integration for hot module replacement

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: 
  - `categories` - Menu category groupings (name, slug, imageUrl)
  - `menuItems` - Individual dishes (name, description, price in cents, categoryId, imageUrl, isAvailable)
  - `reservations` - Booking requests (name, email, phone, date, partySize, status)
- **Migrations**: Managed via `drizzle-kit push` command

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Database schema and Zod validation schemas
- `routes.ts` - API route definitions with input/output type specifications

### Build System
- **Development**: `tsx` for running TypeScript directly
- **Production Build**: Custom build script using esbuild for server and Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client builds to `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable
- **Connection**: Uses `pg` package with connection pooling

### UI Component Libraries
- **Radix UI**: Provides accessible, unstyled component primitives (dialog, popover, select, tabs, etc.)
- **shadcn/ui**: Pre-styled component layer on top of Radix

### Key npm Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migration tooling
- `@tanstack/react-query` - Data fetching and caching
- `framer-motion` - Animation library
- `react-day-picker` / `date-fns` - Calendar and date handling
- `zod` - Schema validation
- `wouter` - Lightweight React router
- `embla-carousel-react` - Carousel component