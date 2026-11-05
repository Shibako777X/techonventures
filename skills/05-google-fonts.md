# Skill 05 — Google Fonts & Typography

## Rule #1
Use **exactly** the font families, weights, and styles the original site uses. Find them in the original `<link>` tags, `@import` rules, and `font-family` / `font-weight` declarations.

## Inventory first
List: family name, every weight (100–900), italic or not, where each is used (headings, body, buttons, nav), and fallback stacks. Copy fallback stacks exactly.

## Loading — pick one, in this order
1. **Same as original** (e.g. `<link>` to Google Fonts) — move the identical `<link>` + `preconnect` tags into `index.html` `<head>` of the Vite app.
2. **Self-hosted** (preferred for performance/privacy, only if the user approves): download the files, place in `src/assets/fonts/`, write `@font-face` with the same family name.
   ```css
   @font-face {
     font-family: "Poppins";
     src: url("/fonts/Poppins-Regular.woff2") format("woff2");
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```
Do not switch between the two without asking.

## Google Fonts link pattern (when keeping the CDN)
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=FAMILY:wght@400;500;700&display=swap" rel="stylesheet" />
```
- Request only the weights actually used. No extra weights "just in case".
- Always `display=swap`.
- Keep the original `font-family` CSS declaration untouched.

## Don'ts
- No font substitutions, "similar" fonts, or pairing suggestions
- No changes to font sizes, line-height, letter-spacing, or weights
- Don't load fonts inside React components or via JS
- Don't add fonts for icons (that's skill 04)

## Check
- No layout shift when fonts load (same fallback stack as original)
- DevTools → Network: only the needed font files load
- Rendered text matches the original at all breakpoints
