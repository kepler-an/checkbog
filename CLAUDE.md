# Checkbog Build Plan

## Stack Decision

**Astro (latest stable) + vanilla CSS — no Tailwind, no UI framework**

- 11 sections → `.astro` component files (maintainable, clean)
- Astro outputs zero JS by default → Lighthouse 95+
- First-class Vercel static detection (no adapter needed)
- Vanilla CSS + custom properties for brand palette — avoids Tailwind v4 toolchain risk
- Plus Jakarta Sans via `<link>` tag (no npm font packages)

---

## Phase 0 — Project Setup
- [x] Initialize project with Astro minimal template
- [x] npm install
- [x] CLAUDE.md written
- [x] `src/styles/global.css` — CSS custom properties, reset, typography
- [x] `src/layouts/Layout.astro` — head, global CSS, WA float button, scroll JS
- [x] `astro.config.mjs` — minimal static config

## Phase 1 — Components
- [x] Nav
- [x] Hero
- [x] Problems
- [x] Solution
- [x] Services
- [x] Differentiation
- [x] TargetNiche
- [x] Process
- [x] Pricing
- [x] FinalCTA
- [x] Footer

## Phase 2 — Assembly
- [x] Wire all sections into `src/pages/index.astro`
- [x] Smooth scroll (`scroll-behavior: smooth` on html)
- [x] Anchor links → #contacto

## Phase 3 — Polish
- [x] Mobile layout 375px check
- [x] WA links verified
- [x] Meta tags + Open Graph
- [x] Favicon (SVG data URI)

## Phase 4 — Deploy Prep
- [x] `npm run build` — no errors
- [x] Output in `dist/`
- [x] `vercel.json` (if needed)
