# Retro Gold Arcade

A retro-modern daily gold claim web app built with Next.js, Prisma, and NextAuth.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Setup

```bash
# Generate Prisma client and create SQLite DB
npx prisma db push

# Seed demo account (demo@demo.com / demo1234)
npm run db:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Daily Gold Reward**: Claim 10 gold every day at 12:00 (local timezone)
- **Server-authoritative time**: Server validates claim time
- **Demo/Testing Mode**: Simulate different times, add demo gold
- **Retro-modern UI**: Dark theme, neon accents, pixel font

## Demo Account

- Email: `demo@demo.com`
- Password: `demo1234`

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Prisma + SQLite
- NextAuth (credentials)
- @vercel/analytics