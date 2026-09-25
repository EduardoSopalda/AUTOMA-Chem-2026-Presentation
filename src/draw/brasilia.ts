// The planned capital, seen from the air. Original abstract geometry: a long straight axis
// crossed by curved residential wings. Never a tracing of Lúcio Costa's plan.
// One geometry, used three times: the cover (copper sketch meets blueprint plan),
// and Acts 2 and 9 (identical copper plans at the top of the sheet). Act 9 is Act 2, rebuilt.

import { svg } from "../sheet";
import { cubic, exact, hand, offset, along, smooth, type Pt } from "./hand";

export interface Place { x: number; y: number; s: number }
export const COVER: Place = { x: 955, y: 575, s: 1 };
export const ABOVE: Place = { x: 960, y: 245, s: 0.56 };   // Acts 2 and 9: the plan at the top of the frame

export interface Plan {
  root: SVGGElement;
  axis: SVGPathElement[];
  wings: SVGPathElement[];
  blocks: SVGElement[];
  ring: SVGPathElement[];
  lake: SVGPathElement[];
  sketch: SVGPathElement[];    // cover only: the copper idea on the left
  detail: SVGElement[];        // cover only: grid, trees, datum
  all: SVGElement[];
}

// Local geometry: the axis runs down x = 0, from y -325 to 325.
const AXIS: Pt[] = [[0, -325], [0, 325]];
const WINGS = cubic([-700, -90], [-330, 60], [250, 150], [520, -160], 80);
const RING = cubic([60, 300], [260, 250], [470, 80], [470, -270], 60);
const LAKE: Pt[] = [[200, -60], [185, -110], [215, -160], [260, -178], [305, -168], [328, -140], [310, -115], [272, -102], [255, -80], [268, -52], [240, -38], [212, -45], [200, -60]];
const STRANDS: [Pt, Pt, Pt, Pt][] = [
  // Sweeping strands, fanned out on the left, converging on the axis like a wing drawn in one breath
  [[-760, -300], [-520, -330], [-260, -180], [-10, -40]],
  [[-735, -200], [-470, -190], [-230, -60], [-12, 10]],
  [[-700, -60], [-460, -40], [-210, 40], [-14, 60]],
  [[-730, 90], [-470, 60], [-220, 100], [-12, 95]],
  [[-700, 250], [-470, 170], [-230, 150], [-14, 120]],
  [[-620, 315], [-420, 280], [-200, 200], [-16, 140]],
];

function hashf(i: number) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

export function brasilia(parent: Element, mode: "cover" | "copper", at: Place, id = "plan"): Plan {
  const T = (p: Pt): Pt => [at.x + p[0] * at.s, at.y + p[1] * at.s];
  const TT = (pts: Pt[]) => pts.map(T);
  const root = svg("g", { class: `plan plan-${mode}`, id }, parent) as SVGGElement;
  const cop = { stroke: "var(--copper)", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" };
  const blu = { stroke: "var(--blueprint)", fill: "none", "stroke-linejoin": "round" };
  const P: Plan = { root, axis: [], wings: [], blocks: [], ring: [], lake: [], sketch: [], detail: [], all: [] };
  const add = <T extends SVGElement>(list: SVGElement[], el: T) => { list.push(el); P.all.push(el); return el; };
  const k = (name: string) => `${id}:${mode}:${name}`;     // keys the wobble, so each line is its own

  if (mode === "cover") {
    // Blueprint reality on the right: a faint grid first, underneath everything
    const g = svg("g", { opacity: 0.35, stroke: "var(--blue-pale)", "stroke-width": 0.75 }, root);
    for (let x = 24; x <= 504; x += 48) add(P.detail, svg("path", { d: exact(TT([[x, -300], [x, 320]])) }, g));
    for (let y = -300; y <= 320; y += 48) add(P.detail, svg("path", { d: exact(TT([[20, y], [504, y]])) }, g));

    // The copper idea on the left: loose strands converging on the axis
    STRANDS.forEach((c, i) => add(P.sketch, svg("path", { ...cop, "stroke-width": 2.2, d: hand(TT(cubic(...c)), k("strand" + i), 1.6) }, root)));
    STRANDS.slice(0, 4).forEach((c, i) => add(P.sketch, svg("path", {
      ...cop, stroke: "var(--copper-light)", "stroke-width": 1, opacity: 0.7,
      d: hand(TT(cubic([c[0][0] + 20, c[0][1] + 14], c[1], c[2], [c[3][0] - 40, c[3][1] + 10])), k("echo" + i), 2.2),
    }, root)));

    // The wings, blueprint, only where reality has been built
    const right = WINGS.filter((p) => p[0] >= 20);
    for (const d of [-16, 16]) add(P.wings, svg("path", { ...blu, "stroke-width": 1.8, d: exact(TT(offset(right, d))) }, root));
    for (let i = 0; i < 14; i++) {
      const { p, deg } = along(right, 0.04 + i * 0.07);
      const c = T(p), w = 26 * at.s, h = 22 * at.s;
      add(P.blocks, svg("rect", {
        x: c[0] - w / 2, y: c[1] - h / 2, width: w, height: h, transform: `rotate(${deg} ${c[0]} ${c[1]})`,
        fill: "var(--blue-pale)", "fill-opacity": 0.55, stroke: "var(--blueprint)", "stroke-width": 1,
      }, root));
    }
    add(P.lake, svg("path", { d: smooth(TT(LAKE)) + "Z", fill: "var(--blue-pale)", "fill-opacity": 0.45, stroke: "var(--blueprint)", "stroke-width": 1.6 }, root));
    for (const d of [-5, 5]) add(P.ring, svg("path", { ...blu, "stroke-width": 1.4, d: exact(TT(offset(RING, d))) }, root));
    for (const t of [0.4, 0.75, 1]) { const c = T(along(RING, t).p); add(P.ring, svg("circle", { cx: c[0], cy: c[1], r: 10 * at.s, ...blu, "stroke-width": 1.6 }, root) as unknown as SVGPathElement); }
    // Trees: small circles along the ring and between the wings and the ring
    for (let i = 0; i < 70; i++) {
      const t = hashf(i), side = hashf(i + 99) * 2 - 1;
      const base = i % 2 ? along(RING, t).p : along(right, t).p;
      const c = T([base[0] + side * 34 + 18, base[1] + (hashf(i + 7) * 2 - 1) * 28]);
      add(P.detail, svg("circle", { cx: c[0], cy: c[1], r: (4 + hashf(i + 3) * 4) * at.s, ...blu, "stroke-width": 1 }, root));
    }
    // Datum mark, far right
    const dm = T([640, -200]);
    const dg = svg("g", { ...blu, "stroke-width": 1.4 }, root);
    add(P.detail, svg("circle", { cx: dm[0], cy: dm[1], r: 16 }, dg));
    add(P.detail, svg("path", { d: `M${dm[0] - 30} ${dm[1]}H${dm[0] + 30}M${dm[0]} ${dm[1] - 30}V${dm[1] + 30}` }, dg));
    // The axis last, on top: the seam where the idea meets reality
    add(P.axis, svg("path", { ...cop, "stroke-width": 2.4, d: hand(TT(AXIS), k("axis")) }, root));
    for (const y of [-245, 35]) add(P.axis, svg("path", { ...cop, "stroke-width": 1.8, d: hand(TT([[-40, y], [40, y]]), k("bar" + y), 0.8) }, root));
    return P;
  }

  // Copper plan: the whole city as one authored drawing (Acts 2 and 9)
  add(P.axis, svg("path", { ...cop, "stroke-width": 2.4, d: hand(TT(AXIS), k("axis")) }, root));
  // The esplanade: two parallel lines along the upper axis, with a row of ministries on each side
  for (const d of [-14, 14]) add(P.axis, svg("path", { ...cop, "stroke-width": 1.3, d: hand(TT([[d, -325], [d, -30]]), k("esp" + d), 0.7) }, root));
  for (let i = 0; i < 8; i++) for (const side of [-1, 1]) {
    const c = T([side * 38, -300 + i * 34]), w = 26 * at.s, h = 12 * at.s;
    add(P.blocks, svg("rect", { x: c[0] - w / 2, y: c[1] - h / 2, width: w, height: h, fill: "none", stroke: "var(--copper)", "stroke-width": 1.2 }, root));
  }
  // The wings: a highway with the residential blocks on both sides
  for (const d of [-9, 9]) add(P.wings, svg("path", { ...cop, "stroke-width": 1.8, d: hand(TT(offset(WINGS, d)), k("wing" + d)) }, root));
  for (let i = 0; i < 22; i++) for (const side of [-1, 1]) {
    const tt = 0.04 + i * 0.043;
    if (Math.abs(tt - 0.55) < 0.03) continue;                     // leave the crossing open
    const { p, deg } = along(offset(WINGS, side * 34), tt);
    const c = T(p), w = 30 * at.s, h = 30 * at.s;
    add(P.blocks, svg("rect", {
      x: c[0] - w / 2, y: c[1] - h / 2, width: w, height: h, transform: `rotate(${deg} ${c[0]} ${c[1]})`,
      fill: "none", stroke: "var(--copper)", "stroke-width": 1.2,
    }, root));
  }
  add(P.ring, svg("path", { ...cop, "stroke-width": 1.6, d: hand(TT(RING), k("ring")) }, root));
  add(P.lake, svg("path", { ...cop, "stroke-width": 1.6, d: hand(TT(LAKE), k("lake"), 0.6) }, root));
  return P;
}

/** The main axis in sheet coordinates, for the glow that runs along it once. */
export function axisPoints(at: Place): Pt[] { return AXIS.map((p) => [at.x + p[0] * at.s, at.y + p[1] * at.s]); }
