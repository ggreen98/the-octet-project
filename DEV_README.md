# The Octet Project — Developer Reference

This document explains every folder, file, and dependency in the project so any developer (or future you) can understand the codebase from scratch.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Root Config Files](#root-config-files)
- [app/ — Pages & Layouts](#app--pages--layouts)
- [components/ — UI Building Blocks](#components--ui-building-blocks)
- [lib/ — Shared Utilities & Clients](#lib--shared-utilities--clients)
- [hooks/ — Custom React Hooks](#hooks--custom-react-hooks)
- [types/ — TypeScript Types](#types--typescript-types)
- [prisma/ — Database Schema](#prisma--database-schema)
- [public/ — Static Assets](#public--static-assets)
- [Dependencies Explained](#dependencies-explained)

---

## Project Structure

```
the-octet-project/
├── app/                    # All pages and layouts (Next.js App Router)
├── components/
│   ├── ui/                 # shadcn/ui base components (buttons, inputs, etc.)
│   ├── molecules/          # 3D molecule viewer components
│   └── chemistry/          # Chemistry-specific UI (lessons, quizzes, etc.)
├── lib/
│   ├── supabase/           # Supabase client instances
│   └── prisma.ts           # Prisma database client singleton
├── hooks/                  # Custom React hooks
├── types/                  # Shared TypeScript type definitions
├── prisma/
│   └── schema.prisma       # Database schema (tables and relationships)
├── public/                 # Static files served at the root URL
├── .env.local              # Your local secrets (never committed)
├── .env.example            # Template showing required env vars
├── CLAUDE.md               # Instructions for Claude AI when working on this project
├── DEV_README.md           # This file
├── README.md               # Public-facing project overview
├── next.config.ts          # Next.js configuration
├── prisma.config.ts        # Prisma 7 database connection config
├── proxy.ts                # Auth middleware (protects routes)
├── sentry.client.config.ts # Sentry error tracking — browser
├── sentry.server.config.ts # Sentry error tracking — server
├── sentry.edge.config.ts   # Sentry error tracking — edge runtime
├── tsconfig.json           # TypeScript compiler settings
├── eslint.config.mjs       # Linting rules
├── postcss.config.mjs      # PostCSS config (used by Tailwind)
├── components.json         # shadcn/ui configuration
└── package.json            # Dependencies and scripts
```

---

## Root Config Files

### `next.config.ts`
Next.js configuration. Currently configures:
- `transpilePackages: ["three"]` — tells Next.js to process the Three.js package through its build pipeline (needed for compatibility)
- `withSentryConfig(...)` — wraps the config with Sentry's Next.js plugin for automatic error tracking and source map uploading

### `prisma.config.ts`
Prisma 7 introduced this file to hold the database connection URL (previously it lived in `schema.prisma`). Points to `DATABASE_URL` from your environment variables. This is what Prisma CLI commands (like `prisma migrate`) use to connect to the database.

### `proxy.ts`
Runs on every request before it reaches a page (Next.js Edge Middleware, now called "proxy" in Next.js 16). Does two things:
1. Refreshes the Supabase auth session so it doesn't expire
2. Redirects unauthenticated users away from `/dashboard/*` routes to `/login`

### `sentry.client.config.ts`
Initializes Sentry error tracking in the **browser**. Captures JavaScript errors, performance data, and session replays on error.

### `sentry.server.config.ts`
Initializes Sentry on the **Node.js server** (API routes, server components). Captures server-side errors and slow requests.

### `sentry.edge.config.ts`
Initializes Sentry for the **Edge runtime** (the proxy/middleware layer). Edge functions run closer to the user and have a limited Node.js API.

### `tsconfig.json`
TypeScript compiler configuration. Key settings:
- `strict: true` — enables all strict type checks (no silent `any` types slipping through)
- `paths: { "@/*": ["./*"] }` — allows importing with `@/components/...` instead of `../../components/...`

### `eslint.config.mjs`
Linting rules. Uses `eslint-config-next` which includes React, accessibility, and Next.js-specific rules out of the box.

### `postcss.config.mjs`
Tells PostCSS to use the `@tailwindcss/postcss` plugin. PostCSS processes your CSS files — Tailwind hooks in here to generate utility classes.

### `components.json`
shadcn/ui configuration file. Tells the shadcn CLI where to put new components, which style and color theme to use, and where the `utils.ts` file lives. You'll rarely edit this manually.

### `.env.example`
A template listing every environment variable the app needs. Contains no real secrets — just the variable names and a blank value. Anyone cloning the repo copies this to `.env.local` and fills in their own keys.

### `.env.local`
Your actual secrets. Never committed to Git. Contains your real Supabase URL, database password, Sentry DSN, etc.

### `CLAUDE.md`
Instructions for Claude AI (this project's AI coding assistant). Describes the stack, conventions, file structure, and commands. Claude reads this at the start of every session.

---

## `app/` — Pages & Layouts

This is the **Next.js App Router** directory. Every folder inside `app/` that contains a `page.tsx` becomes a URL route.

### How it works
- `page.tsx` — the UI for that route
- `layout.tsx` — a wrapper that stays mounted across route changes (good for nav, footers)
- `loading.tsx` — shown while the page fetches data
- `error.tsx` — shown when something crashes

### Current files

| File | Purpose |
|---|---|
| `app/layout.tsx` | Root layout — wraps every page. Loads fonts, sets `<html>` and `<body>`, good place to add the Sentry provider and Vercel Analytics. |
| `app/page.tsx` | The home page (`/`). Currently the Next.js default — will become the landing page. |
| `app/globals.css` | Global CSS. Tailwind's base styles and CSS custom properties (colors, fonts) live here. |
| `app/favicon.ico` | The browser tab icon. |

### Future routes to add
```
app/
├── (marketing)/        # Route group for public pages (no auth required)
│   ├── page.tsx        # Landing page (/)
│   └── about/page.tsx
├── (app)/              # Route group for authenticated pages
│   └── dashboard/
│       └── page.tsx    # User dashboard (/dashboard)
├── lessons/
│   └── [slug]/         # Dynamic route — /lessons/atomic-structure, etc.
│       └── page.tsx
└── auth/
    ├── login/page.tsx
    └── signup/page.tsx
```

> **Route groups** like `(marketing)` are folders with parentheses — they group routes logically without affecting the URL.

---

## `components/` — UI Building Blocks

Components are reusable pieces of UI. The folder is split by purpose:

### `components/ui/`
Base UI primitives generated by **shadcn/ui**. These are copied directly into your project (not imported from a package), so you own and can customize them.

| File | What it is |
|---|---|
| `button.tsx` | The base Button component with variants (default, outline, ghost, destructive, etc.) and sizes. Every button in the app should use this. |

More shadcn components get added here as needed: `input.tsx`, `card.tsx`, `dialog.tsx`, `badge.tsx`, etc.

### `components/molecules/`
**3D molecule viewer components.** Everything in here must be a Client Component (`"use client"`) and lazy-loaded with `ssr: false` since WebGL only runs in the browser.

Example structure (to be built):
```
molecules/
├── MoleculeViewer.tsx    # Main 3D canvas wrapper
├── Atom.tsx              # Renders a single atom sphere
├── Bond.tsx              # Renders a bond between atoms
└── molecules/            # Pre-built molecule data (H2O, CO2, etc.)
    └── water.ts
```

### `components/chemistry/`
Chemistry-specific UI that is **not** 3D — lesson cards, periodic table elements, quiz questions, progress indicators, etc. These can be server or client components depending on whether they need interactivity.

---

## `lib/` — Shared Utilities & Clients

Reusable functions and service clients used across the app.

### `lib/supabase/client.ts`
Creates a Supabase client for use in **Client Components** (browser). Uses `createBrowserClient` from `@supabase/ssr`. Call `createClient()` inside a client component whenever you need to interact with Supabase (read data, auth state, etc.).

### `lib/supabase/server.ts`
Creates a Supabase client for use in **Server Components and Route Handlers**. Uses `createServerClient` which reads/writes auth cookies via Next.js's `cookies()` API. Always `await createClient()` since cookies() is async in Next.js 15+.

### `lib/prisma.ts`
Creates and exports a single **Prisma Client** instance. Uses a global variable trick to avoid creating a new database connection on every hot-reload in development (a common gotcha). Import `prisma` from here anywhere you need to query the database.

### `lib/utils.ts`
Generated by shadcn/ui. Contains the `cn()` helper function which merges Tailwind class names intelligently — it combines `clsx` (conditional classes) and `tailwind-merge` (deduplicates conflicting Tailwind classes).

```ts
// Example
cn("px-4 py-2", isActive && "bg-blue-500", "px-6")
// → "py-2 bg-blue-500 px-6"  (px-4 is overridden by px-6)
```

---

## `hooks/` — Custom React Hooks

Empty for now. Will hold reusable React hooks as the app grows. Examples of what will go here:

| Hook | Purpose |
|---|---|
| `useUser.ts` | Returns the current authenticated user from Supabase |
| `useLessonProgress.ts` | Tracks which lessons a user has completed |
| `useMolecule.ts` | Loads and parses molecule data for the 3D viewer |

---

## `types/` — TypeScript Types

Empty for now. Shared TypeScript interfaces and types that are used across multiple files. Keeps types DRY and in one place.

Examples of what will go here:
```ts
// types/chemistry.ts
export interface Atom {
  element: string;
  position: [number, number, number];
  charge?: number;
}

export interface Molecule {
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
}
```

---

## `prisma/` — Database Schema

### `prisma/schema.prisma`
Defines the **database tables** (called "models" in Prisma). This is the single source of truth for your database structure. When you change this file, you run `bunx prisma migrate dev` to apply the changes to your actual database.

**Current models:**

**`User`** — Stores app-level user data.
- `id` — Internal UUID primary key
- `authId` — The UUID from Supabase Auth (links the two systems)
- `email`, `name` — Basic profile info
- `progress` — Relation to their lesson progress

**`Lesson`** — A chemistry lesson.
- `slug` — URL-safe identifier (e.g., `atomic-structure`) used in routes like `/lessons/atomic-structure`
- `title`, `description` — Display info
- `order` — Controls the order lessons appear in

**`LessonProgress`** — Join table tracking which user completed which lesson.
- Links a `User` to a `Lesson`
- `completed` + `completedAt` — Tracks completion state and time
- Unique constraint on `[userId, lessonId]` so a user can only have one progress record per lesson

---

## `public/` — Static Assets

Files in `public/` are served at the root URL. For example, `public/logo.png` is accessible at `https://yourdomain.com/logo.png`.

Currently contains placeholder SVGs from the Next.js default template. These will be replaced with project assets.

---

## Dependencies Explained

### Core Framework

| Package | What it does |
|---|---|
| `next` | The React framework. Handles routing, server components, API routes, image optimization, and the build system. Version 16 uses Turbopack (a fast Rust-based bundler) by default. |
| `react` + `react-dom` | The UI library everything is built on. React handles component rendering; react-dom connects it to the browser DOM. |
| `typescript` | Adds static types to JavaScript. Catches bugs before runtime and powers IDE autocomplete. |

### Styling

| Package | What it does |
|---|---|
| `tailwindcss` | Utility-first CSS framework. Instead of writing `.button { padding: 8px }` you write `className="p-2"`. Version 4 is significantly faster and uses a new CSS-native approach. |
| `@tailwindcss/postcss` | PostCSS plugin that processes Tailwind v4 during the build. |
| `tw-animate-css` | Adds animation utility classes for Tailwind (fade-in, slide-up, etc.). Used by shadcn/ui for component transitions. |
| `tailwind-merge` | Intelligently merges Tailwind classes, removing duplicates/conflicts. Used in the `cn()` helper. |
| `class-variance-authority` | Creates component variants with type safety (e.g., a button can be `variant="outline"` or `variant="destructive"`). Used heavily by shadcn/ui. |
| `clsx` | Tiny utility for conditionally applying CSS classes: `clsx("base", isActive && "active")`. |
| `lucide-react` | Icon library with 1000+ clean SVG icons as React components. Used by shadcn/ui and throughout the UI. |

### shadcn/ui

| Package | What it does |
|---|---|
| `shadcn` | CLI tool for adding pre-built, customizable UI components to your project. Run `bunx shadcn add card` to add a Card component, etc. Components are copied into `components/ui/` so you fully own them. |
| `@base-ui/react` | Unstyled, accessible UI primitives that some shadcn components are built on (dropdowns, dialogs, etc.). |

### 3D Rendering

| Package | What it does |
|---|---|
| `three` | The core 3D library. Manages the WebGL scene, camera, lights, geometry, and materials. Does not know about React — it's pure JavaScript. |
| `@react-three/fiber` | React renderer for Three.js. Lets you write 3D scenes as JSX (`<mesh>`, `<ambientLight>`, etc.) and integrates with React's component model and hooks. |
| `@react-three/drei` | A collection of useful helpers built on top of React Three Fiber. Provides things like `<OrbitControls>` (mouse rotation), `<Html>` (overlay UI in 3D space), `<Text>`, environment presets, and much more. Saves a huge amount of boilerplate. |
| `@types/three` | TypeScript type definitions for Three.js. |

### Auth & Database

| Package | What it does |
|---|---|
| `@supabase/supabase-js` | The main Supabase JavaScript client. Handles auth (sign up, login, sessions) and direct database queries via Supabase's REST API. |
| `@supabase/ssr` | Supabase helpers specifically for server-side rendering frameworks like Next.js. Handles reading/writing auth cookies correctly in server components and middleware. |
| `@prisma/client` | The generated Prisma database client. Gives you a fully type-safe API for querying your database: `prisma.user.findMany()`, `prisma.lesson.create(...)`, etc. |
| `prisma` *(devDep)* | The Prisma CLI. Used for `prisma migrate dev` (apply schema changes), `prisma generate` (regenerate the client after schema changes), and `prisma studio` (visual DB browser). |
| `dotenv` | Loads `.env` files into `process.env`. Used by `prisma.config.ts` so Prisma CLI commands can read your database URL. |

### Monitoring

| Package | What it does |
|---|---|
| `@sentry/nextjs` | Sentry error tracking integrated with Next.js. Automatically captures unhandled errors, slow page loads, and failed API calls. Reports them to your Sentry dashboard with full stack traces. Has three entry points: client, server, and edge. |
| `@vercel/analytics` | Vercel's built-in analytics. Tracks page views and web vitals (load speed, layout shift, etc.) with no cookies and no GDPR headaches. Add `<Analytics />` to the root layout to enable it. |

### Build Tools

| Package | What it does |
|---|---|
| `lightningcss` | An extremely fast CSS parser/transformer written in Rust. Used internally by Tailwind v4 and Turbopack to process CSS. |
| `lightningcss-darwin-x64` | The macOS x64 native binary for lightningcss. Needed because the Next.js build process (Turbopack) runs through the x64 version of Node.js on this machine. |
| `eslint` + `eslint-config-next` | Linting tools. ESLint finds code problems (unused variables, accessibility issues, React hook violations). `eslint-config-next` is Next.js's curated ruleset. |

---

## Key Commands

```bash
bun dev                      # Start the development server at localhost:3000
bun build                    # Build for production (runs TypeScript check + Turbopack)
bun start                    # Serve the production build locally
bun lint                     # Run ESLint across the project

bunx prisma migrate dev      # Apply schema changes to the database (creates a migration file)
bunx prisma generate         # Regenerate the Prisma client after schema changes
bunx prisma studio           # Open a visual browser for your database at localhost:5555
bunx prisma db push          # Push schema to DB without creating a migration (good for prototyping)

bunx shadcn add <component>  # Add a shadcn/ui component (e.g., bunx shadcn add card)
```

## Environment Variable Reference

| Variable | Where to get it | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | Server-only admin operations |
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection string (Transaction mode) | Prisma |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry → Project → Settings → Client Keys | Sentry |
| `SENTRY_ORG` | Your Sentry organization slug | Sentry source map uploads |
| `SENTRY_PROJECT` | Your Sentry project slug | Sentry source map uploads |
| `SENTRY_AUTH_TOKEN` | Sentry → Settings → Auth Tokens | Sentry source map uploads |

> **NEXT_PUBLIC_ prefix** — any variable with this prefix is exposed to the browser. Never put secrets in a `NEXT_PUBLIC_` variable.
