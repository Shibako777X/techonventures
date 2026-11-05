# Migration notes

## Scope

The original single-page document is rendered as a React element tree from the source body markup. Its original HTML node hierarchy, class names, copy, links, inline styles, image URLs, and inline SVG marks are preserved. The source CSS is copied byte-for-byte and imported as the only global stylesheet.

## Section and component map

- Header and mobile menu: original header/mobile-menu markup in `index.html` (lines 25–51); behavior in `script.js` (lines 37–41).
- Hero and statement: `index.html` lines 54–131; `updateHero()` and `splitWords()` in `script.js`.
- Before/after comparison: `index.html` lines 133–163; `updateCompare()`.
- Services and stacked service cards: `index.html` lines 165–338; `updateStack()`.
- Process phases: `index.html` lines 339–399; `setPhase()` and `startPhases()`.
- Team: `index.html` lines 400–470; member-row click behavior.
- Testimonials: `index.html` lines 471–517; active-card click behavior.
- Stats: `index.html` lines 518–555; IntersectionObserver reveal and count-up.
- Case study: `index.html` lines 556–596; reveal and count-up.
- Pricing: `index.html` lines 597–657; `renderPlan()` and `setPrice()`.
- FAQ: `index.html` lines 658–684; `renderFaq()` and delegated accordion behavior.
- Insights: `index.html` lines 685–710.
- Contact form: `index.html` lines 711–783; front-end form validation.
- Footer and subscribe form: `index.html` lines 785–835; footer reveal, copy-email feedback, and subscribe validation.
- Video modal: `index.html` lines 836–842; open/close and Escape behavior.

## Scroll and animation behavior

`script.js` uses one requestAnimationFrame-coalesced scroll/resize update loop. It updates header classes at scrollY 40 and 120; hero progress and word states; comparison transforms; reveal-word progress; stacked service cards; and footer `--fp`. The native CSS `scroll-behavior: smooth` rule remains in `styles.css`. IntersectionObserver retains threshold `0.15` and root margin `0px 0px -40px 0px`. Count-up duration is 1800 ms, process rotation is 5000 ms, odometer digit delay is 70 ms, and copied-email feedback is 1600 ms. Other easing, ranges, and offsets are ported from their original functions. All listeners, observers, timers, and animation frames are cleaned up when the page unmounts.

## External resources

- Google Font: Manrope, weights 300–800, using the original preconnect and stylesheet tags.
- Icons: lucide-react 0.453.0, matching original Lucide UMD 0.453.0 icon names and default 24px/2 stroke settings.
- Images: original Picsum and Random User remote URLs retained.
- No other external script library is used.

## Known issues in original (not fixed)

Header links `#About`, `#Services`, `#Portfolio`, and `#Blogs` do not match existing IDs. The source also has case/target mismatches (`#Services` vs `#services`) and `#View Portfolio` does not target an existing ID. These anchors are preserved exactly as requested.

## Differences / risks

The body markup is translated from the original HTML into React elements by a small DOM-to-React mapper. SVG and inline style attributes require React-compatible property names, while the rendered DOM structure remains the same. The static HTML content is kept in `app/src/page.html` as the conversion source.
