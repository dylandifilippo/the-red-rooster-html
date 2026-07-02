# Red Rooster Academy Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild theredroosteracademy.com as a trilingual (FR/NL/EN), statically rendered Next.js 16 single-page site with a premium editorial design and GSAP scroll animation, deployed on Vercel.

**Architecture:** One page composed of section components. All editable facts (times, prices, images, phone) live in typed `content/*.ts`; all human text lives in `messages/{fr,nl,en}.json` via next-intl. Every locale is pre-rendered at build time; no server code.

**Tech Stack:** Next.js 16.2 (App Router, Turbopack), React 19, TypeScript 5 strict, Tailwind CSS 4.3, next-intl 4.13, GSAP 3.15 + @gsap/react, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-02-red-rooster-redesign-design.md` — read it before starting any task.

## Global Constraints

- Branch: all work on `redesign`. Never touch `gh-pages` or `main`.
- Locales: `fr` (default, served at bare `/`, no `/fr` prefix — `localePrefix: 'as-needed'`), `nl` at `/nl`, `en` at `/en`.
- Colors: canvas `#141210`, ink `#ece5da`, accent `#c8452e`. Fonts: Playfair Display (headlines), Archivo (UI/body), via `next/font/google`.
- Judo does not exist on this site. Programs: BJJ Adultes, BJJ Enfants, Grappling No-Gi, Lutte. Team: Pierre, Sébastien, Mike. No Judo phone number.
- Contact phone `+32478677355` (display `+32 478 677 355`), WhatsApp `https://wa.me/32478677355`.
- No editable fact or visible string hardcoded in a component — data from `content/`, text from `messages/`.
- All motion wrapped in `prefers-reduced-motion: no-preference` guards. No scroll-jacking.
- Package manager: npm. Run commands from repo root `/Users/dylandifilippo/Code/the-red-rooster-html`.
- If a library API differs from the code shown here, consult current docs via the context7 MCP tools (`resolve-library-id` + `query-docs`) rather than guessing.
- Design quality: Tasks 8–13 and 15 produce the structural baseline; Task 16 is the mandatory design-polish pass using the `taste`/`impeccable`/`gsap` plugin skills. Executors of 8–13/15 should still invoke the `impeccable` skill guidance if available to them.
- Reference for the validated look: `.superpowers/brainstorm/81621-1782999198/content/editorial-v2.html` (local file, dark editorial, numbered chapters, natural photos).

---

### Task 1: Clear old site, scaffold Next.js 16, migrate assets

**Files:**
- Delete (git rm): `index.html`, `css/`, `js/`, `fonts/`, `img/`, `tasks/`, `LICENSE`, `CNAME`, `.vscode/`, `.cursor/`, `favicon.ico` (after copying), `images/` (after copying)
- Create: entire Next.js scaffold at repo root (`package.json`, `app/`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `app/globals.css`)
- Create: `public/images/` with migrated photos, `app/favicon.ico`

**Interfaces:**
- Produces: image paths used by later tasks:
  `/images/hero.jpg`, `/images/logo.png`, `/images/signature.png`,
  `/images/programs/bjj-adults.jpg`, `/images/programs/bjj-kids.jpg`, `/images/programs/grappling.jpg`, `/images/programs/lutte.jpg`,
  `/images/team/pierre.jpg`, `/images/team/sebastien.jpg`, `/images/team/mike.jpg`

- [ ] **Step 1: Stash the assets we keep**

```bash
mkdir -p /tmp/rr-assets/programs /tmp/rr-assets/team
cp images/technique.jpg /tmp/rr-assets/hero.jpg
cp images/red_rooster_logo.png /tmp/rr-assets/logo.png
cp images/signature.png /tmp/rr-assets/signature.png
cp images/gallery/bjj.jpg /tmp/rr-assets/programs/bjj-adults.jpg
cp images/gallery/bjj-kid.jpg /tmp/rr-assets/programs/bjj-kids.jpg
cp images/gallery/grappling.jpg /tmp/rr-assets/programs/grappling.jpg
cp images/parallax/grappling.jpg /tmp/rr-assets/programs/lutte.jpg
cp images/team/Pierre.jpg /tmp/rr-assets/team/pierre.jpg
cp images/team/Sebastien.jpg /tmp/rr-assets/team/sebastien.jpg
cp images/team/Mike.jpg /tmp/rr-assets/team/mike.jpg
cp favicon.ico /tmp/rr-assets/favicon.ico
```

- [ ] **Step 2: Remove the old site from the branch**

```bash
git rm -r --quiet index.html css js fonts img images tasks LICENSE CNAME favicon.ico
git rm -r --quiet .vscode .cursor 2>/dev/null || true
rm -rf node_modules
git commit -m "chore: remove legacy template site from redesign branch"
```

- [ ] **Step 3: Scaffold Next.js 16 in a temp dir and move it to root**

```bash
cd /tmp && npx create-next-app@latest rr-next --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack --yes
# move scaffold into repo root without clobbering .git, docs/, .claude/, .gitignore
rsync -a --exclude .git --exclude .gitignore /tmp/rr-next/ /Users/dylandifilippo/Code/the-red-rooster-html/
cd /Users/dylandifilippo/Code/the-red-rooster-html
# merge scaffold's gitignore entries (keep node_modules, .superpowers/, .DS_Store, add .next etc.)
cat /tmp/rr-next/.gitignore >> .gitignore && sort -u .gitignore -o .gitignore
```

Expected: `package.json` shows `"next": "16.x"`. If create-next-app flags differ, run it interactively with: TypeScript yes, ESLint yes, Tailwind yes, `src/` no, App Router yes, Turbopack yes, alias `@/*`.

- [ ] **Step 4: Move assets in**

```bash
mkdir -p public/images
cp -R /tmp/rr-assets/programs /tmp/rr-assets/team public/images/
cp /tmp/rr-assets/hero.jpg /tmp/rr-assets/logo.png /tmp/rr-assets/signature.png public/images/
cp /tmp/rr-assets/favicon.ico app/favicon.ico
rm -f public/*.svg
```

- [ ] **Step 5: Verify it builds and runs**

```bash
npm install && npm run build
```

Expected: build succeeds, static route `/` generated.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 app with migrated image assets"
```

---

### Task 2: Test infrastructure (Vitest + Testing Library)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `tests/smoke.test.tsx`
- Modify: `package.json` (scripts + devDependencies)

**Interfaces:**
- Produces: `npm test` (vitest run), `npm run test:watch`. Test files live in `tests/`.

- [ ] **Step 1: Install**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 2: Configure**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

Add to `package.json` scripts: `"test": "vitest run", "test:watch": "vitest"`.

- [ ] **Step 3: Write a smoke test and see it pass**

`tests/smoke.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('test setup', () => {
  it('renders JSX', () => {
    render(<h1>ok</h1>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
})
```

Run: `npm test` → Expected: 1 passed.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: add vitest + testing-library infrastructure"
```

---

### Task 3: Design tokens and fonts

**Files:**
- Create: `lib/fonts.ts`
- Modify: `app/globals.css` (replace scaffold content)

**Interfaces:**
- Produces: CSS custom props/utilities `bg-canvas`, `text-ink`, `text-accent`, `border-hairline`, `font-serif-display` (Playfair), `font-sans` (Archivo); exports `playfair`, `archivo` from `lib/fonts.ts` (each has `.variable`).

- [ ] **Step 1: Fonts**

`lib/fonts.ts`:
```ts
import { Archivo, Playfair_Display } from 'next/font/google'

export const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
})
```

- [ ] **Step 2: Tokens — replace `app/globals.css` with:**

```css
@import 'tailwindcss';

@theme {
  --color-canvas: #141210;
  --color-canvas-raised: #1c1916;
  --color-ink: #ece5da;
  --color-ink-muted: #a89f92;
  --color-accent: #c8452e;
  --color-hairline: rgb(236 229 218 / 0.18);
  --font-sans: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;
  --font-serif-display: var(--font-playfair), ui-serif, Georgia, serif;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  background: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-sans);
}

::selection {
  background: var(--color-accent);
  color: #fff;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build` → Expected: success (fonts/tokens compile; not used by pages yet).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add editorial design tokens and display fonts"
```

---

### Task 4: i18n plumbing (next-intl, three static locales)

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`, `proxy.ts`, `messages/fr.json`, `messages/nl.json`, `messages/en.json` (skeletons), `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`
- Modify: `next.config.ts`, `app/layout.tsx` (becomes passthrough), delete `app/page.tsx`
- Test: `tests/messages-parity.test.ts`

**Interfaces:**
- Produces: `routing` (locales `['fr','nl','en']`, defaultLocale `'fr'`, `localePrefix: 'as-needed'`); `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`; locale layout that calls `setRequestLocale` and renders fonts on `<html>`.

- [ ] **Step 1: Install and write the parity test (failing)**

```bash
npm install next-intl
```

`tests/messages-parity.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import fr from '../messages/fr.json'
import nl from '../messages/nl.json'
import en from '../messages/en.json'

function flatKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v !== null && typeof v === 'object' && !Array.isArray(v)
      ? flatKeys(v, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  )
}

describe('message catalogs', () => {
  it('nl has exactly the fr keys', () => {
    expect(flatKeys(nl).sort()).toEqual(flatKeys(fr).sort())
  })
  it('en has exactly the fr keys', () => {
    expect(flatKeys(en).sort()).toEqual(flatKeys(fr).sort())
  })
  it('no empty values in any catalog', () => {
    for (const cat of [fr, nl, en]) {
      for (const key of flatKeys(cat)) {
        const val = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], cat)
        expect(val, key).not.toBe('')
      }
    }
  })
})
```

Run: `npm test` → Expected: FAIL (messages files don't exist).

- [ ] **Step 2: Skeleton catalogs**

`messages/fr.json`: `{ "meta": { "title": "The Red Rooster Academy", "description": "Jiu-Jitsu Brésilien à Pironchamps (Charleroi)" } }`
`messages/nl.json`: `{ "meta": { "title": "The Red Rooster Academy", "description": "Braziliaans Jiu-Jitsu in Pironchamps (Charleroi)" } }`
`messages/en.json`: `{ "meta": { "title": "The Red Rooster Academy", "description": "Brazilian Jiu-Jitsu in Pironchamps (Charleroi)" } }`

Run: `npm test` → Expected: PASS.

- [ ] **Step 3: Routing config**

`i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'nl', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
})
```

`i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  return { locale, messages: (await import(`../messages/${locale}.json`)).default }
})
```

`i18n/navigation.ts`:
```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

`proxy.ts` (Next 16 name for middleware; if next-intl 4.13 docs say otherwise, check context7):
```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

`next.config.ts`:
```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 4: Layouts and page**

`app/layout.tsx` (passthrough — html lives in the locale layout):
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

Delete `app/page.tsx`.

`app/[locale]/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { archivo, playfair } from '@/lib/fonts'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://theredroosteracademy.com'),
    alternates: {
      canonical: locale === 'fr' ? '/' : `/${locale}`,
      languages: { fr: '/', nl: '/nl', en: '/en', 'x-default': '/' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: ['/images/hero.jpg'],
      type: 'website',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return (
    <html lang={locale} className={`${archivo.variable} ${playfair.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

`app/[locale]/page.tsx` (placeholder until Task 14):
```tsx
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { use } from 'react'

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)
  const t = useTranslations('meta')
  return <main className="p-10 font-serif-display text-3xl">{t('title')}</main>
}
```

- [ ] **Step 5: Verify all three locales render statically**

Run: `npm run build`
Expected: routes `/`, `/nl`, `/en` in the output, all static (`●` or `○`). Then `npm test` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: next-intl trilingual routing with static locale pages"
```

---

### Task 5: Content data layer

**Files:**
- Create: `content/types.ts`, `content/programs.ts`, `content/team.ts`, `content/schedule.ts`, `content/pricing.ts`, `content/faq.ts`, `content/contact.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces (exact exports later tasks consume):
  - `types.ts`: `ProgramId = 'bjj-adults' | 'bjj-kids' | 'grappling' | 'lutte'`, `Weekday = 'monday' | 'tuesday' | 'wednesday' | 'friday'`, `Program { id: ProgramId; image: string }`, `Instructor { id: 'pierre' | 'sebastien' | 'mike'; image: string }`, `ClassSlot { programId: ProgramId; start: string; end: string }`, `DaySchedule { day: Weekday; slots: ClassSlot[] }`, `PriceCard { id: string; price: number }`, `PricingGroup { id: 'adults' | 'kids'; cards: PriceCard[] }`
  - `programs.ts`: `export const programs: Program[]` (4 items, order: bjj-adults, bjj-kids, grappling, lutte)
  - `team.ts`: `export const team: Instructor[]` (pierre, sebastien, mike)
  - `schedule.ts`: `export const schedule: DaySchedule[]`
  - `pricing.ts`: `export const pricing: PricingGroup[]` (adults: single 7, card10 60, monthly 80; kids: single 5, card10 40)
  - `faq.ts`: `export const faqIds: string[]` (10 ids)
  - `contact.ts`: `export const contact` object (phone, phoneDisplay, whatsappUrl, address, mapsUrl, mapsEmbedUrl, facebook, instagram, geo)

- [ ] **Step 1: Write the failing test**

`tests/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { programs } from '../content/programs'
import { team } from '../content/team'
import { schedule } from '../content/schedule'
import { pricing } from '../content/pricing'
import { faqIds } from '../content/faq'
import { contact } from '../content/contact'

const TIME = /^\d{2}:\d{2}$/

describe('content integrity', () => {
  it('has the four programs, no judo', () => {
    expect(programs.map((p) => p.id)).toEqual(['bjj-adults', 'bjj-kids', 'grappling', 'lutte'])
  })
  it('has the three instructors', () => {
    expect(team.map((m) => m.id)).toEqual(['pierre', 'sebastien', 'mike'])
  })
  it('schedule slots use HH:MM and known programs', () => {
    for (const day of schedule) {
      expect(day.slots.length).toBeGreaterThan(0)
      for (const slot of day.slots) {
        expect(slot.start).toMatch(TIME)
        expect(slot.end).toMatch(TIME)
        expect(slot.start < slot.end).toBe(true)
        expect(programs.map((p) => p.id)).toContain(slot.programId)
      }
    }
  })
  it('matches the current real timetable', () => {
    const monday = schedule.find((d) => d.day === 'monday')
    expect(monday?.slots).toEqual([
      { programId: 'bjj-kids', start: '18:30', end: '19:30' },
      { programId: 'bjj-adults', start: '19:30', end: '21:00' },
    ])
    expect(schedule.map((d) => d.day)).toEqual(['monday', 'tuesday', 'wednesday', 'friday'])
  })
  it('pricing matches current rates', () => {
    const adults = pricing.find((g) => g.id === 'adults')
    const kids = pricing.find((g) => g.id === 'kids')
    expect(adults?.cards.map((c) => c.price)).toEqual([7, 60, 80])
    expect(kids?.cards.map((c) => c.price)).toEqual([5, 40])
  })
  it('has 10 unique faq ids', () => {
    expect(faqIds).toHaveLength(10)
    expect(new Set(faqIds).size).toBe(10)
  })
  it('contact is consistent', () => {
    expect(contact.phone).toBe('+32478677355')
    expect(contact.whatsappUrl).toBe('https://wa.me/32478677355')
    expect(contact.address.postalCode).toBe('6240')
  })
  it('images referenced by content exist in public/', async () => {
    const { existsSync } = await import('node:fs')
    for (const p of [...programs.map((x) => x.image), ...team.map((x) => x.image)]) {
      expect(existsSync(`public${p}`), p).toBe(true)
    }
  })
})
```

Run: `npm test` → Expected: FAIL (modules missing).

- [ ] **Step 2: Implement the content files**

`content/types.ts`:
```ts
export type ProgramId = 'bjj-adults' | 'bjj-kids' | 'grappling' | 'lutte'
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'friday'

export interface Program {
  id: ProgramId
  image: string
}

export interface Instructor {
  id: 'pierre' | 'sebastien' | 'mike'
  image: string
}

export interface ClassSlot {
  programId: ProgramId
  start: string
  end: string
}

export interface DaySchedule {
  day: Weekday
  slots: ClassSlot[]
}

export interface PriceCard {
  id: string
  price: number
}

export interface PricingGroup {
  id: 'adults' | 'kids'
  cards: PriceCard[]
}
```

`content/programs.ts`:
```ts
import type { Program } from './types'

export const programs: Program[] = [
  { id: 'bjj-adults', image: '/images/programs/bjj-adults.jpg' },
  { id: 'bjj-kids', image: '/images/programs/bjj-kids.jpg' },
  { id: 'grappling', image: '/images/programs/grappling.jpg' },
  { id: 'lutte', image: '/images/programs/lutte.jpg' },
]
```

`content/team.ts`:
```ts
import type { Instructor } from './types'

export const team: Instructor[] = [
  { id: 'pierre', image: '/images/team/pierre.jpg' },
  { id: 'sebastien', image: '/images/team/sebastien.jpg' },
  { id: 'mike', image: '/images/team/mike.jpg' },
]
```

`content/schedule.ts`:
```ts
import type { DaySchedule } from './types'

export const schedule: DaySchedule[] = [
  {
    day: 'monday',
    slots: [
      { programId: 'bjj-kids', start: '18:30', end: '19:30' },
      { programId: 'bjj-adults', start: '19:30', end: '21:00' },
    ],
  },
  { day: 'tuesday', slots: [{ programId: 'lutte', start: '19:30', end: '21:00' }] },
  {
    day: 'wednesday',
    slots: [
      { programId: 'bjj-kids', start: '18:30', end: '19:30' },
      { programId: 'bjj-adults', start: '19:30', end: '21:00' },
    ],
  },
  { day: 'friday', slots: [{ programId: 'bjj-adults', start: '19:30', end: '21:00' }] },
]
```

`content/pricing.ts`:
```ts
import type { PricingGroup } from './types'

export const pricing: PricingGroup[] = [
  {
    id: 'adults',
    cards: [
      { id: 'single', price: 7 },
      { id: 'card10', price: 60 },
      { id: 'monthly', price: 80 },
    ],
  },
  {
    id: 'kids',
    cards: [
      { id: 'single', price: 5 },
      { id: 'card10', price: 40 },
    ],
  },
]
```

`content/faq.ts`:
```ts
export const faqIds = [
  'fitness',
  'experience',
  'age',
  'women',
  'kids-age',
  'strength',
  'bring',
  'protection',
  'other-academies',
  'patches',
]
```

`content/contact.ts`:
```ts
export const contact = {
  phone: '+32478677355',
  phoneDisplay: '+32 478 677 355',
  whatsappUrl: 'https://wa.me/32478677355',
  address: {
    street: 'Rue Centrale 71',
    city: 'Pironchamps',
    postalCode: '6240',
    country: 'BE',
  },
  mapsUrl: 'https://goo.gl/maps/cNRb7dvkJPzah33K7',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.393502100971!2d4.524084315943544!3d50.4337706964473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c22900e84389d7%3A0xea6d0766de4b7b22!2sThe%20Red%20Rooster%20Academy!5e0!3m2!1sfr!2sbe!4v1631359701045!5m2!1sfr!2sbe',
  facebook: 'https://www.facebook.com/theredroosteracademy/',
  instagram: 'https://www.instagram.com/theredroosteracademy/',
  geo: { lat: 50.4337707, lng: 4.5240843 },
} as const
```

- [ ] **Step 3: Run tests**

Run: `npm test` → Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: typed content layer (programs, team, schedule, pricing, faq, contact)"
```

---

### Task 6: Full French message catalog

**Files:**
- Modify: `messages/fr.json` (complete catalog), `messages/nl.json` + `messages/en.json` (placeholder-free copies — see Step 3)
- Test: `tests/messages-content.test.ts`

**Interfaces:**
- Produces: the canonical message shape. Namespaces: `meta`, `nav`, `hero`, `about`, `sections`, `programs`, `team`, `days`, `schedule`, `faq`, `pricing`, `contact`, `footer`, `a11y`. FAQ items live at `faq.items.<id>.question` / `.answer` for each id in `content/faq.ts`. Program texts at `programs.<ProgramId>.title` / `.description`. Team at `team.<id>.name` / `.role` / `.creds` (array, may be empty).

- [ ] **Step 1: Failing test tying catalogs to content**

`tests/messages-content.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import fr from '../messages/fr.json'
import { faqIds } from '../content/faq'
import { programs } from '../content/programs'
import { team } from '../content/team'

describe('fr catalog covers content ids', () => {
  it('has question+answer for every faq id', () => {
    for (const id of faqIds) {
      const item = (fr.faq.items as Record<string, { question: string; answer: string }>)[id]
      expect(item?.question, id).toBeTruthy()
      expect(item?.answer, id).toBeTruthy()
    }
  })
  it('has title+description for every program', () => {
    for (const p of programs) {
      const item = (fr.programs as Record<string, { title: string; description: string }>)[p.id]
      expect(item?.title, p.id).toBeTruthy()
      expect(item?.description, p.id).toBeTruthy()
    }
  })
  it('has name+role for every instructor', () => {
    for (const m of team) {
      const item = (fr.team as Record<string, { name: string; role: string }>)[m.id]
      expect(item?.name, m.id).toBeTruthy()
      expect(item?.role, m.id).toBeTruthy()
    }
  })
  it('mentions no judo anywhere', () => {
    expect(JSON.stringify(fr).toLowerCase()).not.toContain('judo')
  })
})
```

Run: `npm test` → Expected: FAIL.

- [ ] **Step 2: Write `messages/fr.json` — complete content:**

```json
{
  "meta": {
    "title": "The Red Rooster Academy — Jiu-Jitsu Brésilien à Charleroi",
    "description": "Académie de Jiu-Jitsu Brésilien, Grappling et Lutte à Pironchamps (Charleroi). Méthode du Grand-Maître Flavio Behring. Adultes et enfants dès 5 ans."
  },
  "nav": {
    "about": "À propos",
    "programs": "Programmes",
    "instructors": "Instructeurs",
    "schedule": "Planning",
    "faq": "FAQ",
    "pricing": "Tarifs",
    "contact": "Contact",
    "cta": "Cours d'essai"
  },
  "hero": {
    "location": "Pironchamps · Charleroi",
    "headline": "L'art doux, enseigné avec <em>rigueur</em> et convivialité.",
    "sub": "De Hélio Gracie à Flavio Behring, jusqu'aux tatamis de Pironchamps — une lignée, une méthode, une famille.",
    "photoTag": "Méthode Flavio Behring",
    "ctaPrimary": "Réserver un cours d'essai",
    "ctaSecondary": "Voir le planning"
  },
  "sections": {
    "about": { "number": "Nº 01", "title": "L'Académie" },
    "programs": { "number": "Nº 02", "title": "Les Programmes" },
    "instructors": { "number": "Nº 03", "title": "Les Instructeurs" },
    "schedule": { "number": "Nº 04", "title": "Le Planning" },
    "faq": { "number": "Nº 05", "title": "Foire Aux Questions" },
    "pricing": { "number": "Nº 06", "title": "Les Tarifs" },
    "contact": { "number": "Nº 07", "title": "Contact" }
  },
  "about": {
    "lead": "The Red Rooster Academy est une équipe d'entraînement de Jiu-Jitsu Brésilien basée dans la région de Charleroi, suivant la méthode du Grand-Maître Flavio Behring.",
    "body": "L'entraînement y est sérieux, discipliné, convivial et totalement en accord avec les principes de notre Grand-Maître Flavio Behring, élève direct d'Hélio Gracie.",
    "signatureName": "Pierre Henry",
    "signatureRole": "Directeur / Instructeur"
  },
  "programs": {
    "bjj-adults": {
      "title": "BJJ Adultes",
      "description": "Le Jiu-Jitsu Brésilien en kimono : technique, self-défense et sparring, pour tous les niveaux."
    },
    "bjj-kids": {
      "title": "BJJ Enfants",
      "description": "Dès 5 ans : coordination, confiance, discipline et self-défense, dans un cadre ludique et bienveillant."
    },
    "grappling": {
      "title": "Grappling No-Gi",
      "description": "La lutte au sol sans kimono : contrôles, amenées au sol et soumissions, au rythme moderne du no-gi."
    },
    "lutte": {
      "title": "Lutte",
      "description": "Amenées au sol, posture et pression : la base debout qui complète le travail au sol."
    }
  },
  "team": {
    "pierre": {
      "name": "Pierre",
      "role": "Professeur BJJ & Grappling",
      "creds": [
        "Ceinture noire (1ᵉʳ degré) de Jiu-Jitsu Brésilien sous le Grand-Maître Flavio Behring"
      ]
    },
    "sebastien": {
      "name": "Sébastien",
      "role": "Instructeur adultes & enfants — BJJ & Grappling",
      "creds": []
    },
    "mike": {
      "name": "Mike",
      "role": "Instructeur assistant — BJJ & Grappling",
      "creds": []
    }
  },
  "days": {
    "monday": "Lundi",
    "tuesday": "Mardi",
    "wednesday": "Mercredi",
    "friday": "Vendredi"
  },
  "schedule": {
    "note": "Premier cours d'essai gratuit — présentez-vous simplement 10 minutes avant le début."
  },
  "faq": {
    "items": {
      "fitness": {
        "question": "Dois-je être en forme pour commencer ?",
        "answer": "Vous n'avez pas besoin d'être en super forme pour commencer à vous entraîner. En fait, le BJJ est un excellent moyen de se mettre en forme. À l'académie, tout le monde est le bienvenu sur les tapis, quel que soit son niveau de forme physique."
      },
      "experience": {
        "question": "Ai-je besoin d'une expérience préalable en arts martiaux ?",
        "answer": "Pas du tout. Si vous vous êtes déjà entraîné dans un autre art martial, c'est bien, mais vous n'avez besoin d'aucune expérience préalable. Que vous commenciez tout juste votre voyage BJJ ou que vous soyez un ancien, vous serez toujours le bienvenu."
      },
      "age": {
        "question": "Suis-je trop vieux ?",
        "answer": "Ça n'existe pas. Il n'est jamais trop tard pour commencer à s'entraîner au BJJ. Nos programmes sont conçus pour s'adresser à tout le monde. Tous les étudiants sont encouragés à s'entraîner selon leurs propres limites et peuvent pousser aussi fort qu'ils le souhaitent."
      },
      "women": {
        "question": "Avez-vous des cours réservés aux femmes ?",
        "answer": "Nous organisons sur demande des ateliers d'autodéfense pour les femmes. Ce cours convient aux femmes (13 ans et +) de tout niveau de forme physique. Il a été conçu pour fournir une introduction à des compétences pratiques de base en matière d'autodéfense."
      },
      "kids-age": {
        "question": "À quel âge les enfants commencent-ils le Jiu-Jitsu Brésilien ?",
        "answer": "Chaque enfant est différent. Cependant, nous pensons qu'environ 5 ans est un bon âge pour commencer un art martial tel que le BJJ. Notre programme pour enfants s'adresse aux 5-14 ans et vise à rendre l'autodéfense et l'éducation physique amusantes. Nous utilisons des jeux de conditionnement et axés sur les compétences pour engager et défier les enfants. Les bienfaits vont bien au-delà du physique : courtoisie, confiance, concentration, discipline, travail d'équipe, force mentale et maîtrise de soi."
      },
      "strength": {
        "question": "Dois-je être fort pour pratiquer le Jiu-Jitsu Brésilien ?",
        "answer": "La beauté du BJJ réside dans son principe fondamental : une personne plus faible et plus petite peut vaincre un adversaire plus fort et plus lourd en utilisant l'effet de levier et la technique."
      },
      "bring": {
        "question": "Que dois-je apporter ?",
        "answer": "Tout ce dont vous avez besoin pour votre premier cours, ce sont des vêtements confortables. Un t-shirt ajusté ou un rashguard est idéal, et un short sans poche est préférable. Pour les femmes, des collants et un haut sont parfaits. Si vous avez un kimono de Jiu-Jitsu ou « Gi », n'hésitez pas à le porter. Une bouteille d'eau et une petite serviette sont également une bonne idée."
      },
      "protection": {
        "question": "Ai-je besoin d'équipement de protection ?",
        "answer": "Certains élèves choisissent de porter un protège-dents lorsqu'ils roulent. Cependant, cela dépend entièrement de vous."
      },
      "other-academies": {
        "question": "Accueillez-vous des étudiants d'autres académies ?",
        "answer": "Nous nous concentrons sur la communauté, pas sur la compétition. Tout le monde est le bienvenu."
      },
      "patches": {
        "question": "J'ai un Gi avec les patchs d'un autre club. Est-ce un problème ?",
        "answer": "Non, il n'y a aucun problème."
      }
    }
  },
  "pricing": {
    "adults": { "title": "Adultes — BJJ & Grappling" },
    "kids": { "title": "Enfants — BJJ" },
    "cards": {
      "single": "Cours unique",
      "card10": "Carte 10 cours",
      "monthly": "1 mois"
    },
    "currency": "€"
  },
  "contact": {
    "callUs": "Appelez-nous",
    "whatsapp": "Écrivez-nous sur WhatsApp",
    "addressLabel": "L'académie",
    "mapCta": "Afficher la carte",
    "mapTitle": "The Red Rooster Academy sur Google Maps",
    "hoursLabel": "Heures d'ouverture",
    "hoursLink": "Voir le planning"
  },
  "footer": {
    "rights": "Tous droits réservés",
    "credit": "Réalisé par"
  },
  "a11y": {
    "openMenu": "Ouvrir le menu",
    "closeMenu": "Fermer le menu",
    "languageSwitcher": "Choisir la langue",
    "logoAlt": "Logo The Red Rooster Academy",
    "heroAlt": "Entraînement de Jiu-Jitsu Brésilien à The Red Rooster Academy",
    "signatureAlt": "Signature de Pierre Henry"
  }
}
```

- [ ] **Step 3: Keep parity green**

Copy `fr.json` verbatim over `nl.json` and `en.json` for now (real translations are Task 7 — parity test stays green, content test only checks `fr`).

Run: `npm test` → Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: complete French message catalog from live-site copy"
```

---

### Task 7: Dutch and English translations

**Files:**
- Modify: `messages/nl.json`, `messages/en.json`

**Interfaces:**
- Consumes: `messages/fr.json` shape from Task 6.
- Produces: fully translated NL and EN catalogs, same keys.

- [ ] **Step 1: Translate**

Rewrite `messages/nl.json` and `messages/en.json`: translate every string value of `fr.json` into natural, idiomatic Dutch (Belgian Flemish register, informal "je") and English respectively. Rules:
- Keep ALL keys identical; keep the `<em>` tag in `hero.headline`; keep proper nouns (The Red Rooster Academy, Flavio Behring, Hélio Gracie, Pierre Henry, Pironchamps, Charleroi); keep "Gi", "no-gi", "BJJ", "rashguard" as martial-arts vocabulary.
- Program titles: NL "BJJ Volwassenen"/"BJJ Kinderen"/"Grappling No-Gi"/"Worstelen"; EN "Adults BJJ"/"Kids BJJ"/"No-Gi Grappling"/"Wrestling".
- Day names translated (NL: Maandag/Dinsdag/Woensdag/Vrijdag; EN: Monday/Tuesday/Wednesday/Friday).
- No machine-translation stiffness: reread each string as a native would.

- [ ] **Step 2: Verify parity + no judo + build**

Run: `npm test && npm run build` → Expected: PASS, three locales build.

- [ ] **Step 3: Commit and flag for review**

```bash
git add -A && git commit -m "feat: Dutch and English translations (flagged for native review)"
```

Report in your summary: translations need Dylan's review pass.

---

### Task 8: UI primitives (SectionHeading, CtaButton, Nav, LanguageSwitcher, Footer)

**Files:**
- Create: `components/ui/SectionHeading.tsx`, `components/ui/CtaButton.tsx`, `components/ui/LanguageSwitcher.tsx`, `components/ui/Nav.tsx`, `components/ui/Footer.tsx`
- Test: `tests/language-switcher.test.tsx`

**Interfaces:**
- Consumes: tokens (Task 3), `Link`/`usePathname` from `@/i18n/navigation` (Task 4), `contact` (Task 5), messages `nav`/`footer`/`a11y`/`sections`.
- Produces:
  - `SectionHeading({ id }: { id: 'about'|'programs'|'instructors'|'schedule'|'faq'|'pricing'|'contact' })` — renders the red `Nº XX` kicker + serif title from `sections.<id>`.
  - `CtaButton({ href, variant, children })` — `variant: 'solid' | 'outline'`, anchors like `#contact`.
  - `Nav()` — client component: fixed header, logo, anchor links, LanguageSwitcher, CTA, accessible mobile menu (button with `aria-expanded`, `aria-label` from `a11y.openMenu`/`closeMenu`).
  - `Footer()` — socials, copyright year, credit link to `https://dylandifilippo.dev/`.

- [ ] **Step 1: Failing test for the language switcher**

`tests/language-switcher.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher'

function renderAt(locale: string) {
  render(
    <NextIntlClientProvider locale={locale} messages={fr}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  )
}

describe('LanguageSwitcher', () => {
  it('renders the three locales with correct hrefs', () => {
    renderAt('fr')
    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'NL' })).toHaveAttribute('href', '/nl')
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en')
  })
  it('marks the active locale', () => {
    renderAt('fr')
    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute('aria-current', 'true')
  })
})
```

Run: `npm test` → Expected: FAIL (component missing).
Note: `next-intl`'s `Link` needs the app router context in jsdom; if `createNavigation`'s Link throws outside Next, build `LanguageSwitcher` on plain `<a>` tags computing hrefs from `routing` (shown below) — that also keeps the test simple.

- [ ] **Step 2: Implement**

`components/ui/LanguageSwitcher.tsx`:
```tsx
'use client'
import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'

const LABELS: Record<string, string> = { fr: 'FR', nl: 'NL', en: 'EN' }

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('a11y')
  return (
    <nav aria-label={t('languageSwitcher')} className="flex items-center gap-3 font-sans text-xs tracking-[0.18em]">
      {routing.locales.map((l) => (
        <a
          key={l}
          href={l === routing.defaultLocale ? '/' : `/${l}`}
          aria-current={l === locale ? 'true' : undefined}
          className={l === locale ? 'text-accent' : 'text-ink-muted transition-colors hover:text-ink'}
        >
          {LABELS[l]}
        </a>
      ))}
    </nav>
  )
}
```

`components/ui/SectionHeading.tsx`:
```tsx
import { useTranslations } from 'next-intl'

type SectionId = 'about' | 'programs' | 'instructors' | 'schedule' | 'faq' | 'pricing' | 'contact'

export function SectionHeading({ id }: { id: SectionId }) {
  const t = useTranslations('sections')
  return (
    <header className="mb-10">
      <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-accent">
        {t(`${id}.number`)} — {t(`${id}.title`)}
      </p>
    </header>
  )
}
```

`components/ui/CtaButton.tsx`:
```tsx
type Props = {
  href: string
  variant?: 'solid' | 'outline'
  children: React.ReactNode
}

export function CtaButton({ href, variant = 'solid', children }: Props) {
  const base = 'inline-block px-7 py-3.5 font-sans text-xs uppercase tracking-[0.18em] transition-colors'
  const styles =
    variant === 'solid'
      ? 'bg-accent text-white hover:bg-[#a93a26]'
      : 'border border-accent text-ink hover:bg-accent hover:text-white'
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  )
}
```

`components/ui/Nav.tsx`:
```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CtaButton } from './CtaButton'

const ANCHORS = ['about', 'programs', 'instructors', 'schedule', 'faq', 'pricing', 'contact'] as const

export function Nav() {
  const t = useTranslations('nav')
  const ta = useTranslations('a11y')
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt={ta('logoAlt')} width={40} height={40} />
          <span className="font-sans text-xs font-semibold tracking-[0.22em]">THE RED ROOSTER ACADEMY</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {ANCHORS.map((a) => (
            <a key={a} href={`#${a}`} className="font-sans text-[11px] uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-ink">
              {t(a)}
            </a>
          ))}
          <LanguageSwitcher />
          <CtaButton href="#contact" variant="outline">{t('cta')}</CtaButton>
        </nav>
        <button
          type="button"
          className="lg:hidden"
          aria-expanded={open}
          aria-label={open ? ta('closeMenu') : ta('openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="block h-px w-6 bg-ink" />
          <span aria-hidden className="mt-1.5 block h-px w-6 bg-ink" />
        </button>
      </div>
      {open && (
        <nav className="border-t border-hairline px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-4">
            {ANCHORS.map((a) => (
              <li key={a}>
                <a href={`#${a}`} onClick={() => setOpen(false)} className="font-sans text-sm uppercase tracking-[0.15em]">
                  {t(a)}
                </a>
              </li>
            ))}
            <li className="pt-2"><LanguageSwitcher /></li>
          </ul>
        </nav>
      )}
    </header>
  )
}
```

`components/ui/Footer.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-hairline px-6 py-10 text-center font-sans text-xs text-ink-muted">
      <div className="mb-4 flex justify-center gap-6">
        <a href={contact.facebook} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">Facebook</a>
        <a href={contact.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">Instagram</a>
      </div>
      <p>© {new Date().getFullYear()} The Red Rooster Academy — {t('rights')}</p>
      <p className="mt-1">
        {t('credit')}{' '}
        <a href="https://dylandifilippo.dev/" target="_blank" rel="noreferrer" className="underline transition-colors hover:text-ink">
          Dylan Di Filippo
        </a>
      </p>
    </footer>
  )
}
```

- [ ] **Step 3: Run tests**

Run: `npm test` → Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: UI primitives — nav, language switcher, section heading, CTA, footer"
```

---

### Task 9: Hero and About sections

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/About.tsx`

**Interfaces:**
- Consumes: `CtaButton`, messages `hero`/`about`/`a11y`, images `/images/hero.jpg`, `/images/signature.png`.
- Produces: `Hero()`, `About()` — sync server components; `About` renders inside `<section id="about">`.

- [ ] **Step 1: Implement Hero**

`components/sections/Hero.tsx`:
```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CtaButton } from '@/components/ui/CtaButton'

export function Hero() {
  const t = useTranslations('hero')
  const ta = useTranslations('a11y')
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-accent">{t('location')}</p>
        <h1 className="mt-5 font-serif-display text-5xl leading-[1.1] font-medium lg:text-6xl">
          {t.rich('headline', { em: (chunks) => <em className="text-accent">{chunks}</em> })}
        </h1>
        <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted">{t('sub')}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <CtaButton href="#contact">{t('ctaPrimary')}</CtaButton>
          <CtaButton href="#schedule" variant="outline">{t('ctaSecondary')}</CtaButton>
        </div>
      </div>
      <figure className="relative">
        <Image src="/images/hero.jpg" alt={ta('heroAlt')} width={900} height={600} priority className="h-auto w-full object-cover" />
        <figcaption className="absolute -bottom-3 -left-3 bg-accent px-4 py-2 font-sans text-[10px] uppercase tracking-[0.25em] text-white">
          {t('photoTag')}
        </figcaption>
      </figure>
    </section>
  )
}
```

- [ ] **Step 2: Implement About**

`components/sections/About.tsx`:
```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function About() {
  const t = useTranslations('about')
  const ta = useTranslations('a11y')
  return (
    <section id="about" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="about" />
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="font-serif-display text-2xl leading-snug">{t('lead')}</p>
          <div>
            <p className="font-sans text-sm leading-relaxed text-ink-muted">{t('body')}</p>
            <div className="mt-8">
              <Image src="/images/signature.png" alt={ta('signatureAlt')} width={140} height={60} className="opacity-80" />
              <p className="mt-2 font-serif-display text-lg">{t('signatureName')}</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-ink-muted">{t('signatureRole')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify via lint + typecheck**

Run: `npx tsc --noEmit && npm run lint && npm test` → Expected: clean. (Visual verification happens in Task 14/16.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: hero and about sections"
```

---

### Task 10: Programs and Instructors sections

**Files:**
- Create: `components/sections/Programs.tsx`, `components/sections/Instructors.tsx`

**Interfaces:**
- Consumes: `programs`/`team` from content, messages `programs`/`team`, `SectionHeading`.
- Produces: `Programs()`, `Instructors()`.

- [ ] **Step 1: Implement Programs**

`components/sections/Programs.tsx`:
```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { programs } from '@/content/programs'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Programs() {
  const t = useTranslations('programs')
  return (
    <section id="programs" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="programs" />
        <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => (
            <article key={p.id} className="bg-canvas">
              <Image src={p.image} alt={t(`${p.id}.title`)} width={600} height={400} className="h-44 w-full object-cover" />
              <div className="px-5 py-6">
                <p className="font-sans text-[10px] tracking-[0.3em] text-accent">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-serif-display text-xl">{t(`${p.id}.title`)}</h3>
                <p className="mt-3 font-sans text-xs leading-relaxed text-ink-muted">{t(`${p.id}.description`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Implement Instructors**

`components/sections/Instructors.tsx`:
```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { team } from '@/content/team'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Instructors() {
  const t = useTranslations('team')
  return (
    <section id="instructors" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="instructors" />
        <div className="grid gap-10 sm:grid-cols-3">
          {team.map((m) => (
            <article key={m.id}>
              <Image src={m.image} alt={t(`${m.id}.name`)} width={480} height={560} className="h-72 w-full object-cover object-top" />
              <h3 className="mt-5 font-serif-display text-2xl">{t(`${m.id}.name`)}</h3>
              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted">{t(`${m.id}.role`)}</p>
              <ul className="mt-3 space-y-1">
                {(t.raw(`${m.id}.creds`) as string[]).map((c) => (
                  <li key={c} className="font-sans text-xs leading-relaxed text-ink-muted">— {c}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run lint && npm test` → Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: programs and instructors sections"
```

---

### Task 11: Schedule section

**Files:**
- Create: `components/sections/Schedule.tsx`
- Test: `tests/schedule-section.test.tsx`

**Interfaces:**
- Consumes: `schedule` from content, messages `days`/`schedule`/`programs`, `SectionHeading`.
- Produces: `Schedule()` — day-by-day rows (not a grid table).

- [ ] **Step 1: Failing test**

`tests/schedule-section.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Schedule } from '../components/sections/Schedule'

describe('Schedule section', () => {
  it('renders each training day with its classes and times', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <Schedule />
      </NextIntlClientProvider>,
    )
    expect(screen.getByText('Lundi')).toBeInTheDocument()
    expect(screen.queryByText('Jeudi')).not.toBeInTheDocument()
    expect(screen.getAllByText('BJJ Adultes').length).toBe(3)
    expect(screen.getAllByText(/18:30\s*–\s*19:30/).length).toBe(2)
  })
})
```

Run: `npm test` → Expected: FAIL.

- [ ] **Step 2: Implement**

`components/sections/Schedule.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { schedule } from '@/content/schedule'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Schedule() {
  const tDays = useTranslations('days')
  const tPrograms = useTranslations('programs')
  const t = useTranslations('schedule')
  return (
    <section id="schedule" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="schedule" />
        <dl className="divide-y divide-hairline border-y border-hairline">
          {schedule.map((day) => (
            <div key={day.day} className="grid gap-2 py-5 sm:grid-cols-[140px_1fr]">
              <dt className="font-serif-display text-xl">{tDays(day.day)}</dt>
              <dd className="flex flex-wrap gap-x-10 gap-y-2">
                {day.slots.map((slot) => (
                  <span key={`${slot.programId}${slot.start}`} className="font-sans text-sm">
                    <span>{tPrograms(`${slot.programId}.title`)}</span>{' '}
                    <span className="text-ink-muted">{slot.start} – {slot.end}</span>
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-sans text-xs text-ink-muted">{t('note')}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests**

Run: `npm test` → Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: day-by-day schedule section"
```

---

### Task 12: FAQ accordion (accessible)

**Files:**
- Create: `components/sections/Faq.tsx`
- Test: `tests/faq-accordion.test.tsx`

**Interfaces:**
- Consumes: `faqIds` from content, messages `faq.items.*`, `SectionHeading`.
- Produces: `Faq()` — client component, one item open at a time, full keyboard support via native `<button>` semantics, `aria-expanded` + `aria-controls`.

- [ ] **Step 1: Failing test**

`tests/faq-accordion.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { Faq } from '../components/sections/Faq'

function setup() {
  render(
    <NextIntlClientProvider locale="fr" messages={fr}>
      <Faq />
    </NextIntlClientProvider>,
  )
}

describe('FAQ accordion', () => {
  it('renders 10 collapsed questions as buttons', () => {
    setup()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)
    for (const b of buttons) expect(b).toHaveAttribute('aria-expanded', 'false')
  })
  it('expands on click and collapses the previous one', async () => {
    setup()
    const user = userEvent.setup()
    const [first, second] = screen.getAllByRole('button')
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/excellent moyen de se mettre en forme/)).toBeVisible()
    await user.click(second)
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'true')
  })
})
```

Run: `npm test` → Expected: FAIL.

- [ ] **Step 2: Implement**

`components/sections/Faq.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { faqIds } from '@/content/faq'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Faq() {
  const t = useTranslations('faq')
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <section id="faq" className="border-t border-hairline">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <SectionHeading id="faq" />
        <ul className="divide-y divide-hairline border-y border-hairline">
          {faqIds.map((id) => {
            const open = openId === id
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-${id}`}
                  onClick={() => setOpenId(open ? null : id)}
                  className="flex w-full items-baseline justify-between gap-6 py-5 text-left"
                >
                  <span className="font-serif-display text-lg">{t(`items.${id}.question`)}</span>
                  <span aria-hidden className="font-sans text-accent">{open ? '−' : '+'}</span>
                </button>
                <div id={`faq-${id}`} hidden={!open} className="pb-6">
                  <p className="font-sans text-sm leading-relaxed text-ink-muted">{t(`items.${id}.answer`)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests**

Run: `npm test` → Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: accessible FAQ accordion with all ten questions"
```

---

### Task 13: Pricing and Contact sections (with map facade)

**Files:**
- Create: `components/sections/Pricing.tsx`, `components/sections/Contact.tsx`, `components/ui/MapEmbed.tsx`
- Test: `tests/map-embed.test.tsx`

**Interfaces:**
- Consumes: `pricing`/`contact` content, messages `pricing`/`contact`, `SectionHeading`.
- Produces: `Pricing()`, `Contact()`; `MapEmbed()` — client component that renders a button first and only injects the Google iframe after click (performance facade).

- [ ] **Step 1: Failing test for the facade**

`tests/map-embed.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import fr from '../messages/fr.json'
import { MapEmbed } from '../components/ui/MapEmbed'

describe('MapEmbed facade', () => {
  it('renders no iframe until activated', async () => {
    const { container } = render(
      <NextIntlClientProvider locale="fr" messages={fr}>
        <MapEmbed />
      </NextIntlClientProvider>,
    )
    expect(container.querySelector('iframe')).toBeNull()
    await userEvent.setup().click(screen.getByRole('button', { name: /Afficher la carte/ }))
    expect(container.querySelector('iframe')).toHaveAttribute('title', expect.stringContaining('Google Maps'))
  })
})
```

Run: `npm test` → Expected: FAIL.

- [ ] **Step 2: Implement**

`components/ui/MapEmbed.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'

export function MapEmbed() {
  const t = useTranslations('contact')
  const [active, setActive] = useState(false)
  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="flex h-72 w-full items-center justify-center border border-hairline font-sans text-xs uppercase tracking-[0.2em] text-ink-muted transition-colors hover:border-accent hover:text-ink"
      >
        {t('mapCta')} ↗
      </button>
    )
  }
  return (
    <iframe
      src={contact.mapsEmbedUrl}
      title={t('mapTitle')}
      className="h-72 w-full border-0"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}
```

`components/sections/Pricing.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { pricing } from '@/content/pricing'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Pricing() {
  const t = useTranslations('pricing')
  return (
    <section id="pricing" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="pricing" />
        <div className="grid gap-14 lg:grid-cols-2">
          {pricing.map((group) => (
            <div key={group.id}>
              <h3 className="font-serif-display text-2xl">{t(`${group.id}.title`)}</h3>
              <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
                {group.cards.map((card) => (
                  <div key={card.id} className="flex items-baseline justify-between py-4">
                    <dt className="font-sans text-sm">{t(`cards.${card.id}`)}</dt>
                    <dd className="font-serif-display text-3xl">
                      {card.price}
                      <span className="ml-1 text-lg text-accent">{t('currency')}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

`components/sections/Contact.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { contact } from '@/content/contact'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MapEmbed } from '@/components/ui/MapEmbed'

export function Contact() {
  const t = useTranslations('contact')
  return (
    <section id="contact" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading id="contact" />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-muted">{t('callUs')}</p>
              <a href={`tel:${contact.phone}`} className="mt-2 block font-serif-display text-3xl transition-colors hover:text-accent">
                {contact.phoneDisplay}
              </a>
              <a href={contact.whatsappUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block font-sans text-sm text-accent underline">
                {t('whatsapp')} ↗
              </a>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-muted">{t('addressLabel')}</p>
              <a href={contact.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 block font-serif-display text-xl transition-colors hover:text-accent">
                {contact.address.street}, {contact.address.postalCode} {contact.address.city}
              </a>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-muted">{t('hoursLabel')}</p>
              <a href="#schedule" className="mt-2 inline-block font-sans text-sm underline">{t('hoursLink')} →</a>
            </div>
          </div>
          <MapEmbed />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests**

Run: `npm test` → Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: pricing and contact sections with click-to-load map"
```

---

### Task 14: Page assembly, JSON-LD, sitemap, robots

**Files:**
- Modify: `app/[locale]/page.tsx` (replace placeholder)
- Create: `lib/jsonld.ts`, `app/sitemap.ts`, `app/robots.ts`
- Test: `tests/jsonld.test.ts`

**Interfaces:**
- Consumes: every section component, `Nav`, `Footer`, `schedule`, `contact`.
- Produces: `buildLocalBusinessJsonLd(): object` in `lib/jsonld.ts`; final page order: Nav, Hero, About, Programs, Instructors, Schedule, Faq, Pricing, Contact, Footer.

- [ ] **Step 1: Failing JSON-LD test**

`tests/jsonld.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { buildLocalBusinessJsonLd } from '../lib/jsonld'

describe('LocalBusiness JSON-LD', () => {
  const ld = buildLocalBusinessJsonLd() as Record<string, unknown>
  it('is a SportsActivityLocation with correct identity', () => {
    expect(ld['@type']).toBe('SportsActivityLocation')
    expect(ld.name).toBe('The Red Rooster Academy')
    expect(ld.telephone).toBe('+32478677355')
  })
  it('derives opening hours from the schedule data', () => {
    const hours = ld.openingHoursSpecification as Array<Record<string, unknown>>
    expect(hours).toHaveLength(4)
    expect(hours[0]).toMatchObject({ dayOfWeek: 'Monday', opens: '18:30', closes: '21:00' })
    expect(hours.map((h) => h.dayOfWeek)).not.toContain('Thursday')
  })
})
```

Run: `npm test` → Expected: FAIL.

- [ ] **Step 2: Implement `lib/jsonld.ts`**

```ts
import { schedule } from '@/content/schedule'
import { contact } from '@/content/contact'
import type { Weekday } from '@/content/types'

const DAY_NAMES: Record<Weekday, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  friday: 'Friday',
}

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'The Red Rooster Academy',
    url: 'https://theredroosteracademy.com',
    telephone: contact.phone,
    image: 'https://theredroosteracademy.com/images/hero.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: contact.geo.lat, longitude: contact.geo.lng },
    sameAs: [contact.facebook, contact.instagram],
    openingHoursSpecification: schedule.map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_NAMES[day.day],
      opens: day.slots[0].start,
      closes: day.slots[day.slots.length - 1].end,
    })),
  }
}
```

- [ ] **Step 3: Assemble the page**

`app/[locale]/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { Nav } from '@/components/ui/Nav'
import { Footer } from '@/components/ui/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Programs } from '@/components/sections/Programs'
import { Instructors } from '@/components/sections/Instructors'
import { Schedule } from '@/components/sections/Schedule'
import { Faq } from '@/components/sections/Faq'
import { Pricing } from '@/components/sections/Pricing'
import { Contact } from '@/components/sections/Contact'
import { buildLocalBusinessJsonLd } from '@/lib/jsonld'

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessJsonLd()) }}
      />
      <Nav />
      <main>
        <Hero />
        <About />
        <Programs />
        <Instructors />
        <Schedule />
        <Faq />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Sitemap and robots**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'

const BASE = 'https://theredroosteracademy.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { fr: `${BASE}/`, nl: `${BASE}/nl`, en: `${BASE}/en` }
  return [
    { url: `${BASE}/`, alternates: { languages } },
    { url: `${BASE}/nl`, alternates: { languages } },
    { url: `${BASE}/en`, alternates: { languages } },
  ]
}
```

`app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://theredroosteracademy.com/sitemap.xml',
  }
}
```

- [ ] **Step 5: Full verification**

Run: `npm test && npm run build`
Expected: tests pass; build outputs static `/`, `/nl`, `/en`, `/sitemap.xml`, `/robots.txt`.
Then `npm run dev` and manually check http://localhost:3000, /nl, /en render all sections.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: assemble single-page site with JSON-LD, sitemap, robots"
```

---

### Task 15: GSAP motion layer

**REQUIRED SKILL:** Before writing any animation code, invoke the GSAP skill from the `gsap-skills` plugin (check the available-skills list for its exact name) and follow its patterns for React/Next integration.

**Files:**
- Create: `lib/motion/Reveal.tsx`
- Modify: section components (wrap key blocks), `components/sections/Hero.tsx` (subtle parallax on the photo)

**Interfaces:**
- Consumes: GSAP 3.15, @gsap/react.
- Produces: `Reveal({ children, className?, delay? })` — client component fading/translating content in on scroll, no-op under reduced motion.

- [ ] **Step 1: Install**

```bash
npm install gsap @gsap/react
```

- [ ] **Step 2: Implement `lib/motion/Reveal.tsx`**

```tsx
'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = { children: React.ReactNode; className?: string; delay?: number }

export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(ref.current, {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          delay,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        })
      })
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
```

(If the GSAP skill prescribes a different integration pattern — e.g. cleanup or SSR handling — follow the skill.)

- [ ] **Step 3: Apply restraint**

Wrap, per section, only the main content block in `<Reveal>` (e.g. the grid in Programs, the `<dl>` in Schedule, each instructor card with `delay={i * 0.08}`). Add a slow parallax to the hero image (`yPercent: -8`, scrub) inside the same `matchMedia` guard, following the GSAP skill's ScrollTrigger guidance. Do NOT animate the Nav, the FAQ interaction, or text mid-viewport. No pinning, no scrub on text.

- [ ] **Step 4: Verify**

Run: `npm test && npm run build` → Expected: clean.
Manually: `npm run dev`, scroll the page — sections reveal once, smoothly; with macOS "Reduce Motion" enabled (System Settings → Accessibility), nothing animates and all content is visible.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: restrained GSAP scroll reveals with reduced-motion guard"
```

---

### Task 16: Design polish pass (taste + impeccable skills)

**REQUIRED SKILLS:** This task is executed WITH the design skills, not from written instructions alone. Invoke the `taste-skill` plugin's skill and the `impeccable` plugin's design skill (check the available-skills list for exact names) and apply them to the whole page.

**Files:**
- Modify: any component/CSS file the polish requires (no content/data changes)

- [ ] **Step 1: Audit against the reference**

Open `.superpowers/brainstorm/81621-1782999198/content/editorial-v2.html` (the validated mockup) and the dev server side by side. Compare: type scale and hierarchy, hairline rhythm, red accent dosage, photo crops, section spacing, mobile layout at 375px/768px/1440px.

- [ ] **Step 2: Apply the taste/impeccable skill passes**

Run their checklists over the page: typography (optical sizes, line lengths 45–75ch, tracking on uppercase labels), spacing scale consistency, color contrast (WCAG AA on `#ece5da`/`#a89f92` over `#141210` — muted ink must pass 4.5:1 for body text; adjust `--color-ink-muted` if it fails), focus-visible states on all interactive elements, hover states, image treatment consistency.

- [ ] **Step 3: Verify quality gates**

```bash
npm test && npm run build && npx tsc --noEmit && npm run lint
```

Expected: all clean. Then run Lighthouse (Chrome DevTools or `npx lighthouse http://localhost:3000 --view` against `npm run start` on the production build): Performance, Accessibility, Best Practices, SEO all ≥ 95. Fix regressions before committing.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "polish: editorial design pass (taste/impeccable), a11y contrast, lighthouse >=95"
```

---

### Task 17: CLAUDE.md, deployment docs, push

**Files:**
- Create: `CLAUDE.md`, `docs/deployment.md`

- [ ] **Step 1: Write `CLAUDE.md`**

```markdown
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

## Commands
`npm run dev` · `npm test` · `npm run build` · `npm run lint`

## Branches
`redesign` = active development. `gh-pages` = OLD live site (do not touch until DNS
cutover — see `docs/deployment.md`). `main` = merge target at launch.
```

- [ ] **Step 2: Write `docs/deployment.md`**

```markdown
# Deployment & DNS cutover

## Vercel setup (once)
1. Push `redesign` to GitHub: `git push -u origin redesign`.
2. vercel.com → Add New Project → import `dylandifilippo/the-red-rooster-html`.
3. Framework preset: Next.js (auto). Root directory: `/`. No env vars needed.
4. Under Settings → Git, set the production branch to `redesign` for now
   (switch to `main` after merge at launch).
5. Every push now gets a preview URL; production deploys from the production branch.

## Domain cutover (at launch — site approved)
1. Merge: `git checkout main && git merge redesign && git push`.
2. Vercel → Settings → Git → production branch = `main`.
3. Vercel → Settings → Domains → add `theredroosteracademy.com` and `www`.
4. At the DNS registrar, replace the GitHub Pages records:
   - Delete the four GitHub Pages A records (185.199.108.153 etc.) and any
     `www` CNAME to `dylandifilippo.github.io`.
   - Add what Vercel's domain screen prescribes (currently: A `76.76.21.21` for the
     apex, CNAME `cname.vercel-dns.com` for `www`) — follow Vercel's live
     instructions, they take precedence over this doc.
5. Wait for propagation (minutes to a few hours). Verify https://theredroosteracademy.com
   serves the new site in all three locales.
6. Afterwards: disable GitHub Pages in the repo settings; optionally delete `gh-pages`
   and `feature/react-conversion` branches.
```

- [ ] **Step 3: Final verification and push**

```bash
npm test && npm run build && git add -A && git commit -m "docs: CLAUDE.md and deployment runbook"
git push -u origin redesign
```

Expected: all green; branch on GitHub ready for Vercel import (Vercel project creation + DNS are Dylan's manual steps, guided by `docs/deployment.md`).

---

## Execution notes

- Tasks 1→7 are strictly sequential. Tasks 9, 10, 11, 12, 13 are independent of each other (all depend on 8) and may run as parallel subagents if desired — they touch disjoint files. Tasks 14→17 are sequential again.
- Recommended executor model for tasks: Sonnet-tier subagents for 1–14 and 17; Task 15 (GSAP) and Task 16 (polish) benefit from a stronger model or main-loop execution with the design skills.
- After Task 14 and again after Task 16, Dylan reviews the site visually in the browser before proceeding.
