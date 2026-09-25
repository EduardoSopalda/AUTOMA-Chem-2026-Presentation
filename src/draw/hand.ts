// One hand, two instruments. Copper lines carry a tremor from a single seed across the whole talk.
// Blueprint lines stay mechanically straight. Type, the figure and dimension lines never wobble.

export type Pt = [number, number];

const SEED = 7;

// Deterministic 1D value noise. Each line reads its own stretch of the one noise field.
function hash(n: number) {
  let t = (n + SEED * 0x9e3779b9) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function noise(x: number) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1;
}
function keyOffset(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return (h >>> 0) % 100000;
}

/** Points along a quadratic Bézier. */
export function quad(a: Pt, c: Pt, b: Pt, n = 48): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
  }
  return out;
}

/** Points along a cubic Bézier. */
export function cubic(a: Pt, c1: Pt, c2: Pt, b: Pt, n = 64): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([
      u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
      u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
    ]);
  }
  return out;
}

/** Resample a polyline every `step` px. */
function resample(pts: Pt[], step = 6): Pt[] {
  const out: Pt[] = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const len = Math.hypot(x1 - x0, y1 - y0);
    let d = step - carry;
    while (d <= len) { const t = d / len; out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]); d += step; }
    carry = len - (d - step);
  }
  const last = pts[pts.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

/** Smooth path through points (Catmull Rom as cubic Béziers). */
export function smooth(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Copper: the hand. A gentle tremor across the line, with a slightly larger drift. */
export function hand(pts: Pt[], key: string, amp = 1.3): string {
  const r = resample(pts, 6), o = keyOffset(key);
  const out: Pt[] = r.map((p, i) => {
    const a = r[Math.max(0, i - 1)], b = r[Math.min(r.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const s = i * 6;
    const n = noise(o + s * 0.035) * amp + noise(o + 500 + s * 0.006) * amp * 1.6;
    return [p[0] - (dy / L) * n, p[1] + (dx / L) * n];
  });
  return smooth(out);
}

/** Blueprint: the machine. Exact. */
export function exact(pts: Pt[]): string {
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
}

/** Offset a polyline sideways by `d` px (for the parallel lines of a band). */
export function offset(pts: Pt[], d: number): Pt[] {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return [p[0] - (dy / L) * d, p[1] + (dx / L) * d];
  });
}

/** Point and tangent angle (degrees) at fraction t along a polyline. */
export function along(pts: Pt[], t: number): { p: Pt; deg: number } {
  const seg: number[] = [0];
  for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const target = t * seg[seg.length - 1];
  let i = 1;
  while (i < seg.length - 1 && seg[i] < target) i++;
  const f = (target - seg[i - 1]) / ((seg[i] - seg[i - 1]) || 1);
  const a = pts[i - 1], b = pts[i];
  return { p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], deg: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
}
