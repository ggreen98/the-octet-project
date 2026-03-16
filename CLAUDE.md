# The Octet Project — Claude Instructions

## Project Overview
A chemistry education web app (and future mobile app) featuring interactive 3D molecule visualization. Built to be clean, accessible, and scalable.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **3D Molecules:** React Three Fiber + @react-three/drei
- **Auth + Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Error Logging:** Sentry
- **Analytics:** Vercel Analytics
- **Package Manager:** Bun
- **Deployment:** Vercel
- **Mobile (future):** Expo + React Native

## Conventions

### General
- Always use TypeScript. No `any` types — use proper types or `unknown`.
- Use the Next.js App Router (`app/` directory). Never use the Pages Router.
- Prefer server components by default. Only use `"use client"` when necessary (interactivity, hooks, browser APIs).
- All environment variables go in `.env.local` (never committed). Document required vars in `.env.example`.

### File Structure
```
app/               # Next.js App Router pages and layouts
components/        # Shared UI components
  ui/              # shadcn/ui primitives
  molecules/       # 3D molecule viewer components
  chemistry/       # Chemistry-specific UI (lessons, quizzes, etc.)
lib/               # Utilities, helpers, Supabase client, Prisma client
hooks/             # Custom React hooks
types/             # Shared TypeScript types
prisma/            # Prisma schema and migrations
public/            # Static assets
```

### Styling
- Use Tailwind utility classes. Avoid inline styles.
- Use shadcn/ui components as the base for UI elements.
- Follow mobile-first responsive design.

### Database
- All schema changes go through Prisma migrations (`bun prisma migrate dev`).
- Never mutate the database directly — always use Prisma.
- Use Supabase Row Level Security (RLS) for all user data tables.

### Auth
- Auth is handled by Supabase Auth.
- Protect routes using Next.js middleware (`middleware.ts`).

### 3D Molecules
- Use React Three Fiber (`@react-three/fiber`) and Drei (`@react-three/drei`) for all 3D rendering.
- Molecule components live in `components/molecules/`.
- Keep 3D components lazy-loaded to avoid SSR issues (`dynamic(() => import(...), { ssr: false })`).

### Error Handling & Logging
- Use Sentry for error tracking. Wrap the app in the Sentry provider.
- Log meaningful errors — avoid empty catch blocks.

## Commands
```bash
bun dev           # Start dev server
bun build         # Production build
bun lint          # Run ESLint
bun prisma studio # Open Prisma Studio
bun prisma migrate dev # Run DB migrations
```
