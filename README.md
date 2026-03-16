# The Octet Project

An interactive chemistry education platform with 3D molecule visualization — built for the web, designed to become a mobile app.

## Features (Planned)
- Interactive 3D molecule viewer
- Guided chemistry lessons (atomic structure, bonding, reactions, and more)
- User accounts with progress tracking
- Quizzes and learning checkpoints
- Mobile app (Expo/React Native)

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| 3D Molecules | React Three Fiber + Drei |
| Auth + Database | Supabase |
| ORM | Prisma |
| Error Logging | Sentry |
| Analytics | Vercel Analytics |
| Package Manager | Bun |
| Deployment | Vercel |
| Mobile (future) | Expo + React Native |

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- A [Supabase](https://supabase.com) project created
- A [Sentry](https://sentry.io) project created

### Setup

```bash
# Clone the repo
git clone https://github.com/ggreen98/the-octet-project.git
cd the-octet-project

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
# Fill in your Supabase and Sentry keys in .env.local

# Run database migrations
bun prisma migrate dev

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

See `.env.example` for all required variables.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SENTRY_DSN=
```

## Project Structure

```
app/               # Next.js App Router pages and layouts
components/
  ui/              # shadcn/ui primitives
  molecules/       # 3D molecule viewer components
  chemistry/       # Chemistry-specific UI
lib/               # Utilities, Supabase client, Prisma client
hooks/             # Custom React hooks
types/             # Shared TypeScript types
prisma/            # Prisma schema and migrations
public/            # Static assets
```

## License

MIT
