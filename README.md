# From Brasília to the Plant Floor

AUTOMA Chem 2026, opening panel. Eduardo Sopalda. Berlin, 26 October 2026.

One sheet of architectural paper for ten minutes. The brief is `CLAUDE.md`, the running order is `STORYBOARD.md`, and `CHANGELOG.md` has what changed.

## Present

Build once, then open `dist/index.html` with a double click. It's a single file with no network calls, so it runs from a USB stick.

```bash
npm install
npm run build
```

| Key | Does |
|---|---|
| Right, Page Down, Space, Enter | Next click |
| Left, Page Up | Back one click |
| B or full stop | Blank to paper (press again to return) |
| 1 to 9 | Jump to that act. 0 jumps to the coda. |
| Home / End | Cover / last click |
| F | Fullscreen |
| P | Open the presenter window (now, next, cue list, timers) |
| R | Replay the cover build (on the cover only) |

The cover plays its build once on load and then holds. The first click starts Act 1.

If the browser reloads mid talk, it comes back to the same click. The click number is kept in the address.

In the presenter window, clicker keys are passed to the deck, and R resets the timers.

## Check before going on stage

Open `dist/index.html?check`. It confirms every font and image, how quickly the first scene is ready, that every click can be rebuilt, and that nothing reaches the network.

`npm run stagetest` does the same from `file://` and also drives the clicker keys, reload recovery, blanking and the presenter window.

## Files

```text
src/            the engine, the sheet, the beats and the presenter view
fonts/          Source Serif 4 and DM Sans, self hosted (Open Font License)
layers/         the cover's sketch and plan (to be rebuilt as SVG in Phase 5)
assets/         brand bible, architecture drawings, the master figure
docs/           the speaking script and the brochure
frames/         Phase 3 style frames and test screenshots
legacy/         the original title card, kept for reference
notes/          sources, learning notes, decisions
```
