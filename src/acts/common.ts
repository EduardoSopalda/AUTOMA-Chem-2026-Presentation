import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { svg, type Sheet } from "../sheet";
import type { BeatInfo } from "../beats";

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);
export { gsap };

export type Build = (s: Sheet, beat: BeatInfo) => gsap.core.Timeline;

// The figure's fixed place on the sheet (see .figure in styles.css). He never moves.
export const FIG = { x: 930, top: 812, ground: 932 };
export const GHOST_X = 862;
export const GHOST_TOP = 440;   // just under the plan at the top of the frame

/** Mark an element as belonging to the current act, so the next act can clear it. */
export function t<T extends Element>(el: T): T { el.classList.add("t"); return el; }

/** Fade out and remove everything the previous act left, except the figure, the ghost line and the title block. */
export function clearPrevious(s: Sheet, tl: gsap.core.Timeline, at = 0, keep: Element[] = []) {
  const old = [...Array.from(s.draw.querySelectorAll(":scope > .t")), ...Array.from(s.words.children)].filter((e) => !keep.includes(e));
  if (!old.length) return;
  tl.to(old, { opacity: 0, duration: 0.8, ease: "sine.inOut", onComplete: () => old.forEach((o) => o.remove()) }, at);
}

export function drawIn(tl: gsap.core.Timeline, els: Element | Element[], at: number, duration = 1.6, stagger = 0) {
  const list = Array.isArray(els) ? els : [els];
  if (!list.length) return;
  tl.fromTo(list, { drawSVG: "0%" }, { drawSVG: "100%", duration, stagger, ease: "power1.inOut" }, at);
}

export function unDraw(tl: gsap.core.Timeline, els: Element | Element[], at: number, duration = 1.2, stagger = 0) {
  const list = Array.isArray(els) ? els : [els];
  if (!list.length) return;
  tl.to(list, { drawSVG: "0%", duration, stagger, ease: "power1.inOut" }, at);
}

export function fadeIn(tl: gsap.core.Timeline, els: Element | Element[], at: number, duration = 0.8, stagger = 0) {
  tl.fromTo(els, { opacity: 0 }, { opacity: 1, duration, stagger, ease: "sine.out" }, at);
}

/** The ghost dimension line between plan and figure: 12% ink, label empty, from Act 1 to Act 9. */
export function ghost(s: Sheet) {
  const g = svg("g", { class: "ghost", stroke: "var(--ink)", "stroke-width": 1.5, fill: "none", opacity: 0 }, s.draw);
  svg("line", { class: "g-main", x1: GHOST_X, y1: GHOST_TOP, x2: GHOST_X, y2: FIG.ground }, g);
  svg("line", { class: "g-top", x1: GHOST_X - 12, y1: GHOST_TOP + 12, x2: GHOST_X + 12, y2: GHOST_TOP - 12 }, g);
  svg("line", { class: "g-bot", x1: GHOST_X - 12, y1: FIG.ground + 12, x2: GHOST_X + 12, y2: FIG.ground - 12 }, g);
  svg("line", { class: "g-topext", x1: GHOST_X - 20, y1: GHOST_TOP, x2: GHOST_X + 20, y2: GHOST_TOP }, g);
  svg("line", { class: "g-botext", x1: GHOST_X - 20, y1: FIG.ground, x2: GHOST_X + 20, y2: FIG.ground }, g);
  return g;
}

/** Dark scan lines become copper ink; white paper and transparent areas vanish. Shared by Acts 1 and 9. */
export function copperFilter(root: SVGSVGElement) {
  let d = root.querySelector("defs");
  if (!d) d = svg("defs", {}, root);
  if (!d.querySelector("#to-copper")) {
    const f = svg("filter", { id: "to-copper", "color-interpolation-filters": "sRGB" }, d);
    // RGB = copper. Alpha = 1.45 × source alpha, minus luminance: white and transparent both go to zero.
    svg("feColorMatrix", { type: "matrix", values: "0 0 0 0 0.463  0 0 0 0 0.184  0 0 0 0 0.043  -0.48 -0.944 -0.176 1.45 0" }, f);
  }
}

/** Reveal an element with a wipe, for things DrawSVG can't draw (dashed lines, images, many paths). */
export function wipe(s: Sheet, el: SVGGraphicsElement, box: { x: number; y: number; w: number; h: number }, from: "left" | "bottom" = "left") {
  const id = `w${Math.random().toString(36).slice(2, 8)}`;
  let defs = s.draw.querySelector("defs");
  if (!defs) defs = svg("defs", {}, s.draw);
  const cp = svg("clipPath", { id }, defs);
  const r = svg("rect", from === "left"
    ? { x: box.x, y: box.y, width: 0, height: box.h }
    : { x: box.x, y: box.y + box.h, width: box.w, height: 0 }, cp);
  el.setAttribute("clip-path", `url(#${id})`);
  const to: gsap.TweenVars = from === "left" ? { attr: { width: box.w } } : { attr: { y: box.y, height: box.h } };
  return { rect: r, to };
}
