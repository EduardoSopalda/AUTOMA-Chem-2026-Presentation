// The Congresso Nacional in elevation, from Edu's own drawing: assets/architecture/congresso-nacional.svg.
// Never Niemeyer's own sketches. Used in Act 2 (the homage), Act 7 (the shiny city resolves into it)
// and the Act 7 to 8 handoff (its two towers become the plant and the twin).
//
// Cleaned from the source: five duplicated plinth lines and a doubled tower top were removed.
// The tower outline is split at its inner edges into two towers, a bridge and a joint line; every segment is kept.
// Draw order: horizon (with the plinth), towers, then dome and bowl together. Copper, with the hand wobble.

import { svg } from "../sheet";
import { hand, cubic, type Pt } from "./hand";

export interface Congresso {
  g: SVGGElement;
  horizon: SVGPathElement;
  plinth: SVGPathElement[];
  towers: SVGPathElement[];       // exactly two: left and right, for the Act 8 handoff
  joint: SVGPathElement[];        // the bridge and the joint line between the towers
  dome: SVGPathElement;
  bowl: SVGPathElement[];         // rim and basin
}

// Source coordinates (viewBox 1254 by 627). The horizon runs at y 438.5.
// The anchor is the joint line between the towers (x 467): placed on the plan's monumental axis,
// the axis runs straight up between the two towers, and ends at the Congress.
const SRC = { cx: 467, hz: 438.5 };
const BASE_SCALE = 0.23;          // at scale 1 the building is about 267 px wide and its towers about 86 px tall

const G = {
  horizon: [[46, 438.5], [1207, 438.5]] as Pt[],
  plinth: [
    [[550, 438], [550, 455], [657, 455], [657, 438]],
    [[518, 455], [518, 471], [675, 471], [675, 455]],
    [[493, 471], [493, 490], [693, 490], [693, 471]],
  ] as Pt[][],
  towers: [
    [[424.5, 438], [424.5, 65], [457.5, 65], [457.5, 438]],
    [[475.5, 438], [475.5, 65], [507.5, 65], [507.5, 438]],
  ] as Pt[][],
  joint: [
    [[457.5, 65], [475.5, 65]],
    [[467, 438], [467, 103]],
  ] as Pt[][],
  dome: [...cubic([166, 438], [194, 390], [234, 357], [292, 357], 24), ...cubic([292, 357], [350, 357], [392, 390], [418, 438], 24).slice(1)],
  bowlRim: [[726, 340.5], [1200, 340.5]] as Pt[],
  bowl: [
    ...cubic([726, 340.5], [756, 374], [795, 405], [851, 425], 20),
    ...cubic([851, 425], [907, 445], [985, 444], [1044, 424], 24).slice(1),
    ...cubic([1044, 424], [1113, 401], [1167, 371], [1200, 340.5], 20).slice(1),
  ],
};

export function congresso(parent: Element, cx: number, hz: number, key: string, scale = 1): Congresso {
  const s = BASE_SCALE * scale;
  const T = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [cx + (x - SRC.cx) * s, hz + (y - SRC.hz) * s]);
  const k = (n: string) => `${key}:${n}`;
  const cop = { stroke: "var(--copper)", fill: "none", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" };
  const g = svg("g", { class: "congresso" }, parent) as SVGGElement;
  const path = (pts: Pt[], name: string, amp: number, extra: Record<string, string | number> = {}) =>
    svg("path", { ...cop, ...extra, d: hand(T(pts), k(name), amp) }, g) as SVGPathElement;

  const horizon = path(G.horizon, "horizon", 0.6, { class: "horizon" });
  const plinth = G.plinth.map((p, i) => path(p, "plinth" + i, 0.3, { class: "plinth", "stroke-width": 1.6 }));
  const towers = G.towers.map((p, i) => path(p, "tower" + i, 0.4, { class: "tower" }));
  const joint = G.joint.map((p, i) => path(p, "joint" + i, 0.3, { class: "joint", "stroke-width": 1.4 }));
  const dome = path(G.dome, "dome", 0.4, { class: "dome" });
  const bowl = [path(G.bowlRim, "rim", 0.4, { class: "bowl" }), path(G.bowl, "bowl", 0.4, { class: "bowl" })];
  return { g, horizon, plinth, towers, joint, dome, bowl };
}
