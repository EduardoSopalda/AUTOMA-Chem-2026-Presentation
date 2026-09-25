# Learning notes

## Phase 4: the engine (26 September)

**Versions checked in node_modules:** Vite 8.3.1, GSAP 3.15.0, TypeScript 7.0.2, Playwright 1.63.0.

**Vite 8.** It runs on Rolldown. `build.rollupOptions` is deprecated in favour of `build.rolldownOptions`. `build.assetsInlineLimit` and `build.cssCodeSplit` still exist. Vite only transpiles TypeScript, so type checking is a separate `tsc --noEmit`.

**Opening from a double click.** Browsers block `<script type="module" src>` from `file://`, but an inline module with no imports runs. So the build inlines the JavaScript and CSS into `dist/index.html`, and inlines fonts and images as data URIs (`assetsInlineLimit` set very high). What goes on the stick is one file.

**Presenter window.** Pages opened from `file://` have an opaque origin, so BroadcastChannel isn't guaranteed there. A `window.open` reference and `window.opener` with `postMessage` work on any origin, so the deck and presenter talk that way. The presenter forwards clicker keys to the deck, because the clicker types into whichever window has focus.

**GSAP.** Since 3.13, DrawSVG and MorphSVG ship in the public `gsap` package (`gsap/DrawSVGPlugin`, `gsap/MorphSVGPlugin`). A timeline's `progress(1)` jumps to its end state synchronously. The engine uses that to rebuild any beat's state by replaying all earlier beats instantly.

**What I'll apply.** Beats are pure functions of the sheet: they read what earlier beats left behind, and return one timeline. Going back or jumping resets the sheet and fast forwards. Only a single step forward animates. Protected holds complete every running tween and stop ambient motion, so nothing moves.

**Patterns drawn on (from prior knowledge, not re-read this session):** step based scrollytelling engines (a state machine with a replayable state), the reveal.js speaker view (a second window synced by postMessage, keys forwarded), and museum kiosk practice (recovery after a reload, a hidden cursor, no network). I'll read the current docs before Phase 5 uses DrawSVG and MorphSVG in earnest.
