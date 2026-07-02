# The Red Rooster Academy

Website for The Red Rooster Academy, a Brazilian Jiu-Jitsu gym in Pironchamps (Charleroi), Belgium — [theredroosteracademy.com](https://theredroosteracademy.com).

Trilingual single-page site: French (default, at `/`), Dutch (`/nl`), English (`/en`).

## Stack

Next.js 16 (App Router, statically rendered) · React 19 · TypeScript · Tailwind CSS 4 · next-intl 4 · GSAP 3 · Vitest.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # vitest suite
npm run build   # production build (all locales pre-rendered)
```

## Editing content

- Class times, prices, programs, instructors, contact details: `content/*.ts`
- All visible text: `messages/fr.json` (source of truth) — mirror every change in `nl.json` and `en.json` (tests enforce key parity)
- Photos: `public/images/`

Full conventions: see `CLAUDE.md`. Deployment & DNS cutover: see `docs/deployment.md`.
