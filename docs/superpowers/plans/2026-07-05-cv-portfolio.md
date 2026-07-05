# CV + Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **HTML GATE (from user CLAUDE.md):** Every task that creates or edits an `.html` file MUST be executed via the `html-plan-builder` agent. That agent injects an inline review-comment widget into each page. The widget stays during review and is **stripped before deploy** (final task). Do not hand-write HTML in the main thread.

**Goal:** Ship a beautiful static CV + portfolio site to `yuriibabii.github.io` — one landing page plus three case-study pages, calm/warm aesthetic, domain-neutral Lead Android positioning.

**Architecture:** Hand-crafted static HTML/CSS/JS, no framework, no build step. Shared `css/style.css` + `js/main.js` across all pages. GitHub Pages serves repo root. Review widget added by `html-plan-builder` during build, stripped before deploy.

**Tech Stack:** HTML5, CSS (custom properties, fl/grid, `clamp()`), vanilla JS (IntersectionObserver for reveal + count-up), Google Fonts (Fraunces + Inter). No dependencies.

## Global Constraints

- Positioning: **domain-neutral**. Hero title = "Lead Android Engineer". Wellbeing is a personal thread only (About + iFIT), never the site frame.
- Palette (CSS vars): `--bg #FAF8F4`, `--text #2B2A27`, `--sage #6E8B74`, `--clay #C0855F`.
- Fonts: Fraunces (headings), Inter (body), via Google Fonts.
- All motion respects `prefers-reduced-motion` — reveal + count-up show final state immediately when set.
- Light theme only. No dark mode, no backend, no analytics, no build step.
- Public contact email: `yurii.babii.work@gmail.com`. LinkedIn: `linkedin.com/in/yuriibabii`.
- Verified metrics: `8+ yrs`, `12M+ bets`, `~59k bets/min` (Super Bowl), `2.5M users`, `25.3K installs`, `4.9★` (796 ratings, UAdemy).
- Every HTML file: SEO `<title>`+`<meta description>`, Open Graph tags, favicon link, responsive `<meta viewport>`.
- CV download: `assets/cv/Yurii-Babii-CV.pdf` (already in repo).
- Repo already git-initialized at `~/yuriibabii.github.io`; UAdemy screenshots at `assets/img/uademy/`.
- Verification per HTML task: open file in browser (`open <file>`), confirm renders, no console errors, responsive at 375px + 1440px. No unit-test framework.
- Commit after each task.

---

### Task 1: Shared CSS design system

**Files:**
- Create: `css/style.css`

**Interfaces:**
- Produces: CSS custom properties (`--bg`, `--text`, `--sage`, `--clay`, `--muted`, `--maxw`, spacing scale `--s1..--s6`, radius `--r`, shadow `--shadow`); utility classes `.container`, `.section`, `.btn`, `.btn-primary`, `.chip`, `.card`, `.reveal` (initial hidden state), `.reveal.is-visible` (revealed state), `.metric`, `.metric__num`, `.timeline`, `.timeline__item`. Consumed by all HTML tasks + Task 2 JS (toggles `.is-visible`).

- [ ] **Step 1: Write `css/style.css`**

Define, in order:
1. `:root` — all custom properties from Global Constraints + spacing/radius/shadow scale.
2. Reset: `*{box-sizing:border-box;margin:0}`, `html{scroll-behavior:smooth}`, `body{background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;line-height:1.6}`.
3. Headings: `font-family:'Fraunces',Georgia,serif;line-height:1.1;font-weight:600`. Use `clamp()` for `h1`/`h2` sizes.
4. `.container{max-width:var(--maxw,1040px);margin-inline:auto;padding-inline:clamp(1rem,4vw,2rem)}`.
5. `.section{padding-block:clamp(3rem,8vw,6rem)}`.
6. Buttons: `.btn` (pill, border, padding, transition), `.btn-primary{background:var(--sage);color:#fff}`. Hover: subtle lift/opacity.
7. `.chip` — small rounded tag for skills/stack.
8. `.card` — rounded, `box-shadow:var(--shadow)`, hover lift; anchor cards get `text-decoration:none;color:inherit`.
9. `.metric` grid tile; `.metric__num` large Fraunces number.
10. `.timeline` vertical line + `.timeline__item` with dot.
11. Reveal animation: `.reveal{opacity:0;transform:translateY(16px);transition:opacity .6s,transform .6s}` `.reveal.is-visible{opacity:1;transform:none}`.
12. `@media (prefers-reduced-motion:reduce){ .reveal{opacity:1;transform:none;transition:none} html{scroll-behavior:auto} }`.
13. Responsive: grids collapse to 1 col under 640px.

- [ ] **Step 2: Verify**

Run: `open ~/yuriibabii.github.io/css/style.css` (or read back). Confirm no syntax errors — paste into a validator mentally / check braces balance. No visual output yet (no HTML consumes it). Acceptance: all class names in Interfaces block are defined.

- [ ] **Step 3: Commit**

```bash
cd ~/yuriibabii.github.io && git add css/style.css && git commit -m "feat: shared CSS design system (calm-warm palette, reveal, metrics, timeline)"
```

---

### Task 2: Shared JS (scroll reveal + count-up + nav)

**Files:**
- Create: `js/main.js`

**Interfaces:**
- Consumes: `.reveal` elements (Task 1); elements with `data-count="<number>"` and optional `data-suffix`/`data-prefix` (Task 4 metric tiles emit these).
- Produces: on DOMContentLoaded — (a) IntersectionObserver adds `.is-visible` to `.reveal` when 15% in view; (b) count-up animates `data-count` numbers when their tile reveals; (c) mobile nav toggle if `[data-nav-toggle]` present. All gated on `prefers-reduced-motion`: if reduced, immediately set final values + add `.is-visible`, no animation.

- [ ] **Step 1: Write `js/main.js`**

```js
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatNum = (n) => n >= 1000 ? (n % 1000 === 0 ? (n/1000)+'K' : (n/1000).toFixed(1)+'K') : String(n);

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const isFloat = String(target).includes('.') || el.dataset.float === 'true';
    if (reduce) { el.textContent = pre + (isFloat ? target : formatNum(target)) + suf; return; }
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = pre + (isFloat ? val.toFixed(1) : formatNum(Math.round(val))) + suf;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = pre + (isFloat ? target : formatNum(target)) + suf;
    };
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      e.target.querySelectorAll?.('[data-count]').forEach(countUp);
      if (e.target.matches?.('[data-count]')) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  if (reduce) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-count]').forEach(countUp);
  } else {
    document.querySelectorAll('.reveal, [data-count]').forEach(el => io.observe(el));
  }

  const toggle = document.querySelector('[data-nav-toggle]');
  if (toggle) toggle.addEventListener('click', () => document.querySelector('[data-nav]')?.classList.toggle('open'));
});
```

- [ ] **Step 2: Verify**

Read back for syntax. Acceptance: `formatNum(25300)` → `"25.3K"`, `formatNum(12000000)` → not needed (use `data-suffix`). Note: for `12M+` and `59k` use text suffix approach — see Task 4. Confirm reduced-motion branch sets final values.

- [ ] **Step 3: Commit**

```bash
cd ~/yuriibabii.github.io && git add js/main.js && git commit -m "feat: scroll reveal + count-up + nav toggle (reduced-motion safe)"
```

---

### Task 3: `index.html` — hero + nav + footer shell

> **Execute via `html-plan-builder` agent.** Pass it Tasks 3 & 4 content together (one page) OR build hero shell first then extend — agent's choice, but produce full `index.html` by end of Task 4.

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `css/style.css`, `js/main.js`.
- Produces: `index.html` with `<head>` meta (title "Yurii Babii — Lead Android Engineer", description, OG tags, favicon, viewport, Google Fonts links, `css/style.css`), sticky nav (`[data-nav]`, `[data-nav-toggle]`) linking to `#work #experience #skills #about #contact`, hero section, footer, `<script src="js/main.js">` before `</body>`.

- [ ] **Step 1: Build `<head>` + nav + hero**

Head: preconnect + Google Fonts (`Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600`), `<link rel="stylesheet" href="css/style.css">`, OG (`og:title`, `og:description`, `og:type=website`, `og:url=https://yuriibabii.github.io/`, `og:image=assets/og-image.png`), `<link rel="icon">`.

Nav: name left, links right (`Work · Experience · Skills · About · Contact`), hamburger `[data-nav-toggle]` for mobile.

Hero (`.reveal`): `<h1>Yurii Babii</h1>`, tagline "Lead Android Engineer", one-line pitch ("8+ years building reliable, user-centric mobile products — from Super Bowl-scale betting to a founder-led app with 25K+ installs."), location line "Nice, France · Open to Remote (France / Global)", CTA row: `Email` (mailto:yurii.babii.work@gmail.com, `.btn-primary`), `LinkedIn` (`.btn`), `Download CV` (`.btn`, href `assets/cv/Yurii-Babii-CV.pdf`, `download`).

Footer: copyright + repeat contact links.

- [ ] **Step 2: Verify**

Run: `open ~/yuriibabii.github.io/index.html`. Confirm: fonts load, hero renders, nav sticky, CTAs point to correct hrefs, responsive at 375px (hamburger shows). Console clean.

- [ ] **Step 3: Commit**

```bash
cd ~/yuriibabii.github.io && git add index.html && git commit -m "feat: index hero, nav, footer shell"
```

---

### Task 4: `index.html` — metrics, work, timeline, skills, about, contact

> **Execute via `html-plan-builder` agent** (extends the file from Task 3).

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 3 shell, Task 1 classes, Task 2 `data-count` contract.
- Produces: complete landing page; "Selected work" cards link to `case-studies/draftkings.html`, `case-studies/uademy.html`, `case-studies/epicentr.html`.

- [ ] **Step 1: Metrics section** (`#impact`, `.reveal`)

Grid of `.metric` tiles using `data-count` + `data-suffix`:
- `8`+ yrs → `data-count="8" data-suffix="+ yrs"`
- `12M+ bets` → static text `12M+` (too large for count formatter) with label "bets handled"
- `~59K bets/min` → `data-count="59" data-suffix="K/min"` label "Super Bowl peak"
- `2.5M users` → static `2.5M` label "users"
- `25.3K installs` → `data-count="25.3" data-float="true" data-suffix="K"` label "UAdemy installs"
- `4.9★` → `data-count="4.9" data-float="true" data-suffix="★"` label "796 ratings"

(Static tiles: put final string directly in `.metric__num` text, no `data-count`.)

- [ ] **Step 2: Selected work section** (`#work`)

3 primary anchor `.card`s (each `.reveal`):
- **DraftKings** — "Native Android at Super Bowl scale" — 12M+ bets · reliability & on-call → `case-studies/draftkings.html`.
- **UAdemy** — "Founder — built + led remote team of 6 through wartime" — 25.3K installs · 4.9★ → `case-studies/uademy.html`.
- **Epicentr K** — "Built the mobile department ground-up" — Ukraine's largest retailer, ~75 hypermarkets → `case-studies/epicentr.html`.

Secondary compact row: **iFIT** — connected-fitness (BLE, real-time metrics, video streaming) — no link (text card). Note "Earlier: Trinetix, High Marks — cross-platform Xamarin".

- [ ] **Step 3: Experience timeline** (`#experience`, `.timeline`)

`.timeline__item` per role, each `.reveal`, from CV:
- DraftKings — Senior Software Engineer — Oct 2021–Present — native Android reliability at scale.
- Gemplay (UAdemy) — Founder / Lead Developer — Jun 2021–Mar 2023 — founded, led team of 6, 25.3K installs / 4.9★.
- iFIT — Senior Software Engineer — Nov 2020–Mar 2022 — connected fitness, BLE, streaming.
- Epicentr K — Head of Mobile Application Development (Jul 2020–Mar 2021) / Lead Xamarin Developer (Mar–Jul 2020) — built dept.
- Trinetix — Senior Xamarin Developer — May 2017–Mar 2020.
- High Marks — Xamarin Developer — Jan–May 2017.

- [ ] **Step 4: Skills section** (`#skills`) — grouped `.chip` sets

- Android: Kotlin, Jetpack Compose, Coroutines/Flows, MVVM, Redux, Hilt/Dagger, SQL, REST, WebSockets, JUnit, Perfetto.
- CI/CD & Observability: Firebase, Crashlytics, New Relic, Azure, AppCenter, Play Console, App Store Connect, TestFlight.
- AI: Cursor, Claude Code, ChatGPT, Mistral.
- Cross-platform: C#, .NET, Flutter, Dart, Xamarin (Forms / iOS / Android), Supabase, Figma.

- [ ] **Step 5: About section** (`#about`)

Warm short paragraph + list: proud owner of a half-Husky; training for first half-marathon (WHOOP, health protocols); yoga & spiritual growth; lives in calendars/notes/task lists (organization/focus); exploring electronic music. Frame as "human behind the engineering" — leadership signal, not domain lock.

- [ ] **Step 6: Contact section** (`#contact`)

Email `yurii.babii.work@gmail.com` (mailto), LinkedIn, Download CV. Plus columns: Languages (English — Full Professional, French — Basic, Ukrainian — Native, Russian — Fluent); Certifications (Jetpack Compose Masterclass — Philipp Lackner); Education (BSc Computer Software Engineering — Lviv Polytechnic, 2016–2019; Associate's Computer Engineering — Khmelnitsky Polytechnic, 2012–2016).

- [ ] **Step 7: Verify**

Run: `open ~/yuriibabii.github.io/index.html`. Confirm: count-up fires on scroll (8→8+, 59→59K/min, 25.3K, 4.9★), static tiles show 12M+/2.5M, all 3 work cards link correctly, timeline renders, chips wrap, responsive 375/1440, console clean. Toggle OS reduced-motion → values appear instantly.

- [ ] **Step 8: Commit**

```bash
cd ~/yuriibabii.github.io && git add index.html && git commit -m "feat: index metrics, work, timeline, skills, about, contact"
```

---

### Task 5: Case study — UAdemy (`case-studies/uademy.html`)

> **Execute via `html-plan-builder` agent.** Has real screenshots — richest page. Build first of the three to lock the shared case-study layout.

**Files:**
- Create: `case-studies/uademy.html`

**Interfaces:**
- Consumes: `../css/style.css`, `../js/main.js` (note `../` — one dir deep).
- Produces: reusable case-study structure (hero → context → what I did → impact → screenshots → tech → back link) that Tasks 6 & 7 replicate.

- [ ] **Step 1: Build page**

Head: title "UAdemy — Case Study — Yurii Babii", meta description, OG, `../css/style.css`, fonts, `<link rel="icon" href="../assets/...">`. Back link `← Yurii Babii` → `../index.html`.

- **Hero:** "UAdemy" · role "Founder / Lead Developer" · "Jun 2021 – Mar 2023" · stack chips (Flutter, Dart, Supabase, iOS/TestFlight). Sub: "A Ukrainian knowledge app — built and led a remote team of 6 through wartime constraints."
- **Context:** why it existed (Ukrainian history/culture quiz app during the war), constraints (remote team, wartime, wellbeing of team).
- **What I did:** founded & led team of 6; set coding guidelines, branching strategy, incident playbooks; owned release train (TestFlight → App Store); instrumentation (metrics/log/trace taxonomy, dashboards, alerting via New Relic/Crashlytics/AppCenter); shipped iOS app end-to-end.
- **Impact** (`.metric` tiles): `25.3K` total downloads, `4.9★` (796 ratings), `6` team led, current build shipping (1.3.8). Cite "App Store Connect, Jul 2026".
- **Screenshots** (`.reveal`, framed): `../assets/img/uademy/appstore-preview.png` (App Store listing), `../assets/img/uademy/analytics-25k.png` (downloads chart), `../assets/img/uademy/ratings-49.png` (4.9★ / 796). Add `alt` + short captions. Use `loading="lazy"`, `max-width:100%`.
- **Tech callouts:** Flutter/Dart shared layer; Supabase backend; release/observability stack.

- [ ] **Step 2: Verify**

Run: `open ~/yuriibabii.github.io/case-studies/uademy.html`. Confirm: CSS/JS load via `../`, 3 images render + lazy-load, metric tiles count up, back link works, responsive. Console clean.

- [ ] **Step 3: Commit**

```bash
cd ~/yuriibabii.github.io && git add case-studies/uademy.html && git commit -m "feat: UAdemy case study (real App Store metrics + screenshots)"
```

---

### Task 6: Case study — DraftKings (`case-studies/draftkings.html`)

> **Execute via `html-plan-builder` agent.** Mirror Task 5 layout. No screenshots yet — design must look complete without them (use metric tiles + text callouts).

**Files:**
- Create: `case-studies/draftkings.html`

**Interfaces:**
- Consumes: `../css/style.css`, `../js/main.js`, layout pattern from Task 5.

- [ ] **Step 1: Build page**

Same structure/head pattern as Task 5 (adjust title "DraftKings — Case Study — Yurii Babii").
- **Hero:** "DraftKings" · "Senior Software Engineer" · "Oct 2021 – Present" · stack chips (Kotlin, Jetpack Compose, Coroutines/Flows, MVVM, WebSockets, Perfetto). Sub: "Native Android reliability at Super Bowl scale."
- **Context:** shift from cross-platform to native Android; high-stakes, high-scale real-money betting.
- **What I did:** hardened reliability + on-call response; performance/observability; operated under peak load; native Android craft (Compose, coroutines, real-time via WebSockets).
- **Impact** (tiles): `12M+` bets, `2.5M` users, `~59K` bets/min (Super Bowl peak). Label as production scale.
- **No-screenshot block:** replace image section with a styled "Highlights" callout grid (reliability, on-call, scale, real-time) — placeholder-free, looks intentional.
- **Tech callouts:** Compose UI, coroutines/flows concurrency, WebSockets real-time, Perfetto profiling.

- [ ] **Step 2: Verify** — `open` file, confirm renders complete without images, tiles count up, back link + `../` assets work, responsive.

- [ ] **Step 3: Commit**

```bash
cd ~/yuriibabii.github.io && git add case-studies/draftkings.html && git commit -m "feat: DraftKings case study (scale + reliability)"
```

---

### Task 7: Case study — Epicentr K (`case-studies/epicentr.html`)

> **Execute via `html-plan-builder` agent.** Mirror Task 5 layout, no screenshots.

**Files:**
- Create: `case-studies/epicentr.html`

**Interfaces:**
- Consumes: `../css/style.css`, `../js/main.js`, layout from Task 5.

- [ ] **Step 1: Build page**

Same pattern (title "Epicentr K — Case Study — Yurii Babii").
- **Hero:** "Epicentr K" · "Head of Mobile Application Development / Lead Xamarin Developer" · "Mar 2020 – Mar 2021" · chips (Xamarin, C#, .NET, CI/CD). Sub: "Built the in-house mobile department from the ground up — Ukraine's largest retailer (~75 hypermarkets)."
- **Context:** no mobile dept existed; needed architecture, standards, team, delivery pipeline.
- **What I did:** launched in-house apps department; set architecture & coding standards; put CI/CD + release trains in place; hired & mentored the team; shipped multiple internal apps.
- **Impact** (tiles/callouts): `~75` hypermarkets served, department built `0→1`, team hired & mentored, `multiple` internal apps shipped.
- **Highlights callout** (no images): org-building, standards, CI/CD, mentorship.
- **Tech callouts:** Xamarin cross-platform, CI/CD & release trains.

- [ ] **Step 2: Verify** — `open`, confirm complete render, tiles, back link, responsive.

- [ ] **Step 3: Commit**

```bash
cd ~/yuriibabii.github.io && git add case-studies/epicentr.html && git commit -m "feat: Epicentr K case study (built mobile dept ground-up)"
```

---

### Task 8: SEO assets + favicon + OG image

**Files:**
- Create: `sitemap.xml`, `robots.txt`, `assets/favicon.svg`, `assets/og-image.png` (or `.svg`)

**Interfaces:**
- Consumes: final URL set (index + 3 case studies).
- Produces: crawlable metadata; favicon + OG image referenced by all pages' `<head>` (verify links match filenames).

- [ ] **Step 1: `robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://yuriibabii.github.io/sitemap.xml
```

- [ ] **Step 2: `sitemap.xml`** — list `https://yuriibabii.github.io/`, `/case-studies/uademy.html`, `/draftkings.html`, `/epicentr.html` with `<loc>` entries.

- [ ] **Step 3: `assets/favicon.svg`** — simple monogram "YB" on `--sage` circle, warm palette. Link in every page head (`<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">`; case studies use `../assets/...`).

- [ ] **Step 4: `assets/og-image.png`** — 1200×630 social card: name, "Lead Android Engineer", warm bg. If PNG generation not available, use a `.svg` og-image and update meta refs. Ensure `<head>` `og:image` filenames match what exists.

- [ ] **Step 5: Verify** — `open sitemap.xml` (well-formed XML), favicon shows in browser tab, OG image opens. Confirm no page references a missing asset (grep each html for `og:image`/`icon` hrefs, check files exist).

- [ ] **Step 6: Commit**

```bash
cd ~/yuriibabii.github.io && git add sitemap.xml robots.txt assets/favicon.svg assets/og-image.* && git commit -m "feat: SEO (sitemap, robots), favicon, OG image"
```

---

### Task 9: Strip review widgets + deploy to GitHub Pages

> **Security/deploy — execute carefully, confirm each step.**

**Files:**
- Modify: all `.html` files (remove review widget markup/scripts injected by html-plan-builder)

**Interfaces:**
- Consumes: all pages complete.
- Produces: clean public site live at `https://yuriibabii.github.io/`.

- [ ] **Step 1: Strip widgets**

Use `html-plan-builder` agent (it owns the widget) OR grep for the widget markers and remove them. Verify: `grep -ril "review" ~/yuriibabii.github.io/*.html ~/yuriibabii.github.io/case-studies/*.html` returns nothing widget-related. Re-open each page — must render identically minus the widget.

- [ ] **Step 2: Commit clean pages**

```bash
cd ~/yuriibabii.github.io && git add -A && git commit -m "chore: strip review widgets for production"
```

- [ ] **Step 3: Create GitHub repo + push** (requires user's GitHub auth — use git-expert agent or gh CLI)

```bash
cd ~/yuriibabii.github.io
gh repo create yuriibabii.github.io --public --source=. --remote=origin --push
```
(If `gh` not authed, user runs `! gh auth login` in session first.)

- [ ] **Step 4: Enable Pages** — repo Settings → Pages → Source: `main` branch, root. (Or `gh api` to set.) User confirms.

- [ ] **Step 5: Verify live** — after ~1 min, open `https://yuriibabii.github.io/`. Confirm all pages, assets, CV download, fonts load over HTTPS. No widget visible. Test on mobile viewport.

- [ ] **Step 6: Final commit** (if any tweaks)

```bash
cd ~/yuriibabii.github.io && git add -A && git commit -m "chore: deploy CV+portfolio site" || echo "nothing to commit"
```

---

## Self-Review

**Spec coverage:** Hero ✓(T3) · metrics ✓(T4.1) · selected work+iFIT ✓(T4.2) · timeline ✓(T4.3) · skills ✓(T4.4) · about ✓(T4.5) · contact+langs/certs/edu ✓(T4.6) · 3 case studies ✓(T5–7) · calm palette/fonts/reveal ✓(T1–2) · reduced-motion ✓(T2) · SEO/OG/favicon/sitemap ✓(T8) · static/no-build ✓ · widget strip before deploy ✓(T9) · GitHub Pages ✓(T9) · verified metrics (25.3K/4.9★/796) ✓(T4,T5) · email ✓(T3,T4.6).

**Placeholder scan:** DraftKings/Epicentr have no screenshots by design — handled with explicit "Highlights callout, no images" blocks (T6.1, T7.1), not TODOs. OG-image PNG generation has a `.svg` fallback (T8.4). No open TODOs.

**Type/name consistency:** class names + `data-count`/`data-suffix`/`data-float` contract consistent between T1, T2, T4, T5. Case-study asset paths use `../` (T5–7). Work-card hrefs match case-study filenames (T4.2 ↔ T5/6/7).
