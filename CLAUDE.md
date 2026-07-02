# The Red Rooster Academy — site

Trilingual (FR default at `/`, NL `/nl`, EN `/en`) single-page site for a BJJ gym in
Pironchamps, Belgium. Next.js 16 App Router, statically rendered, deployed on Vercel.

## Stack
Next.js 16 · React 19 · TypeScript strict · Tailwind CSS 4 (tokens in `app/globals.css`
`@theme`) · next-intl 4 (`i18n/`) · GSAP 3 + @gsap/react (`lib/motion/`) · Vitest (`tests/`).

## Editing content — the only rule that matters
- Class times, prices, programs, instructors, contact info: `content/*.ts` (typed;
  tests in `tests/content.test.ts` enforce shape).
- All visible text: `messages/fr.json` is the source of truth; mirror every change in
  `nl.json` and `en.json` (parity enforced by `tests/messages-parity.test.ts`).
- Never hardcode text or data in components.
- Photos live in `public/images/`; swap files, keep paths (or update `content/*.ts`).

## Design system
"Affiche" poster theme, single light theme (locked): paper `#f2f1ed`, ink `#161513`,
accent `#c8452e`. Red is never body text — use it only as display type ≥30px, fills
behind white text, or borders. One deliberate full-dark color block (paper on ink) at
the end of the page. One font: Archivo variable (`--font-archivo`, axes wght + wdth).
`font-poster` utility (display headlines) = `font-stretch: 125%`, `font-weight: 900`,
uppercase, tight tracking; body/UI text uses normal-width Archivo (`font-sans`). Radius
0 everywhere; borders are 2px solid ink. Motion is GSAP scroll reveals only, always
behind `prefers-reduced-motion` guards. Spec: `docs/superpowers/specs/`.

## Commands
`npm run dev` · `npm test` · `npm run build` · `npm run lint`

## Branches
`redesign` = active development. `gh-pages` = OLD live site (do not touch until DNS
cutover — see `docs/deployment.md`). `main` = merge target at launch.
