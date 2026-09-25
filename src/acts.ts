// What each click does to the sheet. Each build reads the sheet that the earlier beats left,
// and returns one timeline. Phase 4 holds placeholders; Phase 5 replaces them act by act.

import { gsap } from "gsap";
import { BEATS, type BeatInfo } from "./beats";
import { setTitleBlock, svg, type Sheet } from "./sheet";

export type Build = (s: Sheet, beat: BeatInfo) => gsap.core.Timeline;

// Scene 0: the title card's own build. Sketch, then plan, then hold.
const cover: Build = (s) => {
  gsap.set([s.sketch, s.plan], { opacity: 0 });
  return gsap.timeline()
    .to(s.sketch, { opacity: 1, duration: 16, ease: "sine.inOut" }, 2.4)
    .to(s.plan, { opacity: 1, duration: 18, ease: "sine.inOut" }, 16);
};

// Act 1, click 1: the cover type leaves; the drawing goes back to paper. Only the figure stays.
// Placeholder: a fade. The line by line un-draw arrives with the SVG cover in Phase 5.
const architect: Build = (s, beat) => {
  const tl = gsap.timeline();
  tl.to(s.cover.querySelectorAll(".top, .bottom, .question"), { opacity: 0, duration: 1.2, ease: "sine.inOut" }, 0)
    .to([s.sketch, s.plan], { opacity: 0, duration: 3, ease: "sine.inOut" }, 0.4)
    .call(() => setTitleBlock(s, beat), [], 0);
  return tl;
};

// Act 1, click 4 also leaves the ghost dimension line: 12% ink, label empty, on the sheet until Act 9.
const ghost = (s: Sheet) => {
  const g = svg("g", { class: "ghost", stroke: "var(--ink)", "stroke-width": 1.5, fill: "none", opacity: 0 }, s.draw);
  svg("line", { x1: 862, y1: 150, x2: 862, y2: 930 }, g);
  svg("line", { x1: 850, y1: 162, x2: 874, y2: 138 }, g);
  svg("line", { x1: 850, y1: 942, x2: 874, y2: 918 }, g);
  svg("line", { x1: 842, y1: 150, x2: 882, y2: 150 }, g);
  svg("line", { x1: 842, y1: 930, x2: 882, y2: 930 }, g);
  return g;
};

// Generic placeholder: the beat's on screen words, quietly, so timing and navigation can be rehearsed.
const placeholder: Build = (s, beat) => {
  const tl = gsap.timeline();
  const old = Array.from(s.words.children);
  if (old.length) tl.to(old, { opacity: 0, duration: 0.5, onComplete: () => old.forEach((o) => o.remove()) }, 0);
  const el = document.createElement("div");
  el.className = "ph";
  const [lead, ...rest] = beat.text.length > 2 && beat.text.every((t) => t.length < 24) ? ["", ...beat.text] : beat.text;
  el.innerHTML = `<p class="tag">Click ${beat.n} · placeholder</p>` +
    (lead ? `<p class="lead"></p>` : "") + (rest.length ? `<div class="labels"></div>` : "");
  if (lead) el.querySelector(".lead")!.textContent = lead;
  const labels = el.querySelector(".labels");
  for (const t of rest) { const sp = document.createElement("span"); sp.textContent = t; labels!.appendChild(sp); }
  gsap.set(el, { opacity: 0 });
  tl.call(() => { s.words.appendChild(el); setTitleBlock(s, beat, beat.act === 5 ? SOURCE_NOTE : ""); }, [], 0.5)
    .to(el, { opacity: 1, duration: 0.8, ease: "sine.out" }, 0.55);
  return tl;
};

const SOURCE_NOTE = "Scope 1, 2 and 3, 2025: 11,002 kt CO2e. Source: dsm-firmenich Integrated Annual Report 2025.";

export function buildFor(i: number): Build {
  if (i === 0) return cover;
  if (i === 1) return architect;
  if (i === 4) return (s, b) => {
    const tl = placeholder(s, b);
    const g = ghost(s);
    return tl.to(g, { opacity: 0.12, duration: 2.5, ease: "sine.inOut" }, 1.5);
  };
  return placeholder;
}

export const COUNT = BEATS.length;
