# Affiche Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Restyle the finished Red Rooster site (branch `redesign`) into the approved "Affiche" poster language on branch `redesign-taste`, per `docs/superpowers/specs/2026-07-02-affiche-redesign-design.md` (THE SPEC below).

**Architecture:** Pure visual-layer overhaul of an existing, fully tested Next.js 16 app. Content layer (`content/*.ts`), i18n architecture, SEO layer, section ids and order are preserved (one new section: Gallery). Components are restyled in place; two new components (Marquee, Gallery).

**Tech Stack:** unchanged (Next 16, React 19, TS strict, Tailwind 4 `@theme`, next-intl 4, GSAP 3, Vitest). Playfair Display is REMOVED; Archivo becomes a variable font with the `wdth` axis.

## Global Constraints

- Every visual decision is governed by THE SPEC. Task briefs quote the relevant spec section; when brief and code comfort disagree, the spec wins.
- Tokens (exact): paper `#f2f1ed`, ink `#161513`, ink-soft `#4c4a45`, paper-soft `#e9e7e1`, accent `#c8452e`, paper-muted `#9b968e`, accent-soft `#ffd9d0`.
- Red is NEVER body-size text. On paper it appears only as display type ≥30px, fills behind white ≥600-weight text, or borders.
- Border radius 0 everywhere. Structural borders `border-2` ink. No shadows.
- ZERO em-dashes (—) and ZERO en-dashes (–) in any visible string, any locale.
- ZERO uppercase micro-label eyebrows above headlines. The "Nº" kicker system is removed.
- One trial-CTA label everywhere: the `cta.trial` message.
- All visible text via `messages/*.json` (fr source of truth, nl/en parity); all data via `content/*.ts`. Proper-noun exceptions unchanged.
- All motion inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` or an equivalent CSS `@media` guard; no `window.addEventListener('scroll')`.
- Per task: `npm test` green and `npm run build` clean before commit. `npx tsc --noEmit` at integration points.
- Section `id` anchors, locales, slugs: unchanged. New section id: `gallery`.

---

### Task 1: Photo assets

**Files:**
- Add: `public/images/gallery/*.jpg` (14 originals, then resized in place)
- Replace: `public/images/hero.jpg`, `public/images/programs/bjj-adults.jpg`, `public/images/programs/grappling.jpg`

**Interfaces:** Produces final image files at existing paths (no component changes; existing image-existence tests keep passing).

- [ ] **Step 1: Commit the untouched originals** (history preserves full resolution)

```bash
git add public/images/gallery && git commit -m "assets: add club gallery originals"
```

- [ ] **Step 2: Resize gallery copies in place to max 2560px** (deploy weight)

```bash
cd public/images/gallery && for f in *.jpg; do sips -Z 2560 "$f"; done
```

- [ ] **Step 3: Create the three replacements** (spec §7)

```bash
cp public/images/gallery/IMG_0945.jpg public/images/hero.jpg      # club group in gi
cp public/images/gallery/IMG_4126.jpg public/images/programs/bjj-adults.jpg  # black belts, gi
cp public/images/gallery/IMG_3690.jpg public/images/programs/grappling.jpg   # footlock drilling
sips -Z 2560 public/images/hero.jpg
sips -Z 1600 public/images/programs/bjj-adults.jpg public/images/programs/grappling.jpg
```

- [ ] **Step 4: Verify** `npm test` (image-existence tests) and that every file is < 1.5 MB (`ls -la`). If any resized file still exceeds 1.5 MB, re-export with `sips -s formatOptions 80`.
- [ ] **Step 5: Commit** `git commit -am "assets: resize gallery, swap hero and program photos"`

### Task 2: Tokens and fonts

**Files:**
- Modify: `app/globals.css`, `lib/fonts.ts`, `app/[locale]/layout.tsx` (font class), `CLAUDE.md` (design-system paragraph)

**Interfaces:** Produces tokens `paper, ink, ink-soft, paper-soft, accent, paper-muted, accent-soft` and utility `font-poster`. KEEPS the old tokens (`canvas, ink-muted, accent-bright, hairline`) as aliases until Task 12 removes them (old components must keep compiling): map `canvas→#f2f1ed`, `ink-muted→#4c4a45`, `accent-bright→#c8452e`, `hairline→rgba(22,21,19,.15)`.

- [ ] **Step 1:** Replace Playfair in `lib/fonts.ts`:

```ts
import { Archivo } from 'next/font/google'

export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})
```

Remove the Playfair export and its usage in `app/[locale]/layout.tsx` (body className carries only `archivo.variable`).

- [ ] **Step 2:** In `app/globals.css` `@theme`: add the seven new tokens (Global Constraints hex values), re-point the old alias tokens, delete `--font-playfair` references, set page defaults `background: paper; color: ink`. Add:

```css
@utility font-poster {
  font-family: var(--font-archivo);
  font-stretch: 125%;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.92;
}
@media (prefers-reduced-motion: no-preference) {
  .marquee-track { animation: marquee 28s linear infinite; }
  @keyframes marquee { to { transform: translateX(-50%); } }
}
```

Keep the existing `section[id] { scroll-margin-top: 5.5rem; }`.

- [ ] **Step 3:** `npm test && npm run build` (site renders mixed-style mid-migration; build must be clean). Note: any test asserting Playfair/font-serif-display gets updated here.
- [ ] **Step 4:** Update CLAUDE.md's Design system section to the Affiche tokens/rules (spec Tokens + Typography, condensed). Commit `feat: affiche tokens, single variable font`.

### Task 3: Nav and LanguageSwitcher (spec §1)

**Files:** Modify: `components/ui/Nav.tsx`, `components/ui/LanguageSwitcher.tsx`, their tests.

- [ ] Sticky 64px, `bg-paper border-b-2 border-ink`; brand = TEXT wordmark "THE RED ROOSTER ACADEMY" `font-poster text-[15px]` (remove the logo `<Image>`); links 13px ink 600; CTA `bg-ink text-paper` solid (label `cta.trial`); switcher: 12px, inactive `text-ink-soft`, active `text-ink` with `border-b-2 border-accent`, same plain `<a>` behavior.
- [ ] Mobile panel: `h-dvh bg-paper` (was dark), scroll-lock kept, links `font-poster text-[34px]`, CTA `bg-accent text-white`.
- [ ] Update Nav/switcher tests (logo removal, classes where asserted), `npm test`, commit `feat: nav in affiche language`.

### Task 4: Hero and Marquee (spec §2, §3)

**Files:** Modify: `components/sections/Hero.tsx`, `messages/{fr,nl,en}.json` (hero keys). Create: `components/ui/Marquee.tsx`, `lib/motion/HeroIntro.tsx` (client). Modify: `app/[locale]/page.tsx` (Marquee after Hero). Tests: hero test, new marquee test.

- [ ] **Step 1 (messages):** replace `hero.heading` with `hero.line1/line2/line3` (fr: "Jiu-jitsu" / "brésilien" / "à Charleroi."; nl/en equivalents re-split sensibly); keep `hero.sub` if ≤20 words else tighten; add `hero.scheduleCta` ("Voir les horaires" etc.) if not present. Parity across the three files; update messages-parity expectations only by running the suite.
- [ ] **Step 2 (failing tests):** hero test asserts three line spans + both CTAs; marquee test asserts `aria-hidden="true"` wrapper and 8 rendered names (4 programs × 2 duplicated halves). Run; expect FAIL.
- [ ] **Step 3 (Hero):** poster composition per spec §2: H1 three stacked lines (`font-poster`, clamp(52px,9vw,150px), leading .9): line1 `text-ink`, line2 outlined (`text-transparent [-webkit-text-stroke:2px_var(--color-ink)]`), line3 `text-accent`; under-grid `lg:grid-cols-[1fr_1.2fr]`: sub + red CTA (`bg-accent text-white font-bold px-8 py-4`) + ghost secondary (`border-2 border-ink`); right: hero.jpg in `border-2 border-ink` frame, `priority`, `sizes="(min-width:1024px) 55vw, 92vw"`, wrapper `overflow-hidden`, image `h-[115%]` for parallax travel. Top padding ≤ `pt-24`.
- [ ] **Step 4 (HeroIntro):** client leaf, `useGSAP` + `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`: on mount, lines from `{y:40, opacity:0}` stagger 0.08, 0.9s `expo.out`; ScrollTrigger scrub `yPercent:12` on the framed image. Cleanup via context. Reduced motion: everything static (initial styles must be the FINAL state; GSAP `from`-tweens only inside the guard).
- [ ] **Step 5 (Marquee):**

```tsx
import { useTranslations } from 'next-intl'
import { programs } from '@/content/programs'

export function Marquee() {
  const t = useTranslations('programs')
  const names = programs.map((p) => t(`${p.id}.title`))
  return (
    <div aria-hidden="true" className="overflow-hidden border-y-2 border-ink py-4">
      <div className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-16 pr-16">
            {names.map((n, i) => (
              <span key={n} className={`font-poster text-xl ${i % 2 ? 'text-accent' : 'text-ink'}`}>
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

Mount in page.tsx directly after Hero. (Animation comes from Task 2's CSS; static overflow-hidden row under reduced motion.)
- [ ] **Step 6:** suite green, build clean, commit `feat: poster hero and discipline marquee`.

### Task 5: About (spec §4)

**Files:** Modify: `components/sections/About.tsx`, its test, `messages/*` only if wording must change.

- [ ] Drop `SectionHeading` usage (no replacement heading: the lead IS the moment). Grid `lg:grid-cols-[2fr_1fr] gap-16`: lead `text-[clamp(26px,2.6vw,40px)] font-bold leading-[1.3] text-ink` (NOT uppercase, normal width); right column: body `text-[15px] text-ink-soft leading-relaxed` + founder block (name `font-bold text-lg`, role `text-[13px] text-ink-soft`). Section padding `py-24 lg:py-32`, `border-t-2 border-ink`.
- [ ] Tests updated, suite green, commit `feat: about split-lead`.

### Task 6: Programs bento (spec §5)

**Files:** Modify: `components/sections/Programs.tsx`, its test.

- [ ] H2 `font-poster clamp(34px,4.4vw,64px) text-ink` (heading text from existing `programs.heading` message; if that key was a kicker, promote/reword in fr + mirror nl/en).
- [ ] Bento: `grid gap-0 lg:grid-cols-[1.5fr_1fr_1fr] lg:grid-rows-[280px_280px]`, mobile single column `auto-rows-[240px]`; every cell `relative overflow-hidden border-2 border-ink` (collapse doubled borders with `-ml-[2px] -mt-[2px]` technique or a gap-on-ink container; implementer picks one and applies it consistently). Cell 1 (bjj-adults) `lg:row-span-2`, photo cells: `next/image fill object-cover` + ink gradient scrim bottom 40%, title `font-poster text-2xl` (big cell `text-4xl`) paper, description 13.5px `text-paper/85`. Lutte cell: `bg-accent`, title white, description `text-accent-soft`, no image. Hover: CSS `scale-105` on image, 0.6s ease.
- [ ] Image dims: use real file dimensions post-Task-1 (`sips -g pixelWidth -g pixelHeight`) for width/height or use `fill` + `sizes`.
- [ ] Tests updated (4 programs rendered, alt texts), suite green, commit `feat: programs bento`.

### Task 7: Schedule poster timetable (spec §6)

**Files:** Modify: `components/sections/Schedule.tsx`, `tests/` (new derivation test). Possibly create `lib/timetable.ts`.

- [ ] **Step 1 (failing test):** derivation test: for every day in `content/schedule.ts` and every slot, the rendered timetable contains a cell with that program's name in that day's column at that start-time's row; times rendered are exactly the sorted unique start times.
- [ ] **Step 2 (derive):**

```ts
import { schedule } from '@/content/schedule'

export function timetableRows() {
  const starts = [...new Set(schedule.flatMap((d) => d.slots.map((s) => s.start)))].sort()
  return starts.map((start) => ({
    start,
    cells: schedule.map((day) => day.slots.find((s) => s.start === start) ?? null),
  }))
}
```

(Adapt property names to the real `content/schedule.ts` shape; read it first.)
- [ ] **Step 3 (desktop):** real `<table>` in `border-2 border-ink bg-white`: `<thead>` ink bg paper text (corner cell empty, day names via existing localized day labels), rows: `<th scope="row">` mono 600 start time with `border-r-2 border-ink`; cells: kids program `bg-ink text-paper font-bold`, other programs `bg-accent text-white font-bold`, empty `bg-white`; internal column separators 1px `#dedbd3`. Caption or `aria-label` from `schedule.heading`.
- [ ] **Step 4 (mobile < lg):** hide table, render per-day stacked cards (day heading `font-poster`, slots list with same fill coding), from the same data. Both variants in the DOM is NOT acceptable for SEO/screen readers duplication: use CSS `hidden lg:table` + `lg:hidden` and add `aria-hidden="true"` to the duplicate mobile variant while keeping the table as the accessible source.
- [ ] **Step 5 (motion):** client leaf: when table enters viewport (once), filled cells `scaleX 0→1` transform-origin left, stagger 0.05, inside the reduced-motion guard; skip on mobile cards.
- [ ] **Step 6:** suite green, build clean, commit `feat: poster timetable derived from schedule content`.

### Task 8: Team strip (spec §8)

**Files:** Modify: `components/sections/Instructors.tsx`, its test.

- [ ] One `border-2 border-ink` container, `lg:grid-cols-3`, `divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-ink`, figure bg white. Portraits keep `aspect-[3/4] h-auto w-full object-cover object-top` (Dylan's belts-visible rule), `grayscale-[0.2] hover:grayscale-0 transition`. Caption: `border-t-2 border-ink px-4 py-4`: name `font-poster text-[17px]`, role 13px ink-soft, creds 12.5px ink-soft (keys `creds` unchanged, keyed list items by index).
- [ ] Drop SectionHeading; H2 `font-poster` from `team.heading`. Suite green, commit `feat: team bordered strip`.

### Task 9: Gallery (NEW, spec §7bis)

**Files:** Create: `components/sections/Gallery.tsx`, `content/gallery.ts` (+ type in `content/types.ts`), test `tests/gallery.test.tsx`. Modify: `messages/{fr,nl,en}.json` (`gallery.heading`, `gallery.alts` array of 6), `app/[locale]/page.tsx` (between Instructors and Faq), content test (gallery paths exist on disk).

- [ ] **Step 1 (failing tests):** content test asserts 6 entries whose files exist; component test renders 6 images with alts from messages and section `id="gallery"`.
- [ ] **Step 2:** `content/gallery.ts`:

```ts
import type { GalleryPhoto } from './types'

export const gallery: GalleryPhoto[] = [
  { src: '/images/gallery/IMG_3601.jpg', span: 2 },
  { src: '/images/gallery/IMG_3606.jpg', span: 1 },
  { src: '/images/gallery/IMG_3667.jpg', span: 1 },
  { src: '/images/gallery/IMG_4124.jpg', span: 2 },
  { src: '/images/gallery/IMG_0954.jpg', span: 1 },
  { src: '/images/gallery/IMG_3705.jpg', span: 1 },
]
// GalleryPhoto = { src: string; span: 1 | 2 }
```

- [ ] **Step 3:** section `id="gallery"`, H2 from `gallery.heading` ("La vie du club"). Grid: `grid grid-cols-2 lg:grid-cols-3 gap-[2px] bg-ink border-2 border-ink`; cells `relative aspect-[4/3] overflow-hidden` with `col-span-2` when `span === 2`; `next/image fill object-cover sizes` appropriate. Alts: `t.raw('gallery.alts')[i]`. Reveal stagger via existing `Reveal`.
- [ ] **Step 4:** add nav anchor ONLY if Dylan asks later (nav stays as-is; the section is discoverable by scroll). Suite green incl. parity, commit `feat: club gallery contact sheet`.

### Task 10: FAQ (spec §9)

**Files:** Modify: `components/sections/Faq.tsx`, its test.

- [ ] Keep the accessible disclosure semantics EXACTLY (it passed review). Restyle: max-w-3xl, items separated by `border-t-2 border-ink` (single border per boundary, plus final bottom border on the list), question 17px 700 ink with a red `+` glyph rotating 45° when open (CSS transition), answer 15px ink-soft. Drop SectionHeading; H2 `font-poster`.
- [ ] Suite green (all 10 ids), commit `feat: faq poster accordion`.

### Task 11: Dark band: Pricing, Contact, Footer (spec §10)

**Files:** Modify: `components/sections/Pricing.tsx`, `components/sections/Contact.tsx`, `components/ui/Footer.tsx`, `components/ui/MapEmbed.tsx` (frame/placeholder styles only), their tests.

- [ ] Wrap treatment: Pricing opens the band (`bg-ink text-paper`, generous `py-24`), Contact continues it, Footer closes it; between-component seams invisible (same bg, no borders between them). Everything before Pricing stays paper: exactly one theme flip on the page.
- [ ] Pricing: H2 `font-poster text-paper`; tiles grid `gap-[2px] bg-[#3a3835]`; trial tile `bg-accent` (value "Gratuit"/localized, `font-poster text-[44px] text-white`, label `text-accent-soft`); adult/kids tiles `bg-ink`, values `font-poster text-[44px] text-paper` + `/ mois` 16px paper-muted; per-session price one 14px paper-muted line under the grid. ALL prices from `content/pricing.ts` (no dropped data; verify against existing pricing test).
- [ ] Contact: phone hero element (mono `clamp(24px,3.4vw,44px)` 600, `border-b-[3px] border-accent`, `href="tel:"` kept); WhatsApp button `bg-accent text-white font-bold`; address paper-muted; MapEmbed unchanged behavior, placeholder restyled to band (`border-2 border-paper/20`), iframe same frame.
- [ ] Footer inside band: `border-t border-paper/15`, brand + Facebook/Instagram + copyright, 13px paper-muted. No version strings.
- [ ] Suite green, build clean, commit `feat: dark band pricing contact footer`.

### Task 12: Cleanup and copy audit

**Files:** Delete: `components/ui/SectionHeading.tsx` (+ its test). Modify: `messages/{fr,nl,en}.json` (remove ALL `*.kicker` keys), `app/globals.css` (remove alias tokens `canvas/ink-muted/accent-bright/hairline` once grep shows zero usages), `tests/messages-parity.test.ts` region only if it hardcodes keys. Add: dash-ban test.

- [ ] Grep for `SectionHeading`, `kicker`, `canvas`, `ink-muted`, `accent-bright`, `hairline`, `font-serif-display`, `playfair`: every remaining usage is migrated or deleted. `content/schedule.ts` / formatters: any en-dash in time ranges becomes a hyphen.
- [ ] New test: no `—` or `–` in any string value of any `messages/*.json` (recursive walk).
- [ ] Copy self-audit (taste 4.9): re-read every fr string changed this plan; fix anything awkward; mirror nl/en.
- [ ] Full suite + `npx tsc --noEmit` + `npm run build` green, commit `chore: remove kicker system, playfair leftovers, add dash-ban test`.

### Task 13: QA gate and polish

**Files:** whatever the findings demand.

- [ ] Production build + Lighthouse ≥95 ×4 on `npm run build && npx next start` (or the project's established Lighthouse flow).
- [ ] Dispatch Sonnet browser QA (SEPARATE browser window per house rule): desktop 1440 + mobile 390 passes of all three locales; checks: hero fits viewport, timetable readable, marquee runs, borders align, dark band seam, reduced-motion sanity (emulate), tap targets. Screenshots reviewed by the QA agent, findings reported as a list.
- [ ] Run THE SPEC's binding taste Pre-Flight Check (skill Section 14) as a checklist over the rendered site; fix loop for any failure.
- [ ] Update `.superpowers/sdd/progress.md`, push branch, STOP for Dylan's checkpoint.
