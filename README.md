# Weekly Card — Sportsbook Admin (dogmoney)

Original sportsbook-style admin for Saturday NCAAF / NFL weekly cards. Vite + React + TypeScript + Tailwind. Not affiliated with any third-party sportsbook brand.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- lucide-react icons
- recharts (weekly P/L area + stake bar)
- react-router-dom (Dashboard · Saturday NCAAF/NFL · History)

## Auth (demo only)

Hardcoded client-side login for local demos:

- Username: `admin`
- Password: `admin`

On success the app stores `wc_auth=1` in `localStorage`. Logout clears it and returns to `/login`. Unauthenticated visits to app routes redirect to `/login`.

**This is demo auth only — not production-secure.** Credentials are checked entirely in the browser; do not use this pattern for real accounts or sensitive data.

## Run

```bash
cd /workspace/bets-dashboard
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open **http://localhost:5173** (login first).

Production build:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

## Edit this week’s data

Update **`src/data/week.json`**:

- `weekLabel` / `weekShort` — header copy
- `stats` — Risked, To win, Record, Open bets
- `ncaaf` / `nfl` — suggestion cards, skips, focus notes
- `weeklyPnL` / `stakeDistribution` — chart stubs
- `history` — past weeks table

Save and the Vite HMR refresh picks it up.

## Design notes

- Dark-friendly admin shell with emerald accents
- Top bar: week label + Live/Open badge when open bets exist
- Sidebar: Weekly Card brand, Dashboard / Saturday (NCAAF, NFL) / History, admin user chip + logout
- NCAAF badges use CFB (violet) styling
- Mobile: hamburger offcanvas sidebar; denser admin chrome on desktop

## Deploy notes

`nginx.conf` uses SPA `try_files` fallback so `/login`, `/ncaaf`, `/nfl`, `/history` work behind Fly/nginx.

## Scope

Personal admin tracker. No third-party sportsbook branding. Do not push or deploy from this task unless asked.
