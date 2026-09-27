# CalmIq

Calm wellness companion: marketing site + authenticated chat, paid physiotherapist sessions (Stripe entitlements), English/Urdu (RTL), Vercel-ready.

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- `next-intl` locales: `en`, `ur`
- Supabase Auth + Postgres (RLS schema in `supabase/migrations/`)
- Stripe Checkout / Portal / webhooks
- Vercel AI SDK (`ai` + `@ai-sdk/google` + `@ai-sdk/react`)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/en`.

Without Supabase/Stripe/Gemini keys the app runs in **demo mode**:

1. Sign in via **Continue in demo mode** on `/en/login`
2. Chat works with streamed placeholder replies
3. Account page can simulate Free vs Calm+
4. Sessions stay locked on Free; unlock after simulating Calm+

## Scripts

| Script        | Description              |
|---------------|--------------------------|
| `npm run dev` | Local development        |
| `npm run build` | Production build       |
| `npm run start` | Start production server|
| `npm run lint`  | ESLint                 |

## Environment variables

See [`.env.example`](.env.example). Required for production:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_CALM_PLUS`
- `GEMINI_KNOWLEDGE_API_KEYS` (comma-separated OK; first key used)
- `GEMINI_MODEL` (optional; default `gemini-2.5-flash`)

## Supabase

1. Create a project and run `supabase/migrations/001_init.sql`
2. Enable Email magic-link auth
3. Add redirect URLs: `https://<domain>/api/auth/callback` (and preview URLs)

## Stripe

1. Create a recurring Price for Calm+; set `STRIPE_PRICE_CALM_PLUS`
2. Webhook → `https://<domain>/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Vercel

1. Import the GitHub repo; framework Next.js; root `.`
2. Set env vars for Production and Preview
3. Deploy — Node 20+

## Product routes

| Path | Notes |
|------|--------|
| `/[locale]` | Marketing home |
| `/[locale]/pricing` | Free vs Calm+ |
| `/[locale]/about` | Trust / disclaimer |
| `/[locale]/chat` | AI chatbot (auth) |
| `/[locale]/sessions` | Physio requests (Calm+ only) |
| `/[locale]/account` | Plan / demo toggles / billing |
