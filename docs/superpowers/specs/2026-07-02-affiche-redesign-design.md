# The Red Rooster Academy: "Affiche" Redesign (design spec)

Date: 2026-07-02 · Branch: `redesign-taste` · Supersedes the visual language of
`2026-07-02-red-rooster-redesign-design.md`. Everything non-visual in that spec
(content architecture, i18n, SEO, deployment) remains in force.

## Design read (taste skill, Section 0.B)

Reading this as: **overhaul redesign of a local martial-arts club single-page
site**, for prospective students and parents around Charleroi, with a **Belgian
sports-poster language** (print-emulating: paper, ink, one red), leaning toward
**native Tailwind v4 tokens + a single variable grotesk + GSAP scroll motion**.

Dials: `DESIGN_VARIANCE: 8` · `MOTION_INTENSITY: 6` · `VISUAL_DENSITY: 4`.

Direction chosen by Dylan from three live mockups: **C · Affiche** as the base,
grafting from **A · Vestiaire**: the kinetic marquee strip of disciplines and
the image-forward asymmetric program grid.

## What does NOT change (Redesign Protocol 11.C / 11.F)

- Information architecture, section order, section `id` anchors, URL structure,
  locales (`/`, `/nl`, `/en`), nav labels' meaning.
- All content facts: `content/*.ts` untouched.
- The messages architecture: fr.json source of truth, nl/en parity. (Keys may be
  added/removed/reworded; parity test still governs.)
- SEO layer: JSON-LD, sitemap, robots, canonical + hreflang, metadataBase.
- Accessibility wins: focus states, alt text, keyboard nav, reduced-motion
  guards, scroll-margin anchors, accessible FAQ accordion semantics.
- MapEmbed behavior: IntersectionObserver auto-load at 600px proximity.
- Vitest suites: content, messages-parity, and component tests updated only
  where markup changes, never weakened.

## Tokens (`app/globals.css` `@theme`, replacing the dark set)

```css
--color-paper:   #f2f1ed;  /* page canvas */
--color-ink:     #161513;  /* text, borders, dark band bg */
--color-ink-soft:#4c4a45;  /* secondary text on paper (7.9:1) */
--color-paper-soft:#e9e7e1;/* hover fills on paper */
--color-accent:  #c8452e;  /* THE red: large type, fills, borders */
--color-paper-muted:#9b968e; /* secondary text on ink band (5.4:1 on ink) */
--color-accent-soft:#ffd9d0; /* secondary text on accent fills */
```

Contrast rules (hard):
- Body-size text on paper: `ink` or `ink-soft` only. Red is NEVER body text.
- Red `#c8452e` on paper only as: display type ≥ 30px (3.9:1 > 3:1 large-text
  AA), fills behind white text (4.9:1), and 2px borders.
- White text on red fills: only at weight ≥ 600 and size ≥ 14px.
- Dark band: text `paper` on `ink`; secondary `paper-muted`.

Theme: **single light theme, locked** (print-emulating editorial: the skill's
sanctioned case for one-mode). One deliberate full-dark color block at the end
of the page (Pricing + Contact + Footer), used exactly once: the "Color Block
Story" exception. No other section inverts.

Shape lock: **radius 0 everywhere**. Structural motif: `2px solid ink` borders.
Hairlines (`1px #dedbd3`) only INSIDE bordered composites (table column
separators). Shadows: none.

## Typography

One font: **Archivo variable (next/font), axes wght 100–900 + wdth 62–125**.
Playfair Display is removed; `font-serif-display` and `lib/fonts.ts` Playfair
entry deleted.

- Display ("poster"): Archivo, `font-stretch: 125%`, weight 900, uppercase,
  `tracking-[-0.02em]`, line-height 0.9–0.95. Utility: `font-poster`.
- Body/UI: Archivo normal width. Body 15–17px, line-height 1.5–1.6, max 65ch.
- Times/numbers: `ui-monospace` stack (no extra font download), weight 600.
- H1 scale `clamp(52px, 9vw, 150px)`; H2 scale `clamp(34px, 4.4vw, 64px)`.
- Emphasis inside headlines: outlined text (`-webkit-text-stroke: 2px ink`,
  transparent fill) or red fill. Never a second font family, zero italics
  needed (no descender-clipping risk).

Copy rules (taste skill, binding for every visible string):
- ZERO em-dashes and en-dashes anywhere. Ranges use hyphens ("19:30-21:00" may
  keep the existing format from content/schedule.ts: it renders with the
  existing separator; if that separator is an en-dash today, change the
  formatter to a hyphen).
- No section-number eyebrows: the "Nº 01" chapter system is REMOVED. Kickers
  are removed from all sections; headlines carry the sections alone.
  (messages: `*.kicker` keys deleted in all three locales; SectionHeading
  component deleted or reduced to the headline slot.)
- Max 1 uppercase micro-label per 3 sections (nav brand and table headers do
  not count; the marquee does not count as an eyebrow).
- One CTA intent, one label: `cta.trial` ("Cours d'essai gratuit") everywhere
  a trial CTA appears (nav, hero, dark band). "Voir les horaires" is a
  different intent (secondary hero link) and appears once.

## Page composition (top to bottom)

Layout families used: poster-hero, marquee, split-lead, bento, poster-table,
bordered-strip, accordion, color-block. Eight sections, eight families: the
Section-Layout-Repetition ban is satisfied.

### 1. Nav (`components/ui/Nav.tsx`, restyled)
Sticky, height 64px, paper background, `border-b-2 border-ink`. Left: brand as
text wordmark "THE RED ROOSTER ACADEMY" in `font-poster` 15px (logo.png is a
light wordmark designed for dark canvases; do not use it on paper. If Dylan
later provides an ink version, swap in). Center/right: links (ink, 13px, 600).
Right: solid ink CTA button (paper text) + LanguageSwitcher (unchanged
behavior, restyled: 12px, ink-soft, current locale ink + underline 2px red).
Mobile: hamburger opens a full `h-dvh` PAPER panel (scroll lock kept), links in
`font-poster` 34px stacked, CTA red.

### 2. Hero (`components/sections/Hero.tsx`, id="top")
Poster composition, `min-h` NOT forced (content-driven), top padding ≤ 96px.
- H1, three stacked lines, `font-poster`:
  line 1 solid ink ("Jiu-jitsu"), line 2 outlined ("brésilien"), line 3 red
  ("à Charleroi."). Locale variants may re-split; keys `hero.line1..line3`.
- Under-grid `grid-cols-[1fr_1.2fr]` (collapses to single column < 860px):
  left: sub ≤ 20 words (`hero.sub`) + red CTA (white text) + ghost secondary
  "Voir les horaires" (ink border 2px); right: hero.jpg in a `border-2
  border-ink` frame, bleeding to the section's bottom edge, GSAP parallax
  (image 115% height, y-scrub), `priority` + `sizes` kept from current build.
- Hero stack: headline + sub + 2 CTAs = within the 4-element cap. No eyebrow,
  no scroll cue, no decoration strip.

### 3. Marquee (new, `components/ui/Marquee.tsx`, grafted from A)
Full-width strip directly under the hero: `border-y-2 border-ink`, paper bg,
one row of the four discipline names in `font-poster` 20px, alternating ink /
red, separated by wide gaps (no dots, no slashes). CSS keyframe translation,
duplicated track for the loop, `aria-hidden`, fully disabled (static row,
overflow hidden) under `prefers-reduced-motion`. THE one marquee on the page.
Names come from existing `programs.*.title` messages (no new copy).

### 4. About (`components/sections/About.tsx`, id="about")
Split-lead: left (2fr) `about.lead` set large (clamp 26-40px, weight 700,
normal width, NOT uppercase: this is the one big reading moment); right (1fr)
`about.body` 15px ink-soft + the founder block (name 700, role 13px ink-soft)
kept from the current build. This is a real 2-column composition (lead is
display-scale content, not a floating explainer), not the banned split-header.

### 5. Programs (`components/sections/Programs.tsx`, id="programs")
H2 "Les cours" then the A-graft: asymmetric bento, 4 items → 4 cells,
`grid-cols-[1.5fr_1fr_1fr]`, rows 280px, first cell (BJJ Adultes) spans both
rows. Every cell `border-2 border-ink`, photo `object-cover` with an ink scrim
gradient bottom 40%, title `font-poster` on the photo bottom-left in paper,
one-line description 13.5px. The Lutte cell is the red-fill cell (no photo
needed if lutte.jpg is weak; accent-soft description text). Hover: image scale
1.04 (GSAP-free, CSS transition), cell background shift. Mobile: single
column, 240px rows. Bento background diversity: 3 photo cells + 1 red cell.

### 6. Schedule (`components/sections/Schedule.tsx`, id="schedule")
The centerpiece. H2 "La semaine type" then the poster timetable: white
(`#fff`) table in a `border-2 border-ink` frame. Header row ink bg, paper
text: empty corner + the four training days (from `content/schedule.ts`,
localized day names as today). Two time rows (18:30, 19:30) with mono time in
a left column separated by a 2px border; cells: kids sessions ink-filled paper
text, adult/lutte sessions red-filled white text, empty cells white. Derived
entirely from `content/schedule.ts` at build time (times and rows are NOT
hardcoded: group slots by start time). Mobile < 860px: the grid collapses to
per-day stacked cards (day heading + its slots), same fill coding. Screen
readers: keep a proper `<table>` with `scope` attrs, or the current dl
semantics per-day on mobile; implementer picks one and tests it.

### 7. Team (`components/sections/Instructors.tsx`, id="instructors")
H2 "L'équipe" then bordered strip: 3 figures in one `border-2 border-ink`
container, 2px ink verticals between them, white figure bg. Portraits 3:4
`object-cover object-top` (full belts visible: Dylan checkpoint rule),
`grayscale(0.2) → 0 on hover`. Caption block under a 2px top border: name
`font-poster` 17px, role 13px ink-soft, creds list 12.5px ink-soft (kept from
messages). Mobile: stacked, borders adjust.

### 8. FAQ (`components/sections/Faq.tsx`, id="faq")
H2 + accordion, max-w-3xl, left-aligned. Items separated by single 2px ink
top-borders (one border per boundary, sparse, not boxed). Question 17px 700
ink with a red plus/minus glyph (rotating, CSS transition, reduced-motion
safe); answer 15px ink-soft. Accessible disclosure semantics kept exactly as
the current build (it passed review). All 10 existing FAQ ids kept.

### 9. Dark band: Pricing + Contact + Footer (the one color block)
`bg-ink text-paper`, replaces the separate Pricing/Contact/Footer styling;
components stay separate (Pricing.tsx id="pricing", Contact.tsx id="contact",
Footer.tsx) but share the band treatment.
- Pricing: H2 "Tarifs" (paper), 3 tiles in a 2px-gap grid on `#3a3835` gap
  color: "Gratuit / Premier cours d'essai" tile red-filled, adult and kids
  monthly tiles ink with paper values (`font-poster` 44px, "/ mois" 16px
  paper-muted). Per-session price rendered as one 14px paper-muted line under
  the grid (from `content/pricing.ts`, no data dropped).
- Contact: H2 (`contact.heading`), then: phone as the hero element, mono
  clamp(24px,3.4vw,44px), `border-b-[3px] border-accent`, tap-to-call;
  WhatsApp button (red fill, white text, one intent of its own); address
  lines paper-muted. MapEmbed: same lazy behavior, iframe framed `border-2`
  paper-colored border at 20% opacity; placeholder block styled to band.
- Footer: inside the band, `border-t border-paper/15`: brand line, Facebook /
  Instagram links, copyright. No version strings, no locale strips.

## Motion spec (GSAP, `lib/motion/`, MOTION_INTENSITY 6)

All inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, once,
cleanup via context revert (current architecture kept).
- Hero: on-load stagger of the three H1 lines (y 40 → 0, 0.9s, expo.out,
  0.08s stagger) + photo clip/parallax scrub. Motivation: hierarchy, the
  poster reveals like a print coming off the press.
- Reveal.tsx: kept for section entries (y 28, once). Motivation: reading
  rhythm on a long single page.
- Marquee: CSS only.
- Timetable: red/ink cell fills sweep in (scaleX 0→1, transform-origin left,
  stagger 0.05) when the table enters. Motivation: draws the eye to the data
  that converts. Skip on mobile cards.
- Hovers: CSS transitions only (rows, cells, buttons `active:scale-[0.98]`).
- NO pinning, NO scroll-hijack, NO window scroll listeners.

## Tests & quality gates

- Existing suites keep passing (update selectors/markup expectations only).
- New content-derivation test: timetable renders every slot from
  `content/schedule.ts` (times × days), so a schedule edit reflows the poster.
- messages-parity still enforced after key changes (kicker removals, hero line
  keys) across fr/nl/en.
- Taste Pre-Flight Check (skill Section 14) is a BINDING review gate for every
  task review and the final review: reviewers receive the checklist categories
  (em-dash zero, eyebrow count, layout-repetition, CTA intents, contrast,
  theme lock, shape lock, motion motivated, reduced motion, mobile collapse).
- Lighthouse ≥ 95 all four categories on production build (re-run at the end).
- WCAG AA verified for every text/background pair listed in Tokens.

## Flagged for Dylan (not blockers)

- logo.png is dark-canvas art; nav uses a text wordmark until an ink-on-light
  logo exists.
- Program photos are 370×208; the big bento cell will be soft on retina until
  new photos arrive (known backlog item).
- NL/EN wording of any new/reworded keys needs his native review, as before.
