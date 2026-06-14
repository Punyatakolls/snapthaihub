# Snap Thai Hub 🇹🇭

**Anything from Thailand, shipped to your door.** Customers snap a photo,
paste a link, or describe any Thai product — the team sources it in Bangkok,
sends one all-in quote, and ships worldwide with tracking.

Built with Next.js 16, Tailwind CSS 4, Framer Motion, SQLite, and Stripe.

## Pages

| Route | What it does |
|---|---|
| `/` | Marketing landing page (hero, how-it-works, categories, reviews, FAQ) |
| `/order` | Special-order wizard: add items by link / photo upload / description |
| `/track` | Order tracking with animated status timeline |
| `/pay/[code]` | Quote review + secure checkout |
| `/admin` | Password-protected dashboard: quote orders, update status, add tracking |

## Running locally

Node.js is installed at `~/.local/node` (on PATH via `.zshrc`).

```bash
npm run dev        # development — http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Configuration (`.env.local`)

- `ADMIN_PASSWORD` — required for `/admin` (currently set to a starter value; change it).
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — leave unset for **demo mode**
  (payments simulated). Add real keys from the
  [Stripe dashboard](https://dashboard.stripe.com/apikeys) to take live payments.
  Point a Stripe webhook for `checkout.session.completed` at `/api/webhook`.

## How orders flow

1. Customer submits the wizard → order created with code `SNTH-XXXXXX`, status **received**.
2. You open `/admin`, review items (links/photos), and **send a quote** (USD) → status **quoted**.
3. Customer sees the quote at `/pay/[code]` (or via `/track`) and pays → status **paid**.
4. You update status as you shop (**purchasing**) and ship (**shipped** + carrier/tracking number).
5. Customer follows it all on `/track`.

## Data

SQLite database and uploaded photos live in `./data/` (gitignored).
Back this folder up; it is the order book.

## Notes

- The Claude preview sandbox can't run `next dev` (Turbopack worker spawning
  is blocked); `scripts/dev-launcher.mjs` therefore serves the production
  build (`next start`). Run `npm run build` first when using the preview.
  From a normal terminal, `npm run dev` works fine.
