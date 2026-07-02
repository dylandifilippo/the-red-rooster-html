# The Red Rooster Academy — Website Redesign

**Date:** 2026-07-02
**Status:** Approved by Dylan (design + mockup direction validated in visual companion session)
**Branch:** `redesign` (old site keeps serving from `gh-pages` until DNS cutover)

## Goal

Replace the 2022 template-based static site (theredroosteracademy.com) with a modern,
trilingual, statically rendered Next.js site carrying the same information — schedule,
programs, instructors, FAQ, pricing, contact — with a premium editorial design and
restrained GSAP scroll animation. Deployed on Vercel.

## Context & decisions made

- **Judo is gone entirely.** Programs are: BJJ Adultes, BJJ Enfants, Grappling No-Gi,
  Lutte. Team is: Pierre, Sébastien, Mike (Maklouf and Antonio removed). About text
  drops the Judo/Kawaishi sentence.
- **Design direction:** "Premium Editorial", chosen from three live mockups
  (`.superpowers/brainstorm/*/content/editorial-v2.html` is the validated reference).
  Dark warm canvas `#141210`, Playfair Display headlines, Archivo UI text, red accent
  `#c8452e` (from the rooster logo), numbered chapter sections (Nº 01, Nº 02…),
  **natural full-color photos — no duotone treatment**.
- **Languages:** French (default, at `/`), Dutch (`/nl`), English (`/en`) via next-intl.
- **Trial CTA:** "Cours d'essai" scrolls to the Contact section (tap-to-call, WhatsApp
  link, address). No contact form, no backend.
- **Workflow:** no Linear; spec + implementation plan committed in-repo are the tracker.
- **Photos:** current site photos for now; Dylan may provide more later — swapping must
  stay trivial.

## Stack (versions verified 2026-07-02)

| Piece | Version |
|---|---|
| Next.js | 16.2.x (App Router, static rendering, Turbopack) |
| React | 19.x |
| TypeScript | 5.x, strict |
| Tailwind CSS | 4.3.x (CSS-first config) |
| next-intl | 4.13.x |
| GSAP | 3.15 (free, incl. ScrollTrigger) |

## Architecture

Single-page site, fully pre-rendered per locale at build time. No server code, no
database, no API routes.

```
app/[locale]/layout.tsx      → locale layout: fonts, metadata, JSON-LD
app/[locale]/page.tsx        → the one page, composed of section components
components/sections/         → Hero, About, Programs, Instructors, Schedule,
                               Faq, Pricing, Contact — one file each
components/ui/               → shared primitives (SectionHeading, CtaButton,
                               LanguageSwitcher, Nav, Footer…)
content/                     → typed data: schedule.ts, pricing.ts, programs.ts,
                               team.ts, faq.ts, contact.ts
messages/fr.json | nl.json | en.json → UI strings + translated content text
lib/                         → GSAP setup/hooks, utilities
public/images/               → optimized photos migrated from current site
```

**Content model rule:** anything a gym owner might edit (class time, price, FAQ answer,
instructor) lives in `content/*.ts` as typed data or in `messages/*.json` as
translatable strings — never hardcoded in components.

## Page structure (single page, numbered chapters)

1. **Nav** — logo, anchor links, language switcher, "Cours d'essai" CTA.
2. **Hero (Nº 01 — L'Académie)** — serif headline ("L'art doux, enseigné avec rigueur
   et convivialité"), lineage subline (Hélio Gracie → Flavio Behring → Pironchamps),
   full-color hero photo with "MÉTHODE FLAVIO BEHRING" tag, CTAs: Cours d'essai →
   Contact, Planning → Schedule.
3. **About** — Behring/Gracie lineage story, Pierre Henry signature block
   (Directeur / Instructeur).
4. **Programs (Nº 02)** — 4 tiles with photos: BJJ Adultes, BJJ Enfants, Grappling
   No-Gi, Lutte.
5. **Instructors (Nº 03)** — Pierre (Ceinture noire 1° BJJ sous Flavio Behring,
   ceinture marron de Judo — professeur BJJ & Grappling), Sébastien (instructeur
   adultes/enfants BJJ & Grappling), Mike (instructeur assistant BJJ & Grappling).
6. **Schedule (Nº 04)** — day-by-day layout (not a sparse grid):
   - Lundi: BJJ Kids 18:30–19:30, BJJ Adultes 19:30–21:00
   - Mardi: Lutte 19:30–21:00
   - Mercredi: BJJ Kids 18:30–19:30, BJJ Adultes 19:30–21:00
   - Vendredi: BJJ Adultes 19:30–21:00
7. **FAQ (Nº 05)** — all 10 current questions, translated, as an accessible accordion
   (keyboard navigable, proper ARIA).
8. **Pricing (Nº 06)** — Adultes (BJJ & Grappling): Cours unique 7€, Carte 10 cours
   60€, 1 mois 80€. Enfants: Cours unique 5€, Carte 10 cours 40€.
9. **Contact** — tap-to-call +32 478 677 355, WhatsApp deep link (same number),
   address Rue Centrale 71, 6240 Pironchamps with Google Maps (lazy, click-to-activate
   facade — no iframe cost on load), Facebook + Instagram links.
10. **Footer** — socials, copyright, "Réalisé par Dylan Di Filippo" credit.

The Judo phone number (+32 483 37 70 06) is removed with Judo.

## Animation (GSAP + ScrollTrigger)

Restrained editorial storytelling: section reveal on scroll, numbered-chapter
transitions, subtle hero parallax, accordion micro-interactions. Rules:

- All scroll animation behind `prefers-reduced-motion` checks.
- No scroll-jacking, no autoplay carousels.
- Implemented following the **gsap skill**; design quality via **taste** and
  **impeccable** skills.

## i18n

- next-intl with `[locale]` segment; FR at bare `/` (no `/fr` prefix), NL at `/nl`,
  EN at `/en` — `localePrefix: 'as-needed'`.
- All three locales statically generated; `hreflang` alternates + per-locale metadata.
- FR content is the source of truth (taken from current site); NL and EN are fresh
  translations produced during implementation and flagged for Dylan's review.

## SEO

- Per-locale title/description, OpenGraph (og:image from hero photo), canonical +
  hreflang.
- `LocalBusiness`/`SportsActivityLocation` JSON-LD: name, address, geo, opening hours
  (from schedule data), phone, socials.
- Sitemap + robots via Next conventions.

## Deployment & cutover

1. Develop on `redesign`; push to GitHub.
2. Create Vercel project from the repo (Dylan's existing Vercel account); preview
   deploys per push.
3. When approved: merge `redesign` → `main`, set Vercel production branch to `main`.
4. Switch DNS for theredroosteracademy.com from GitHub Pages to Vercel (exact DNS
   records provided at cutover time). `gh-pages` branch and its CNAME stay untouched
   until then — zero downtime.
5. After cutover: archive/delete `gh-pages` and stale `feature/react-conversion`.

## Quality gates

- `next build` clean, TypeScript strict, ESLint passing.
- Lighthouse ≥ 95 (performance, a11y, best practices, SEO) on the production build.
- Images via `next/image`, properly sized; fonts self-hosted via `next/font`.
- Accessibility: keyboard-navigable nav + accordion, visible focus states, contrast
  verified on the dark palette.
- Manual visual pass per locale and per breakpoint (mobile-first — gym audiences are
  mostly on phones).
- A root `CLAUDE.md` documenting stack, content-editing workflow, and conventions.

## Out of scope (YAGNI)

- Contact form / email backend, CMS, blog, member portal, online payments,
  testimonials (kept commented-out on old site — not carried over), photo galleries
  beyond current assets, Linear tracking.
