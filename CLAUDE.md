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
Dark editorial: canvas `#141210`, ink `#ece5da`, accent `#c8452e`. Playfair Display for
headlines (`font-serif-display`), Archivo for UI (`font-sans`). Numbered chapter
sections ("Nº 01"). Motion is GSAP scroll reveals only, always behind
`prefers-reduced-motion` guards. Spec: `docs/superpowers/specs/`.
Accent for text is `--color-accent-bright` (#e05c42, WCAG AA on canvas); `--color-accent`
(#c8452e) is for backgrounds/borders only.

## Commands
`npm run dev` · `npm test` · `npm run build` · `npm run lint`

## Branches
`redesign` = active development. `gh-pages` = OLD live site (do not touch until DNS
cutover — see `docs/deployment.md`). `main` = merge target at launch.
