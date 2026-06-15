# Bhugol 🇳🇵

A geography quiz game — type the names of all 77 districts of Nepal before the 15-minute timer runs out.

🔗 **Play it live:** [bhugol.sambhavregmi.com.np](https://bhugol.sambhavregmi.com.np)

## About

Bhugol (भूगोल, meaning "geography" in Nepali) is a Sporcle-style map quiz built with Next.js. As you correctly guess each district name, it lights up on an interactive SVG map of Nepal.

## Features

- 🗺️ Interactive SVG map of all 77 districts of Nepal
- ⏱️ 15-minute countdown timer
- ✅ Real-time scoreboard tracking correct guesses
- 🏁 End screen showing missed districts
- 🎯 Fuzzy name matching for district guesses

## Tech Stack

- **Framework:** Next.js (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Map data:** Custom-generated SVG paths from [manishacharya60/nepal-geojson](https://github.com/manishacharya60/nepal-geojson) (2020 official boundaries)
- **Deployment:** Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm

### Installation

```bash
git clone https://github.com/sambhav605/Bhugol.git
cd Bhugol
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build

```bash
pnpm build
```

This generates a static export in the `out/` directory (configured via `output: "export"` in `next.config.mjs`).

## Project Structure

```
├── app/                  # Next.js app router pages
├── components/           # React components (NepalMap, HUD, EndScreen)
├── data/                  # District SVG path data
├── hooks/                 # useGameState, useTimer
├── lib/                   # Matching/utility logic
└── types/                 # TypeScript types
```

## Deployment

This project is deployed on **Cloudflare Pages** as a static site:

- **Build command:** `pnpm run build`
- **Output directory:** `out`
- **Deploy command:** *(none — static assets only)*

Every push to `main` triggers an automatic rebuild and redeploy.

## Data Sources

- District boundaries (2020 updated map, includes Limpiyadhura/Kalapani/Lipulekh in Darchula): [manishacharya60/nepal-geojson](https://github.com/manishacharya60/nepal-geojson)

## License

MIT