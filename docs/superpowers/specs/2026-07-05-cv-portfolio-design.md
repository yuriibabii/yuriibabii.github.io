# Yurii Babii — CV + Portfolio Site — Design Spec

**Date:** 2026-07-05
**Owner:** Yurii Babii
**Target role:** Lead Android Engineer — France / Global, Remote
**Host:** GitHub Pages at `yuriibabii.github.io` (root of repo `yuriibabii.github.io`)

## Goal

A beautiful, standout static site that works as both CV and portfolio. Domain-agnostic
positioning (NOT wellbeing-exclusive) — keeps global Lead Android roles open while still
conveying a human-first, product-minded leader. Single scrollable landing page plus three
deep-dive case-study pages.

## Positioning

- Hero title: **Lead Android Engineer**.
- Wellbeing appears as a personal thread (About section, iFIT experience) — not the site's frame.
- Emphasis order: scale + reliability (DraftKings) → founder/leadership (UAdemy) → org-building
  (Epicentr) → connected-fitness craft (iFIT).

## Site map

```
yuriibabii.github.io/
  index.html                 main scroll page
  case-studies/
    draftkings.html          scale + reliability
    uademy.html              founder + leadership + heart
    epicentr.html            built mobile dept ground-up
  css/style.css
  js/main.js
  assets/
    img/uademy/{analytics-25k.png, ratings-49.png, appstore-preview.png}
    img/... (other screenshots added later)
    cv/Yurii-Babii-CV.pdf
    favicon, og-image (generated)
```

- iFIT: strong entry in experience timeline + a "Selected work" mention, no deep-dive page.
- Case study pages: DraftKings, UAdemy, Epicentr K.

## index.html sections

1. **Hero** — name, "Lead Android Engineer", one-line pitch, location (Nice, France · Open to Remote),
   CTAs: Email · LinkedIn · Download CV. Portrait from CV.
2. **Impact metrics** — animated count-up tiles:
   `8+ yrs · 12M+ bets handled · ~59k bets/min peak (Super Bowl) · 2.5M users · 25.3K installs · 4.9★`.
   Count-up respects `prefers-reduced-motion` (shows final value immediately if set).
3. **Selected work** — 3 primary cards (DraftKings / UAdemy / Epicentr) linking to case studies;
   iFIT + earlier roles as compact secondary entries.
4. **Experience timeline** — vertical, all roles from CV (DraftKings, UAdemy/Gemplay, iFIT, Epicentr K,
   Trinetix, High Marks) with dates + one-line impact each.
5. **Skills** — grouped: Android · CI/CD & Observability · AI · Cross-platform.
6. **About** — Husky, half-marathon training, yoga, electronic music, organization/productivity.
7. **Contact** — email, LinkedIn, CV download, languages, certifications, education.

## Case study page pattern

Shared layout per page:
- Hero: project name, role, dates, tech stack chips.
- Context / problem.
- What I did (bulleted, action-led).
- Impact (metric tiles).
- Screenshots in device/browser frames (UAdemy has real assets now; others add later).
- Tech callouts.
- Back-to-home link.

### Verified metrics (from App Store Connect screenshots, 2026-07-05)
- UAdemy: **25.3K total downloads**, **4.9★ from 796 ratings**, current build 1.3.8.
  (Supersedes older CV figures of 21k / 650+.)

## Visual system — "Calm Wellbeing" (applied lightly, domain-neutral)

- **Palette:** bg warm off-white `#FAF8F4`, text warm charcoal `#2B2A27`, sage accent `#6E8B74`,
  clay secondary `#C0855F`, muted borders/soft shadows.
- **Type:** Fraunces (humanist serif) for headings, Inter for body — via Google Fonts.
- Generous whitespace, rounded corners, soft shadows, gentle fade/slide-in on scroll.
- `prefers-reduced-motion` respected across all animation.
- Light theme only (no dark mode — YAGNI).
- Fully responsive mobile → desktop.
- SEO/OG meta tags, favicon, `og-image`, `sitemap.xml`, `robots.txt`.

## Tech & build

- Hand-crafted static HTML/CSS/JS. No framework, no build step.
- Shared `css/style.css` + `js/main.js` across all pages.
- Deployed by pushing to `yuriibabii.github.io` repo; Pages serves root.
- CV PDF downloadable at `assets/cv/Yurii-Babii-CV.pdf`.

## Review widget

Pages produced via `html-plan-builder` include an inline review comment widget for in-browser
annotation. **The widget is stripped from every page before deploy** — the public site ships clean.

## Open items (build-time, non-blocking)

- Additional screenshots for DraftKings / iFIT / Epicentr (add when available; design must look
  complete without them).
- Public contact email: **`yurii.babii.work@gmail.com`** (confirmed).

## Out of scope

- Backend, contact form submission (use mailto), analytics, dark mode, CMS, blog.
