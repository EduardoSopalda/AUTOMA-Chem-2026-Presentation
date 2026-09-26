# Handover: From Brasília to the Plant Floor

One page, for whoever continues this work. Written 27 September 2026.

## The talk
* AUTOMA Chem 2026, Estrel Berlin. Opening panel, Monday 26 October, 9:40 to 9:50. **Ten minutes, hard limit.** About 250 heads of automation, digital and AI from Europe's largest chemical companies.
* Speaker: Eduardo Sopalda, D&T · Global Data Governance Lead, dsm-firmenich.
* Argument: we design data and AI governance from above, like a planned city (Brasília), and it fails when it meets the people at ground level. Technology without human judgement fails; partnership works.
* **Stage ready by 3 October; to the organisers before 5 October.**

## Source of truth
* **Script:** `docs/AUTOMA-Chem-2026-Script-CUT.md` (1,302 spoken words). Never rewrite; Edu approves every word. Sacred lines: "I am an architect. Not as a metaphor." · "Built by people who could not afford to live in it." · "You cannot report what you cannot trace." · "We have simply built another Brasília." · "Agents do not own risk. Humans do. Always."
* **Visual direction:** the ten panel storyboard, `assets/storyboard/board-2048.png`. Never redraw or restyle the art.
* **The bar for richness:** Edu's finished opening slide, `cover-original/` (eight layers; open `cover-original/index.html`).
* **Brand:** `assets/brand/AUTOMA-Chem-2026-Art-Branding.pdf`. Paper #F3DDC0, copper #762F0B, blueprint #5F92B8, ink #0F0F11, blue text #365F7C. Source Serif 4 and DM Sans.

## Rules Edu has set
* **The deck follows him.** He is a storyteller and never recites. One click per idea (about 20 to 27). Nothing inside a click lasts more than about 4 seconds; then the drawing waits.
* **Three protected silences:** "You cannot report what you cannot trace." · the unfinished dashed twin · "Humans do. Always." (five seconds).
* **The figure** (the drawn man) stays fixed at bottom centre, except in Act 9, when the plan descends to meet him.
* **Locked camera:** no zoom, pan or scroll. The drawing moves; the composition does not.
* **No hyphens or dashes in on screen text.** Few words, large serif.
* **Presenter view on stage:** one keyword, the next keyword, the clock. Three checkpoints: end of Act 4 at 4:45, start of Act 8 at 7:20, finish at 9:55.
* **Runs offline from one file** on a USB stick. No service worker, no network.
* **Pre-show:** Edu's Kling video loops until his first click.
* **Rights:** never trace Lúcio Costa's pilot plan or show Niemeyer's own drawings; the Congresso is Edu's drawing (`assets/architecture/congresso-nacional.svg`). Panels 1 and 3 of the board currently carry Costa-style layouts and labels ("Eixo Monumental", "Asa Norte", "Lago Paranoá"); review before stage.
* **Facts:** every number on screen is live type and verified in `notes/sources.md` (11,002 kt CO2e, 93%, 140 kt and 464 kt, from the dsm-firmenich Integrated Annual Report 2025).

## Edu's real material (never generated)
Wall section, elevation and photograph (`assets/architecture/`), the nursery school plan for 72 children (vector lines in `assets/architecture/nursery-plan-lines.svg`), the Congresso drawing.

## What exists and works
* **Engine** (`src/`, build with `npm run build`, open `dist/index.html`): one file, offline, clicker keys, blank to paper, presenter window, reload recovery, protected silences. It currently runs the rejected SVG drawings, which need replacing.
* **Proof of the panel technique** (`frames/proof-panels.html`, video `frames/out/proof-panel1-to-panel2.mp4`): each panel reveals its own pixels through invisible strokes traced from its ink (`tools/trace_panel.py`). It works; it's soft only because the board is 2048 px wide.

## What went wrong, so it isn't repeated
* The acts were redrawn as thin SVG lines. Against the cover they looked like a wireframe. **Never simplify or restyle Edu's art.**
* Decisions were approved from text descriptions. **Always show images side by side with the reference before building on them.**
* The repo lacked six of the cover's eight layers. **Check `cover-original/`, not `layers/`.**

## What's needed next
1. Each storyboard panel as its own full resolution image (at least 2000 px tall), in `assets/storyboard/panel01.png` to `panel10.png`.
2. Those panels wired into the engine with the stroke mask reveal, one click per idea.
3. Rehearsal with the clicker, a venue test, and fallbacks (an MP4 of the whole talk and a PDF of key frames).
