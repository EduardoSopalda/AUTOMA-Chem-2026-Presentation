# Changelog

Newest first. A two minute read.

## 26 September 2026 (the cut and the Congresso)

* **Your Congresso drawing** replaces the placeholder in Acts 2 and 7, and feeds the Act 7 to 8 handoff. Five duplicated plinth lines and a doubled tower top were removed. The tower outline is split into two towers for the handoff. It is anchored on the joint line, so Brasília's monumental axis runs straight up between the towers.
* **The cut script is the script of record** (`docs/AUTOMA-Chem-2026-Script-CUT.md`, 1,302 spoken words by my count, all five sacred lines). Every click is anchored to its exact words. The presenter view shows the passage to speak, its word count and its budget.
* **New act budgets,** totalling 9:55. Each click has its share by word count, until the recording arrives.
* **Three clicks where the speech and the drawing don't line up yet** are listed in the storyboard for your decision.

## 26 September 2026 (later): Edu's review

* Act 6 glossary now reads "batch: one production run, from charge to discharge."
* The eight meanings of "batch" are at 44 px, on a wider fan.
* The 10,000 field reads as documents under projector simulation: every point is a tiny page, and the pale waste keeps at least 30%.
* **Real handoffs:** the Congresso's towers morph into the plant and its twin (Act 7 to 8). The Act 1 lineage diagram re-forms into Brasília (Act 1 to 2).

## 26 September 2026 (late night): Phase 5 first pass

* **All nine acts and the coda are drawn.** No placeholders are left. The run through is in `frames/out/run-through.png`, with the projector version beside it.
* **The cover** is now SVG, built from the same geometry as the Brasília plan in Acts 2 and 9. It draws itself (copper, then blueprint) and un-draws line by line.
* **Real material:** your wall section (Act 1), your elevation and photograph (Act 9), and your nursery school plan taken from the vector PDF's own lines (Act 9).
* **Performance:** a steady 60 frames a second on this Mac, including the 10,000 points. To repeat on the venue laptop.
* **Still placeholder:** the Congresso geometry, until your drawing arrives. Timings inside each click are budgets until the cut script and recording arrive.
* **Tools:** `node tools/shots.mjs <clicks>`, `node tools/film.mjs <click>`, `node tools/perf.mjs`, `npm run stagetest`.

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
