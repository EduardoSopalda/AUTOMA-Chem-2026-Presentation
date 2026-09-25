# Changelog

Newest first. A two minute read.

## 26 September 2026 (night)

* **Phase 4 engine** built: Vite, TypeScript and GSAP. One continuous sheet, 43 clicks plus the cover. Forward animates, and back or jump rebuilds exactly.
* **Stage proof:** `dist/index.html` is one self contained file that opens with a double click. The `?check` preflight passed: fonts, images, first scene in 77 ms, all beats rebuild, no network calls.
* **Presenter window** (P): now, next, cue list, and timers against the ten minute and per act budgets. It forwards the clicker to the deck.
* **Protected silences** enforced in the engine for "You cannot report what you cannot trace.", the unfinished twin, and "Humans do. Always."
* **Cover** moved onto the brand palette, bottom row clears the frame rule, figure added, question placed small at the bottom right.
* The acts are placeholders showing their on screen words, so timing can be rehearsed now. Phase 5 replaces them with the drawings.

## 26 September 2026

* **Phase 3 style frames** in `frames/out/`: the cover, Act 5 and Act 8, each normal and under projector simulation, plus a contact sheet. Rebuild them with `npm run frames`.
* **Master figure** drawn as SVG: `assets/figure/figure.svg`, arms at his sides as on the cover.
* **DM Sans** self hosted in `fonts/` (Open Font License). Source Sans 3 is still used by `index.html` until the engine replaces it.
* **Living title block** designed. Its labels moved to ink after the projector test washed out the grey.
* **Storyboard decisions** of 26 September recorded.

## 25 September 2026

* **Storyboard drafted** (`STORYBOARD.md`): 43 clicks across nine acts and the coda, budgeted to 9:50. Waiting for Edu's review and the cut script.
* **Act 5 figures verified** in the dsm-firmenich Integrated Annual Report 2025. All four on screen figures are confirmed, and the Scope 2 location based figure now comes from the report itself. See `notes/sources.md`.
* **Cover layers cleaned.** Hidden colour data, including Edu's name, removed from the transparent pixels of `layers/field.png` and `layers/search.png`. They look identical on paper.
* **Figure reference added:** `assets/figure/figure-reference.jpg`.
* **CLAUDE.md section 5c** records Edu's decisions after Phase 1.
* **Source files organised** into `assets/brand`, `assets/architecture` and `docs`.
