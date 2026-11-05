# Skill 01 — Migration Fidelity (Legacy Preservation)

**Goal:** the React site is visually and behaviorally indistinguishable from the original.

## Before writing any code
1. Read the original `index.html` (and the page being migrated), ALL linked CSS files, and the custom JS file(s) fully.
2. Produce a short **inventory** (in your reply or a `MIGRATION_NOTES.md`):
   - Sections/components found (header, hero, footer, cards, modals, sliders…)
   - CSS files and what each controls
   - JS behaviors: smooth scroll, scroll-triggered reveals, parallax, sticky/shift header, cursor effects, counters, menus, sliders, preloader
   - External libraries loaded (CDN scripts, jQuery, GSAP, Lenis, AOS, Swiper…) with versions
   - Fonts, icons, images, and asset paths
3. Map every original section → a React component. Confirm the mapping before large builds if unsure.

## Porting rules
- **Keep the original CSS.** Copy it into the React project (global stylesheet or CSS modules/per-component file) with selectors, class names, variables, media queries, keyframes, and values unchanged.
- **Keep class names and DOM structure** identical unless a React requirement forces a change (`class` → `className`, `for` → `htmlFor`, self-closing tags, camelCase SVG attributes, inline `style` objects). Wrapper elements that alter layout are NOT allowed.
- **Keep the CSS cascade order.** Import stylesheets in the same order as the original `<link>` tags.
- **Keep CSS variables, breakpoints, and units** exactly as written (don't convert px→rem, don't "clean up").
- **Keep assets** with the same filenames and relative structure (move to `public/` or `src/assets/` consistently).
- **Keep copy, alt text, links, and SEO tags** (title, meta, OG tags) — move them to the router/head handling without changes.
- **Keep the same library versions** the original used.
- **No visual "fixes".** If you notice a bug or inconsistency in the original, do NOT fix it silently — list it under "Differences / risks" and ask.

## Don'ts
- Don't convert to Tailwind, styled-components, or any new styling system.
- Don't "modernize" CSS (no replacing floats/flex/grid choices, no new resets).
- Don't merge or split CSS files in ways that change specificity.
- Don't add placeholder content or lorem ipsum.
- Don't change image sizes, aspect ratios, object-fit, or lazy-loading behavior.

## Definition of done (per component/page)
- Side-by-side with the original at 1440, 1024, 768, 375 px widths: no visible difference.
- All hover/focus/active states match.
- Every animation and scroll behavior matches (see skill 06).
- No console errors or warnings.
