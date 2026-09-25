# dogmoney — NFL Sportsbook (demo)

Original NFL-only **paper sportsbook**. Place singles and parlays against Week 3 lines with a demo bankroll. Vite + React + TypeScript + Tailwind. Not affiliated with any real sportsbook brand.

**No real money.** Stakes, balance, and bets live in `localStorage` only.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- lucide-react icons
- react-router-dom

## Auth (demo only)

- Username: `admin`
- Password: `admin`

Stores `wc_auth=1` in `localStorage`. **Not production-secure.**

## Routes

| Path | Page |
|------|------|
| `/` | NFL Lines board (spread / ML / total) |
| `/bets` | My Bets (open + settled) |
| `/account` | Balance, demo reset, logout |
| `/login` | Sign in |
| `/nfl`, `/card`, `/ncaaf` | Redirect → `/` |
| `/history` | Redirect → `/bets` |

## Paper betting

- Starting balance: **$1,000** (`dm_balance`)
- Slip + bets persist: `dm_slip`, `dm_bets`
- Tap odds on the board to add a leg; opposite side of the same game replaces the prior pick
- 1 leg = single; 2+ = parlay (American odds combined via decimal multiply)
- Place Bet deducts stake and records an Open bet

## Data

Edit **`src/data/nfl-week3.json`** for games, kickoffs, and markets.

## Run

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

## Design

- Emerald accents, dark mode, Card / Button / Badge
- Sidebar brand: **dogmoney** · NFL Sportsbook
- Desktop: sticky bet slip panel; mobile: FAB + bottom drawer

## Deploy

SPA nginx `try_files` for client routes. Fly app: `dogmoney`.
