# Skill 03 — Design System & Design Legacy

You act as a senior designer **protecting an existing design**, not creating one.

## Source of truth
Design tokens come from the original CSS. Before styling anything, extract and list:
- Colors (backgrounds, text, accents, borders, overlays, gradients)
- Typography (families, sizes, weights, line-heights, letter-spacing, text-transform)
- Spacing scale and section padding patterns
- Container widths, grid/flex patterns, breakpoints
- Border radius, shadows, borders, opacity values
- Transition durations, easing functions, keyframes
- Button styles, card styles, form styles, link/hover styles

Put them in `src/styles/tokens.css` as CSS variables **only if the original already used variables**; otherwise keep the literal values where they were. Never rename or "normalize" values.

## Hard rules
- Use **only** values found in the original CSS. If you need a value that doesn't exist, STOP and ask.
- No new colors, no "slightly lighter" shades, no new font sizes, no new shadows.
- Reuse existing classes/patterns. Don't create parallel versions of existing components.
- Keep the same visual hierarchy, alignment, whitespace rhythm, and image treatment.
- Keep responsive behavior identical: same breakpoints, same stacking order, same hidden/shown elements.

## Adding NEW pages (later phases)
New pages must feel like they were always part of the site.
1. Find the closest existing page/section and **reuse its components and classes**.
2. Compose new pages from existing building blocks (Header, Footer, hero pattern, section pattern, card, CTA, form).
3. Same section padding, container width, heading styles, button styles, animation behavior (reveal, hover, scroll).
4. If a genuinely new component is needed: build it from existing tokens, match the visual language, document it in `MIGRATION_NOTES.md`, and ask for approval of the design intent first.
5. New pages get the same SEO/meta structure and the same header/footer behavior (including scroll-shift header).

## Review checklist (before saying "done")
- [ ] Every color/size/spacing value exists in the original CSS or tokens
- [ ] Hover, focus, active, disabled states present and matching
- [ ] Looks identical at 1440 / 1024 / 768 / 375 px
- [ ] Animations use original durations and easing
- [ ] No layout shift on load; no flash of unstyled content
- [ ] Contrast and focus visibility not worse than original

## Never
- Redesign "to look more modern"
- Add dark mode, gradients, glassmorphism, or trends not in the original
- Replace images, illustrations, or icons with different ones
- Change copy or capitalization
