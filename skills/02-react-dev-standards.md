# Skill 02 — React Development Standards

Write code like a senior engineer: predictable, boring, readable.

## Stack (unless told otherwise)
- **Vite + React** (JavaScript or TypeScript — match what the project already uses)
- **React Router** for pages
- **Plain CSS** carried over from the original (global + per-component files)
- No new dependencies without asking. If one is needed, name it, say why, and wait for approval.

## Folder structure
```
src/
  assets/          images, fonts, svgs (same names as original)
  styles/          original CSS files, ported 1:1 (variables, base, components)
  components/
    layout/        Header, Footer, Layout, ScrollManager
    ui/            Button, Card, Section, Modal (reusable pieces)
    sections/      Hero, About, Services, etc. (page sections)
  pages/           Home, About, Contact… (one file per route)
  hooks/           useScrollReveal, useSmoothScroll, useMediaQuery…
  lib/             ported utility functions from the original JS
  App.jsx
  main.jsx
```

## Component rules
- One component per file, `PascalCase.jsx`, default export, named after the file.
- Components are small and single-purpose. If a file passes ~200 lines, split it.
- Static content that repeats (cards, nav items, footer links) → data array + `.map()` with a stable `key` (never array index if the list can change).
- Props are explicit and minimal. No prop drilling beyond 2 levels — use a small context only if truly needed.
- No business logic inside JSX. Extract handlers and effects above the return.
- No inline styles unless the original used inline styles.
- Accessible by default: semantic tags, `alt` on images, `aria-label` on icon-only buttons, visible focus, keyboard-operable menus.

## DOM & effects
- **Never** use `document.querySelector` to grab elements React owns. Use `useRef`.
- Every `useEffect` that adds listeners, observers, timers, RAF loops, or library instances **must clean up** in its return function.
- Code must survive React **StrictMode** double-mounting (effects run twice in dev): initialization must be idempotent and cleanup must fully undo it.
- Don't put scroll listeners in many components — centralize in one hook/manager (see skill 06).
- Use `useLayoutEffect` only when measuring layout before paint is required.
- Avoid `dangerouslySetInnerHTML` unless the original content is raw HTML that must be preserved.

## Routing
- Header/Footer live in a `Layout` component wrapping `<Outlet />`.
- On route change: scroll to top (or to hash target), re-init scroll/animation systems, close mobile menu.
- Active nav link uses `NavLink` and the **same active class** the original used.

## Code style
- ESLint + Prettier config already in the project is the standard. Don't reformat unrelated files.
- Descriptive names. No abbreviations like `tmp`, `data2`, `x`.
- Comments only to explain *why*, plus a one-line `// Ported from script.js: <function name>` on ported logic.
- No `console.log` left behind. No commented-out dead code.
- No TODOs without telling the user.

## Performance
- Don't add `React.memo`/`useMemo`/`useCallback` speculatively. Only when there's a measured need.
- Keep original lazy-loading behavior for images. Route-level `React.lazy` only if asked.
