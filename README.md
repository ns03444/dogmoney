# dogmoney — NFL Sportsbook (demo)

Original NFL-only **paper sportsbook**. Place straight bets, parlays, and teasers against Week 3 lines with a demo bankroll. Not affiliated with any real sportsbook brand.

**No real money.** Stakes, balances, and bets are illustrative paper wagers only.

## Stack

- Vite + React + TypeScript + Tailwind CSS v4
- Express API + bcrypt password hashing + httpOnly cookie sessions
- JSON account store (`/data/dogmoney.json` in the container; Fly disk is ephemeral without a mounted volume)

## Accounts and auth

The API seeds these accounts on boot:

- Admin: `admin` / `admin`
- Test user: `test` / `test123`

Users can create accounts from the sign-in page. Sessions use an httpOnly cookie; passwords are hashed with bcrypt. Paper betting data is namespaced in browser storage by authenticated user id.

## Routes

| Path | Page |
|------|------|
| `/` | NFL Lines board with Straight / Parlay / Teaser / Live tabs |
| `/bets` | My Bets (open + settled) |
| `/account` | Balance, demo reset, logout |
| `/admin` | Admin-only user list, balance adjustment, activation controls |
| `/login` | Sign in or create account |
| `/nfl`, `/card`, `/ncaaf` | Redirect → `/` |
| `/history` | Redirect → `/bets` |

## Paper betting

- Starting balance: **$1,000** per account
- Straight mode accepts exactly one leg; Parlay mode requires 2+ legs
- Teaser mode accepts 2–4 NFL spread/total legs with 6, 6.5, or 7 points
- Simplified teaser payouts are documented in the UI: 2-leg -120, 3-leg +150, 4-leg +200
- Place Bet deducts stake and records an Open paper bet

## Run

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

For the production-style combined API + SPA server:

```bash
npm run build
PORT=8080 npm start
```

## Deploy

Fly app: `dogmoney`. The container serves the SPA and `/api` from Express on port 8080.
