// The field of points: 10,000 documents in Act 6, then 2,000 paving stones in Act 7.
// Canvas, because SVG can't move this many marks at 60fps on integrated graphics.
// Every change is a tween whose onUpdate redraws, so a fast forward (progress(1)) lands on the exact end state.

import { gsap } from "gsap";
import type { Sheet } from "../sheet";

export const N = 10000, RELEVANT = 2000;

export interface Field {
  canvas: HTMLCanvasElement;
  x: Float32Array; y: Float32Array;
  relevant: Uint8Array;                  // 1 for the 2,000 that matter
  size: Float32Array;
  u: Float32Array;                       // position along the road, 0 at the start, 1 at the city
  st: { shown: number; waste: number; blue: number; glow: number; alpha: number; crack: number; reach: number };
  draw(): void;
}

function rng(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

const INK = "15,15,17", BLUE = "95,146,184", WARM = "216,156,103";

export function getField(s: Sheet): Field {
  const existing = s.words.querySelector("canvas.field") as (HTMLCanvasElement & { field?: Field }) | null;
  if (existing?.field) return existing.field;
  const canvas = document.createElement("canvas") as HTMLCanvasElement & { field?: Field };
  canvas.className = "field t";
  canvas.width = 1920; canvas.height = 1080;
  canvas.style.cssText = "position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none";
  s.words.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const r = rng(7);
  const f: Field = {
    canvas,
    x: new Float32Array(N), y: new Float32Array(N), relevant: new Uint8Array(N), size: new Float32Array(N).fill(3.4), u: new Float32Array(N),
    st: { shown: 0, waste: 1, blue: 0, glow: 0, alpha: 1, crack: 0, reach: 1 },
    draw() {
      ctx.clearRect(0, 0, 1920, 1080);
      const shown = Math.floor(f.st.shown * N);
      const blueMix = f.st.blue;
      // Waste first: ink fading to pale, with a faint warm glow of energy spent on nothing
      ctx.fillStyle = f.st.glow > 0
        ? `rgba(${WARM},${(0.3 + 0.25 * f.st.glow) * f.st.waste * f.st.alpha})`
        : `rgba(${INK},${0.85 * f.st.waste * f.st.alpha})`;
      for (let i = 0; i < shown; i++) if (!f.relevant[i]) ctx.fillRect(f.x[i] - 1.3, f.y[i] - 1.3, 2.6, 2.6);
      if (f.st.glow > 0) {
        ctx.fillStyle = `rgba(${INK},${0.22 * f.st.waste * f.st.alpha})`;
        for (let i = 0; i < shown; i++) if (!f.relevant[i]) ctx.fillRect(f.x[i] - 0.8, f.y[i] - 0.8, 1.6, 1.6);
      }
      // The ones that matter: ink turning blue
      const c = blueMix >= 1 ? BLUE : `${Math.round(15 + (95 - 15) * blueMix)},${Math.round(15 + (146 - 15) * blueMix)},${Math.round(17 + (184 - 17) * blueMix)}`;
      ctx.fillStyle = `rgba(${c},${0.9 * f.st.alpha})`;
      const cr = rng(99);
      for (let i = 0; i < shown; i++) {
        if (!f.relevant[i]) continue;
        const gone = f.st.crack > 0 && cr() < f.st.crack * 0.35;     // cracks: some stones disappear
        if (gone || f.u[i] > f.st.reach) continue;
        const z = f.size[i];
        ctx.fillRect(f.x[i] - z / 2, f.y[i] - z / 2, z, z);
      }
    },
  };
  // The 10,000: a loose field above the figure, with dense clusters (duplicates, drafts) and the relevant 2,000 spread through it
  for (let i = 0; i < N; i++) {
    f.relevant[i] = i % 5 === 0 ? 1 : 0;
    if (!f.relevant[i] && r() < 0.55) {
      const cx = 260 + Math.floor(r() * 6) * 280 + r() * 60, cy = 200 + Math.floor(r() * 3) * 190 + r() * 40;
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 70;
      f.x[i] = cx + Math.cos(a) * d; f.y[i] = cy + Math.sin(a) * d * 0.7;
    } else { f.x[i] = 150 + r() * 1620; f.y[i] = 130 + r() * 650; }
  }
  canvas.field = f;
  return f;
}

/** Tween every point from where it is to a new position, then redraw. */
export function move(tl: gsap.core.Timeline, f: Field, to: (i: number) => [number, number], at: number, duration: number, only?: (i: number) => boolean, size?: number) {
  let fx: Float32Array, fy: Float32Array, tx: Float32Array, ty: Float32Array;
  const p = { t: 0 };
  tl.fromTo(p, { t: 0 }, {
    t: 1, duration, ease: "power2.inOut",
    onStart: () => {
      fx = f.x.slice(); fy = f.y.slice(); tx = new Float32Array(N); ty = new Float32Array(N);
      for (let i = 0; i < N; i++) { if (only && !only(i)) { tx[i] = fx[i]; ty[i] = fy[i]; continue; } const [a, b] = to(i); tx[i] = a; ty[i] = b; }
    },
    onUpdate: () => {
      if (!fx) return;
      for (let i = 0; i < N; i++) { f.x[i] = fx[i] + (tx[i] - fx[i]) * p.t; f.y[i] = fy[i] + (ty[i] - fy[i]) * p.t; if (size && f.relevant[i]) f.size[i] = 3.4 + (size - 3.4) * p.t; }
      f.draw();
    },
  }, at);
}

/** Tween a field state value and redraw. */
export function state(tl: gsap.core.Timeline, f: Field, vars: Partial<Field["st"]>, at: number, duration: number) {
  tl.to(f.st, { ...vars, duration, ease: "sine.inOut", onUpdate: () => f.draw() }, at);
}
