# Skill 07 — Workflow & Verification

## Work order (follow every time)
1. **Read** `AGENTS.md` + relevant skill files.
2. **Inspect** the original files for the exact thing being built.
3. **Plan** in 3–8 bullets: files to create/edit, what's ported from where. Wait for confirmation only if the task is large or ambiguous.
4. **Build** the smallest slice that works.
5. **Verify** against the original (checklists in skills 01, 03, 06).
6. **Report** using the output format in `AGENTS.md`.

## Recommended migration order
1. Project setup (Vite, router, fonts in `index.html`, global CSS imported in original order)
2. Layout: Header + Footer + `Layout` + mobile menu
3. Scroll system (`ScrollManager`) — smooth scroll + header shift behavior
4. Home page sections, one at a time, each verified
5. Remaining pages, one at a time
6. Global polish only if requested: SEO tags, 404, performance — never visual changes

## Permission rules
Ask before:
- Installing any dependency
- Deleting or renaming files
- Changing the build config, folder structure, or lint rules
- Touching anything outside the requested scope
- Deviating from the original in any visible way

## Git hygiene
- One logical change per commit, clear message: `feat(header): port header with scroll-shift behavior`
- Never commit secrets, `.env`, or build output.
- Don't rewrite history or force-push.

## Self-review before reporting
- [ ] Builds without errors/warnings (`npm run build`)
- [ ] Lint passes
- [ ] No console errors in dev
- [ ] Compared with original at 4 widths
- [ ] Animations/scroll verified (skill 06 checklist)
- [ ] No unrelated files modified (`git diff --stat` reviewed)
- [ ] Every deviation listed honestly in the report

## If you're stuck or unsure
Stop. State what you found in the original, what's blocking you, and 1–2 options. Do not improvise.
