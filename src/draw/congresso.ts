// The Congresso Nacional in elevation: horizon, twin towers, dome and bowl.
// PLACEHOLDER geometry until Edu's own drawing (assets/architecture/congresso-nacional.svg) arrives.
// Never Niemeyer's own sketches. Used in Act 2 (the homage) and Act 7 (the shiny city resolves into it).

import { svg } from "../sheet";
import { hand, type Pt } from "./hand";

export interface Congresso { g: SVGGElement; horizon: SVGPathElement; slab: SVGPathElement; towers: SVGPathElement[]; dome: SVGPathElement; bowl: SVGPathElement }

export function congresso(parent: Element, cx: number, hz: number, key: string, scale = 1): Congresso {
  const k = (n: string) => `${key}:${n}`;
  const s = scale;
  const cop = { stroke: "var(--copper)", fill: "none", "stroke-width": 2, "stroke-linecap": "round" };
  const g = svg("g", { class: "congresso" }, parent) as SVGGElement;
  const base = hz - 14 * s;
  const horizon = svg("path", { ...cop, d: hand([[cx - 120 * s, hz], [cx + 120 * s, hz]], k("horizon"), 0.6) }, g) as SVGPathElement;
  const slab = svg("path", { ...cop, d: hand([[cx - 100 * s, base], [cx + 100 * s, base]], k("slab"), 0.5) }, g) as SVGPathElement;
  const towers = [cx - 9 * s, cx + 9 * s].map((x, i) => svg("path", {
    ...cop, d: hand([[x - 7 * s, base], [x - 7 * s, hz - 120 * s], [x + 7 * s, hz - 120 * s], [x + 7 * s, base]], k("t" + i), 0.5),
  }, g) as SVGPathElement);
  // Dome: a low half ellipse, convex upward. Bowl: the inverted one, rim on top.
  const dome = svg("path", { ...cop, d: hand(Array.from({ length: 25 }, (_, i): Pt => {
    const a = Math.PI * (i / 24); return [cx - 62 * s - 30 * s * Math.cos(a), base - 18 * s * Math.sin(a)];
  }), k("dome"), 0.4) }, g) as SVGPathElement;
  const bowl = svg("path", { ...cop, d: hand(Array.from({ length: 25 }, (_, i): Pt => {
    const a = Math.PI * (i / 24); return [cx + 62 * s - 36 * s * Math.cos(a), base - 24 * s + 24 * s * Math.sin(a)];
  }), k("bowl"), 0.4) }, g) as SVGPathElement;
  return { g, horizon, slab, towers, dome, bowl };
}
