# Skill 06 — Animation, Smooth Scroll & Custom JS Port

This is the most fragile part of the migration. **Port behavior, don't reinterpret it.**

## Step 1 — Read & document the original JS
Open the custom JS file and write a behavior map (in `MIGRATION_NOTES.md`) for every feature:
- Smooth scroll (library or custom? lerp factor? duration? easing? wheel/touch handling?)
- Scroll-linked effects (parallax, header shift/hide/shrink, progress bars, element shifting)
- Reveal-on-scroll (trigger point/threshold, once vs repeat, stagger delays, initial states)
- Hover/cursor effects, magnetic buttons, custom cursor
- Menu open/close, sliders, tabs, accordions, counters, preloader/page transitions
- Event types used (scroll, wheel, resize, mousemove, IntersectionObserver, requestAnimationFrame)
- Magic numbers: offsets, thresholds, delays, breakpoints. **Copy them exactly.**

## Step 2 — Port as framework-friendly modules
Keep the original algorithm and numbers. Change only the *plumbing*:

| Original | React equivalent |
|---|---|
| `document.querySelector` on load | `useRef` / scoped query inside a ref'd container |
| `DOMContentLoaded` / `load` | `useEffect` on mount (plus `window.load` handling if assets matter) |
| Global listeners | Added in `useEffect`, removed in cleanup |
| Library init (Lenis, GSAP, AOS…) | Single instance created in one place (e.g. `ScrollManager`), destroyed on unmount |
| Class toggles (`.active`, `.is-visible`) | Same class names toggled via refs or state — **CSS stays unchanged** |

- Put ported logic in `src/lib/` (pure functions) and `src/hooks/` (React wiring).
- Annotate: `// Ported from script.js → initHeaderShift()`.

## Step 3 — Critical React pitfalls
- **StrictMode double mount:** init must be safe to run twice; cleanup must fully destroy (kill RAF, remove listeners, `lenis.destroy()`, `ScrollTrigger.kill()`, disconnect observers).
- **One RAF loop** for scroll/animation. Never create a new loop per component.
- **Route changes:** after navigation, reset scroll to 0 (or hash target) through the smooth-scroll instance (not `window.scrollTo` if it fights the library), refresh scroll triggers, re-observe new elements, close menus.
- **Reveal animations:** keep the original initial-state CSS (e.g. `opacity:0; transform:…`) and the original trigger logic. Don't replace with Framer Motion/AOS/etc. unless told.
- **Don't re-render animated elements** needlessly: animation state lives in refs/classList, not React state, so React re-renders can't reset it.
- **Resize/refresh:** keep original debounce/throttle values.
- **Images & fonts:** if the original measured positions after `window.load`, do the same (refresh after assets load).
- **Reduced motion:** if the original respected `prefers-reduced-motion`, keep it. Don't add or remove it on your own.

## Step 4 — Verify against the original
Run both sites side by side and compare:
- [ ] Scroll feel: inertia, speed, easing, stop behavior (wheel, trackpad, touch, keyboard, anchor links)
- [ ] Header behavior on scroll (shift/hide/shrink) at the same scroll positions
- [ ] Reveal timing, order, stagger, and direction
- [ ] Parallax/shift elements move at the same rate
- [ ] No jank, double-trigger, or jump after route change
- [ ] Works after hot reload and after navigating Home → Page → Home
- [ ] No memory leaks (listeners/RAF stay constant when navigating repeatedly)

## Never
- Replace the custom scroll with `scroll-behavior: smooth` or another library
- Change easing curves, durations, thresholds, or delays
- "Optimize" or "clean up" the original algorithm
- Add animations to elements that weren't animated
- Remove an animation because it's hard to port — **ask instead**
