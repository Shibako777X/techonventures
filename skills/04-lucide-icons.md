# Skill 04 — Icons (Lucide React)

## When to use Lucide
- Use `lucide-react` **only** for icons that are new, or when the original used an icon library that maps cleanly to Lucide AND the user approved the swap.
- If the original uses **Font Awesome, SVG files, or inline SVGs**, keep them exactly (inline SVG as a component, or the same icon font). Do NOT replace them with Lucide on your own — this would change the design.
- Ask once at project start: "Do you want original icons kept 1:1, or mapped to Lucide?" and follow the answer for the whole project.

## Install & import
```bash
npm i lucide-react
```
```jsx
import { ArrowRight, Menu, X } from "lucide-react";   // named imports only
<ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
```
- Named imports only (tree-shaking). Never `import * as Icons`, never dynamic string lookup of icon names.

## Matching the original look
- Match the original icon **size, stroke weight, and color**. Defaults: Lucide is 24px with `strokeWidth` 2 — adjust via props to match the original.
- Color: inherit via `currentColor` (default). Set color in CSS using the original's class, not via the `color` prop, unless the original did so.
- Don't mix filled and outline styles. Lucide is outline; if the original has filled icons, keep the original SVGs.

## Accessibility
- Decorative icon next to text: `aria-hidden="true"`.
- Icon-only button: put `aria-label` on the **button**, icon stays `aria-hidden`.
- Never use an icon as the only indicator of state (add text or aria attributes).

## Structure
- Wrap repeated icon usage in a tiny component only if the original had a repeated wrapper element (e.g. `<span class="icon-circle">`). Keep the same wrapper class.
- Keep a `src/components/ui/icons.js` only if mapping many original icons to Lucide — a plain object of named imports (not strings).

## Never
- Add decorative icons that weren't in the original
- Use emoji as icons
- Change icon meaning (e.g. swapping a phone icon for a chat icon)
