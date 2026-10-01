// Act 02 bake (run: node tools/bake_act2.mjs). Prototype 9, take 2 — three machines, in order, never merged:
//   1 RAIN      24 rotated bodies under g = 2400 px/s^2; Blue a kinematic dodger with a 10-frame lookahead; clips allowed, tunnels not.
//   2 PIANO     hang (html) -> 2-frame snap -> gravity only -> authored contact: look up 4, compress 6 (0.58 h), HOLD 8, release 4.
//   3 RICOCHET  Blue a dynamic circle from the release frame; axis e .72, RACI .5, words .5, floor .55; drag .3/s. Searched launch.
// Acceptance tests from the brief are hard failures. Output: act1/_proto9-bake.js (positions are ink-box centres, 60 fps).
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
const ROOT = new URL("..", import.meta.url).pathname;
const OUT = ROOT + "act1/act1-bake.js";
fs.writeFileSync(OUT, "window.BAKE = null;\n");
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
await p.goto(pathToFileURL(ROOT + "act1/act1.html").href);
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.addScriptTag({ path: ROOT + "tools/phys.js" });
const R = await p.evaluate((GRID) => {
  const { Body, World, collide, rot } = window.Phys, FPS = 60, N = RAIN.length, G = 2400, BR = 42, FLOORY = 770, BY = FLOORY - BR;
  const STATICS = [[[1655, 800], [650, 30], "floor"], [[985, 751], [20, 49], "post"], [[955, -134], [10, 866], "axis"]];   // the axis corridor (945-965) is solid; the post guards the man
  const statics = (W) => STATICS.forEach(([pos, hw, tag]) => W.addBody(new Body({ isStatic: true, pos, hw, tag, friction: 0.55, e: 0 })));
  const ZONES = { axis: [944, 0, 964, 732], man: [779, 740, 1001, 944], sentence: [1016, 796, 1540, 915], column: [1557, 200, 1894, 436], name: [1430, 40, 1830, 126], copper: [300, 380, 800, 890], logo: [1557, 940, 1830, 1025] };
  const ov = (a, c) => a[0] < c[2] && a[2] > c[0] && a[1] < c[3] && a[3] > c[1];
  const ZB = Object.fromEntries(Object.entries(ZONES).map(([z, r]) => [z, new Body({ isStatic: true, pos: [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2], hw: [(r[2] - r[0]) / 2, (r[3] - r[1]) / 2] })]));
  const hwOf = (i) => inkBox(i).hw, ext = (hw) => Math.hypot(hw[0], hw[1]);
  const wordProps = (i) => { const q = RAIN[i], hw = hwOf(i), hero = q[4] === "H";
    return { hw, density: (q[10] * 10000) / (4 * hw[0] * hw[1]), friction: 0.9, e: 0.05, drag: hero ? 0.4 : 0.15, angDamp: 0.1, tag: "w" + i,
      eWith: (o) => (o.tag === "floor" ? 0.12 : o.tag === "blue" ? (hero ? 0.05 : 0.1) : null), fWith: (o) => (o.tag === "floor" ? 0.8 : null) }; };
  const corners = (pos, a, hw) => { const R0 = rot(a); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [pos[0] + R0.c * u * hw[0] - R0.s * v * hw[1], pos[1] + R0.s * u * hw[0] + R0.c * v * hw[1]]); };
  const topOver = (bodies, x0, x1) => { let top = FLOORY; for (const bd of bodies) { if (!bd) continue; const cs = corners(bd.pos, bd.a, bd.hw);
      for (let k = 0; k < 4; k++) { const P = cs[k], Q = cs[(k + 1) % 4]; for (let u = 0; u <= 1; u += 0.02) { const x = P[0] + (Q[0] - P[0]) * u; if (x > x0 && x < x1) top = Math.min(top, P[1] + (Q[1] - P[1]) * u); } } } return top; };
  // ================= 1 RAIN =================
  const A = new World({ iters: 14, g: [0, G], slop: 0.3 }); statics(A);
  const blue = A.addBody(new Body({ kind: "circle", r: BR, tag: "blue", pos: [1330, BY], friction: 0.3, density: 6 * 10000 / (Math.PI * BR * BR), drag: 0.5, angDamp: 50 }));   // a body: a heavy word that clips him shoves him
  const wb = new Array(N).fill(null), landT = new Array(N).fill(null), framesA = [], blueA = [];
  const dt = 1 / 960, SUB = 960 / FPS, DA = 8.6;
  let lastHop = -1, hops = 0, bx = 1330, mode = "idle", mt = 0, x0d = 0, dir = 0, D = 0, clip = -1, clipN = [0, 0], clips = 0, dodges = 0, maxPen = 0, lean = 0, finalX = null, lastSpawn = Math.max(...RAIN.map((q) => q[5]));
  const LANE = [1060, 1420];
  const blockedAt = (x) => x < LANE[0] || x > LANE[1];                                   // words do not block him: he hops onto them
  for (let f = 0; f <= DA * FPS; f++) {
    const t = f / FPS;
    // spawn: fully off-screen, angled, spinning
    RAIN.forEach((q, i) => { if (wb[i] || t < q[5]) return; const P = wordProps(i), e = ext(P.hw), hero = q[4] === "H";
      let nb;
      if (q[6] === "aim") { const x = hero ? Math.max(985 + e * 0.45, Math.min(1090 - e * 0.25, bx)) : Math.max(1005 + e * 0.6, Math.min(1180 - e * 0.5, bx)), y = -e - (hero ? 60 : 100);   // the spoken words land against the axis, between Blue and the man   // at Blue, but always between him and the man                       // from above, at Blue
        nb = new Body({ ...P, pos: [x, y], a: (q[8] * Math.PI) / 180, w: q[9], v: [q[7], 0] });
        for (let k = 0; k < 40 && A.bodies.some((o) => o !== nb && o.tag !== "floor" && collide(nb, o).length); k++) nb.pos = [x, nb.pos[1] - 40]; }
      else { const a0 = (q[8] * Math.PI) / 180, Rr = rot(a0), ey = Math.abs(Rr.s) * P.hw[0] + Math.abs(Rr.c) * P.hw[1], ex = Math.abs(Rr.c) * P.hw[0] + Math.abs(Rr.s) * P.hw[1];
        const x0 = 1925 + ex, y0 = 458 + ey, Tf = Math.sqrt((2 * (FLOORY - 30 - ey - y0)) / G), aa = 1 / (2 * 0.8 * G), v = (-Tf + Math.sqrt(Tf * Tf + 4 * aa * (x0 - q[6]))) / (2 * aa);   // flight + slide = distance   // a gust: thrown in from beyond the paper edge, under the column, arcing down onto the heap
        nb = new Body({ ...P, pos: [x0, y0], a: a0, w: q[9] * 0.5, v: [-v, 0] });
        if (A.bodies.some((o) => o !== nb && o.tag !== "floor" && collide(nb, o).length)) return; }
      wb[i] = A.addBody(nb); });
    // Blue: the dodger (from t = 2.6; before that the html's entrance keys)
    let sx = 1, sy = 1, yOff = 0;
    if (t >= 2.6) {
      if (finalX === null && t > lastSpawn + 1.5) {                       // the hail is over: he runs for the open ground in the middle of his half
        let best = null; for (let x = 1150; x <= 1415; x += 5) { const top = topOver(wb, x - 133, x + 133); const sc = top - Math.abs(x - 1290) * 0.05; if (!best || sc > best[1]) best = [x, sc]; } finalX = best[0]; mode = "go"; mt = 0; x0d = bx; }
      if (mode === "go") { bx = finalX; mt += 1 / FPS; }
      else {
        // threats: airborne words whose ballistic path meets his circle within 10 frames
        let threat = null;
        for (const w of wb) { if (!w || landT[+w.tag.slice(1)] !== null || w.v[1] <= 0) continue; const e = ext(w.hw) * 0.8, m = 1 / w.invM;
          for (let k = 1; k <= 10; k++) { const tau = k / FPS, px = w.pos[0] + w.v[0] * tau, py = w.pos[1] + w.v[1] * tau + 0.5 * G * tau * tau;
            if (Math.hypot(px - bx, py - BY) < BR + e) { const sc = m / k; if (!threat || sc > threat.sc) threat = { sc, x: px, k }; break; } } }
        if (threat && (mode === "idle" || mode === "settle")) { mode = "antic"; mt = 0; x0d = bx; dodges++;
          dir = Math.sign(bx - threat.x) || 1; D = 70 + 40 * Math.min(1, threat.sc * threat.k / 40000);
          const ok = (d) => { const x = bx + d * D; return x > LANE[0] && x < LANE[1] && !blockedAt(x) && !blockedAt(bx + d * D * 0.5); };
          if (!ok(dir)) { if (ok(-dir)) dir = -dir; else D *= 0.4; } }
        if (mode === "antic") { yOff = 4 * Math.min(1, mt / (4 / FPS)); sx = 1.04; sy = 0.95; lean = -dir * 3; if (mt >= 4 / FPS - 1e-9) { mode = "dart"; mt = 0; } }
        else if (mode === "dart") { const u = Math.min(1, mt / (6 / FPS)), e = 1 - Math.pow(1 - u, 3), nx = x0d + dir * D * e; if (!blockedAt(nx)) bx = nx; sx = 0.96; sy = 1.04; lean = dir * 2; if (u >= 1) { mode = "settle"; mt = 0; } }
        else if (mode === "settle") { const u = Math.min(1, mt / (4 / FPS)); sy = 1 + 0.03 * (1 - u); sx = 1 / Math.sqrt(sy); lean = 0; if (u >= 1) mode = "idle"; }
        else if (mode === "idle") { const nx = bx - 55 / FPS; if (nx > LANE[0] + 20 && !blockedAt(nx)) bx = nx; }       // edging toward the person
        mt += 1 / FPS;
      }
      if (clip >= 0) { const c = f - clip; if (c < 9) { const k = c < 3 ? 1 : 1 - (c - 3) / 6; sy = Math.min(sy, 1 - 0.12 * k); sx = Math.max(sx, 1 + 0.08 * k); if (c < 3) { const nx = bx + clipN[0] * 6; if (nx > LANE[0] && nx < LANE[1] && !blockedAt(nx)) bx = nx; } } else clip = -1; }
    } else { const k = track(BLUE6, t); bx = k[0]; }
    const by = t >= 2.6 ? BY : track(BLUE6, t)[1];
    if (t < 2.6) { blue.pos = [bx, by]; blue.v = [0, 0]; }
    for (let s = 0; s < SUB; s++) {
      if (t >= 2.6) { const want = Math.max(-1100, Math.min(1100, (bx - blue.pos[0]) * 22)), dv = Math.max(-14000 * dt, Math.min(14000 * dt, want - blue.v[0])); blue.v[0] += dv; }   // muscles, not teleport
      else { blue.pos = [blue.pos[0] + (bx - blue.pos[0]) / (SUB - s), blue.pos[1] + (by - blue.pos[1]) / (SUB - s)]; blue.v = [0, 0]; }
      A.step(dt);
      if (t >= 2.6) { let support = false, wall = false; const want = Math.sign(bx - blue.pos[0]);           // a word in his way: he hops onto it
        for (const ar of A.arb.values()) { if (ar.a !== blue && ar.b !== blue) continue; const n = ar.b === blue ? ar.cs[0].n : ar.cs[0].n.map((v) => -v);
          if (n[1] < -0.5) support = true; if (Math.abs(n[0]) > 0.6 && n[0] * want < 0 && Math.abs(bx - blue.pos[0]) > 12) wall = true; }
        if (support && wall && t - lastHop > 0.3) { blue.v[1] = -Math.sqrt(2 * G * (BY - topOver(wb, bx - 30, bx + 30) + BR + 40)); lastHop = t; hops++; } }   // hop just high enough to clear what is in the way
      for (const ar of A.arb.values()) { const wa = ar.a.tag[0] === "w" ? ar.a : ar.b.tag[0] === "w" ? ar.b : null; if (!wa) continue;
        const o = wa === ar.a ? ar.b : ar.a, i = +wa.tag.slice(1);
        if (o.tag !== "blue" && landT[i] === null && wa.v[1] < 120) landT[i] = +(t + s * dt).toFixed(3);
        if (o.tag === "blue" && clip < 0 && t >= 2.6) { clip = f; clips++; clipN = [Math.sign(blue.pos[0] - wa.pos[0]) || 1, 0]; }
        if (o.tag[0] === "w" || o.tag === "blue") for (const c of ar.cs) maxPen = Math.min(maxPen, c.sep); } }
    framesA.push(wb.map((q) => (q ? [+q.pos[0].toFixed(1), +q.pos[1].toFixed(1), +q.a.toFixed(4)] : [null])));
    if (t >= 2.6 && Math.abs(blue.pos[0] - bx) > 60) bx = blue.pos[0];                       // shoved off his plan: he re-plans from where he is
    const px = t >= 2.6 ? blue.pos[0] : bx, py = t >= 2.6 ? blue.pos[1] : by;
    blueA.push([+(px + lean).toFixed(1), +(py + yOff + BR * (1 - sy)).toFixed(1), +sx.toFixed(3), +sy.toFixed(3)]);
  }
  const heroLand = RAIN.map((q, i) => (q[4] === "H" ? landT[i] : null)).filter((x) => x !== null);
  // ---- acceptance: rain ----
  const fail = [], note = {};
  const last = framesA[framesA.length - 1].map((q, i) => (q[0] === null ? null : new Body({ pos: [q[0], q[1]], a: q[2], hw: hwOf(i) })));
  if (last.some((x) => !x)) return { report: { fail: ["never spawned: " + RAIN.filter((q, i) => !last[i]).map((q) => q[0]).join(", ")], note: { blockers: wb.filter((w) => w && w.pos[0] > 1800).map((w) => [RAIN[+w.tag.slice(1)][0], Math.round(w.pos[0]), Math.round(w.pos[1])]) } } };
  let tunnels = 0, zoneHits = {};
  framesA.forEach((fr) => { const bs = fr.map((q, i) => (q[0] === null ? null : new Body({ pos: [q[0], q[1]], a: q[2], hw: hwOf(i) })));
    for (let i = 0; i < N; i++) { if (!bs[i]) continue; const bb = bs[i].aabb(); if (bb[3] > 0) for (const [z, r] of Object.entries(ZONES)) if (ov(bb, r) && collide(ZB[z], bs[i]).length) zoneHits[`${RAIN[i][0]} x ${z}`] = (zoneHits[`${RAIN[i][0]} x ${z}`] || 0) + 1;
      for (let j = i + 1; j < N; j++) if (bs[j]) for (const c of collide(bs[i], bs[j])) if (c.sep < -2) { tunnels++; break; } } });
  if (tunnels) fail.push(`${tunnels} word-word overlaps > 2 px in recorded frames`);
  if (Object.keys(zoneHits).length) fail.push("zone: " + Object.keys(zoneHits).join(", "));
  const settled = last.filter(Boolean), bottoms = settled.map((bd) => Math.max(...corners(bd.pos, bd.a, bd.hw).map((c) => c[1])));
  const isFlat = (bd) => { let a = ((bd.a % Math.PI) + Math.PI) % Math.PI; a = Math.min(a, Math.PI - a); return a < (8 * Math.PI) / 180; };
  const flatB = settled.map((bd, k) => (isFlat(bd) ? bottoms[k] : null)).filter((y) => y !== null);
  let maxShare = 0; flatB.forEach((y) => (maxShare = Math.max(maxShare, flatB.filter((z) => Math.abs(z - y) <= 6).length)));
  const flat = settled.filter((bd) => { let a = ((bd.a % Math.PI) + Math.PI) % Math.PI; a = Math.min(a, Math.PI - a); return a < (8 * Math.PI) / 180; }).length;
  const onWord = bottoms.filter((y) => y < FLOORY - 3).length;
  note.baselineShare = maxShare; note.flatShare = +(flat / settled.length).toFixed(2); note.restingOnWords = onWord;
  if (maxShare > 3) fail.push(`${maxShare} words share a baseline within 6 px`);
  if (flat / settled.length > 0.4) fail.push(`${Math.round((100 * flat) / settled.length)}% of words lie flat (< 8°)`);
  if (onWord < 4) fail.push(`only ${onWord} words rest on other words`);
  const xs = settled.map((bd) => bd.pos[0]).sort((a, c) => a - c); let gap = 0, gi = 0; for (let k = 1; k < xs.length; k++) if (xs[k] - xs[k - 1] > gap) { gap = xs[k] - xs[k - 1]; gi = k; }
  note.biggestXGap = Math.round(gap); if (gap > 150 && xs[gi - 1] - xs[0] < 160 && xs[xs.length - 1] - xs[gi] < 160) fail.push("the pile reads as a left list and a right list");
  note.hops = hops; note.maxPenetrationA = +maxPen.toFixed(2); note.clips = clips; note.dodges = dodges; note.moving = wb.filter((w) => Math.hypot(...w.v) > 40).map((w) => [RAIN[+w.tag.slice(1)][0], Math.round(w.pos[0]), Math.round(w.pos[1])]);
  // ================= 2 PIANO + 3 RICOCHET =================
  const raciX = (() => { const bx = blueA[blueA.length - 1][0]; let best = null;                     // aimed at him: the offset over Blue that leaves the footprint lower than his head
    for (let dx = -110; dx <= 110; dx += 2) { const x = bx + dx; if (x - RACI_W / 2 < 1010 || x + RACI_W / 2 > 1540) continue; const top = topOver(last, x - RACI_W / 2, x + RACI_W / 2);
      const sc = (top >= BY - BR + 8 ? 1000 : top) - Math.abs(dx); if (!best || sc > best[1]) best = [x, sc]; } return Math.round(best ? best[0] : bx); })(), RH = RACI_H, RW = RACI_W, hangBottom = RACI_HOLD + RH;
  const footTop = topOver(last, raciX - RW / 2, raciX + RW / 2); note.hangClearance = Math.round(footTop - hangBottom);
  if (footTop - hangBottom < 36) fail.push(`hang clears the pile by only ${Math.round(footTop - hangBottom)} px`);
  note.pileUnderPiano = Math.round(footTop); note.wallRight = Math.round(Math.max(...last.map((bd) => (bd.pos[0] < 1420 ? Math.max(...corners(bd.pos, bd.a, bd.hw).map((c) => c[0])) : -1e9)))); note.heapLeft = Math.round(Math.min(...last.map((bd) => (bd.pos[0] > 1420 ? Math.min(...corners(bd.pos, bd.a, bd.hw).map((c) => c[0])) : 1e9)))); note.inFootprint = last.map((bd, i) => { const tp = topOver([bd], raciX - RW / 2, raciX + RW / 2); return tp < FLOORY ? [RAIN[i][0].replace('<br>', ' '), Math.round(tp), Math.round(bd.pos[0])] : null; }).filter(Boolean); note.blueEnd = blueA[blueA.length - 1].slice(0, 2);
  const SQY = Math.max(0.58, (FLOORY - Math.min(FLOORY, footTop + 0)) / (2 * BR) + 0.001);         // squash only as deep as the words under the piano allow
  function runB(V) {
    // PIANO (authored): straight gravity fall from the hang, onto Blue; compress 6 frames to 0.6, HOLD 8, release.
    // The slab is kinematic (it does not negotiate); words under its edges are shoved by the solver. RICOCHET: Blue is a real body.
    const bX = blueA[blueA.length - 1][0], raciX = 1432;   // in the approved rain's open floor, right edge 1550 (clear of the chapter column)
    const W = new World({ iters: 16, g: [0, G], slop: 0.3 }); statics(W);
    const ws = last.map((bd, i) => { const b2 = W.addBody(new Body({ ...wordProps(i), pos: [...bd.pos], a: bd.a })); b2.iM = b2.invM; b2.iI = b2.invI; b2.invM = 0; b2.invI = 0; b2.sleep = true; b2.eWith = (o) => (o.tag === "floor" ? 0.12 : o.tag === "blue" ? 0.5 : null); return b2; });   // in the ricochet the rubber ball governs the bounce
    const wake = (q) => { if (q && q.sleep) { q.sleep = false; q.invM = q.iM; q.invI = q.iI; } };
    const raci = W.addBody(new Body({ pos: [raciX, RACI_HOLD + RH / 2], hw: [RW / 2, RH / 2], kinematic: true, friction: 0.9, tag: "raci" }));
    const restTop = topOver(last, raciX - RW / 2, raciX + RW / 2) - 1;
    const SQ = 0.6, topB = FLOORY - 2 * BR, tFall = Math.sqrt((2 * (topB - (RACI_HOLD + RH))) / G), fHit = Math.round((2 / FPS + tFall) * FPS);
    const raciF = [], blueF = [], wordsF = []; let pinX = null, pinY = null, bd = null, releaseT = null, ev = [], seq = [], still = 0, tEnd = null, landed = false, rv = 0;
    for (let f = 0; f < 7 * FPS; f++) {
      const t = f / FPS, c = f - fHit; let ry, bx = bX, by = BY, sx = 1, sy = 1;
      if (c < 0) { const tt = Math.max(0, t - 2 / FPS); ry = RACI_HOLD + 0.5 * G * tt * tt; if (c >= -4) { sy = 1.05; sx = 0.975; by = BY - 2; } }   // falling; he looks up
      else if (c < 17) { if (c >= 14) { const u = (c - 13) / 3; const s2 = SQ + (1 - SQ) * u; sy = s2; sx = 1 / Math.sqrt(s2); by = FLOORY - BR * s2; ry = FLOORY - 2 * BR * s2 - 2 - RH; } else { const u = c < 6 ? 1 - Math.pow(1 - (c + 1) / 6, 2) : 1; sy = 1 - (1 - SQ) * u; sx = Math.min(1.42, 1 / Math.sqrt(sy) * (1 + 0.2 * u)); by = FLOORY - BR * sy; ry = FLOORY - 2 * BR * sy - RH; } }   // compress, HOLD, then the slab recoils as he rounds out
      else { if (!bd) { bd = W.addBody(new Body({ kind: "circle", r: BR, pos: [bX, BY], density: (2 * 10000) / (Math.PI * BR * BR), friction: 0.2, drag: 0.3, angDamp: 50, tag: "blue",
            eWith: (o) => (o.tag === "axis" ? 0.72 : o.tag === "raci" ? 0.5 : o.tag[0] === "w" ? 0.5 : o.tag === "floor" || o.tag === "post" ? 0.55 : null), fWith: (o) => (o.tag === "axis" ? 0.15 : null) }));
          bd.v = [-V.speed * Math.cos(V.ang), -V.speed * Math.sin(V.ang)]; releaseT = +t.toFixed(4); rv = -0.0; }
        const k = c - 17, rest = Math.min(FLOORY, restTop) - RH;
        const REC = FLOORY - 2 * BR - 2 - RH;                                      // the rubber gives it back: the slab recoils until he is round again
        const PIN = FLOORY - 2 * BR * 0.9 - RH, kd = Math.round(0.55 * FPS);
        if (k < kd) ry = REC;                                                        // the slab at the top of its recoil while he rattles
        else { const tt = (k - kd) / FPS; ry = Math.min(PIN, REC + 0.5 * G * tt * tt); if (!pinX) { pinX = bd.pos[0]; pinY = bd.pos[1]; W.bodies.splice(W.bodies.indexOf(bd), 1); } } }   // then settles on whatever is under it
      const nyc = ry + RH / 2; raci.v = [0, (nyc - raci.pos[1]) * FPS];
      for (let s = 0; s < SUB; s++) { raci.pos = [raciX, raci.pos[1] + (nyc - raci.pos[1]) / (SUB - s)]; W.step(dt);
        for (const ar of W.arb.values()) { const A1 = ar.a, B1 = ar.b; const mv = (q) => q === raci || q === bd || (q.tag[0] === "w" && !q.sleep && Math.hypot(...q.v) > 20); if (mv(A1)) wake(B1); if (mv(B1)) wake(A1); }
        if (bd) { const dv = [bd.v[0] - (bd.pv || bd.v)[0], bd.v[1] - (bd.pv || bd.v)[1] - G * dt], m = Math.hypot(dv[0], dv[1]);   // an impact is a jump in velocity
          if (m > 150 && (!ev.length || t + s * dt - ev[ev.length - 1][0] > 0.06)) { const o = [...W.arb.values()].find((ar) => ar.a === bd || ar.b === bd); ev.push([+(t + s * dt).toFixed(3), [dv[0] / m, dv[1] / m], m / 2]); seq.push([o ? ((o.a === bd ? o.b : o.a).tag[0] === "w" ? "word" : (o.a === bd ? o.b : o.a).tag) : "?", Math.round(bd.pos[1])]); }
          bd.pv = [...bd.v]; } }
      if (bd && V.trace && t - releaseT < 0.35) V.trace.push([+(t - releaseT).toFixed(3), Math.round(bd.pos[0]), Math.round(bd.pos[1]), Math.round(bd.v[0]), Math.round(bd.v[1]), Math.round(raci.pos[1] + RH / 2), [...W.arb.values()].filter((ar) => ar.a === bd || ar.b === bd).map((ar) => (ar.a === bd ? ar.b : ar.a).tag).join('+')]);
      if (bd && pinX !== null) { const top = raci.pos[1] + RH / 2, s2 = Math.max(0.9, Math.min(1, (FLOORY - top) / (2 * BR))); bx = pinX; sy = s2; sx = 1 / Math.sqrt(s2); by = Math.min(FLOORY - BR * s2, pinY + (FLOORY - BR * s2 - pinY) * Math.min(1, (t - releaseT - 0.55) / 0.12)); if (tEnd === null && top >= FLOORY - 2 * BR * 0.9 - 0.5) tEnd = t; }
      else if (bd) { bx = bd.pos[0]; by = bd.pos[1];
        if (t - releaseT < 4 / FPS) { sx = 1.28; sy = 1 / 1.28; }
        for (const [te, n, vn] of ev) { const a = t - te, k = ev.findIndex((e) => e[0] === te), hold = k < 2 ? 3 : 5; if (a < 0 || a > (3 + hold) / FPS) continue;
          const q = 0.1 * Math.min(1, vn / 500) * (a < 3 / FPS ? 1 : 1 - (a - 3 / FPS) / (hold / FPS));
          if (Math.abs(n[0]) > Math.abs(n[1])) { sx = 1 - q; sy = 1 / Math.sqrt(sx); } else { sy = 1 - q; sx = 1 / Math.sqrt(sy); } }
      }
      raciF.push([raciX, +raci.pos[1].toFixed(1), 0]);
      blueF.push([+bx.toFixed(1), +by.toFixed(1), +sx.toFixed(3), +sy.toFixed(3)]);
      wordsF.push(ws.map((q) => [+q.pos[0].toFixed(1), +q.pos[1].toFixed(1), +q.a.toFixed(4)]));
      if (tEnd !== null && t > tEnd + 0.4) break;
    }
    const fl = []; let ztB = {}, penB = 0, pw = 0;
    wordsF.forEach((fr, f) => { const bs = fr.map((q, i) => new Body({ pos: [q[0], q[1]], a: q[2], hw: hwOf(i) })), rr = new Body({ pos: [raciF[f][0], raciF[f][1]], a: 0, hw: [RW / 2, RH / 2] });
      for (const [z, r] of Object.entries(ZONES)) if (z !== "copper" && ov(rr.aabb(), r) && collide(ZB[z], rr).length && raciF[f][1] - RH / 2 > 0) ztB["RACI x " + z] = 1;
      for (let i = 0; i < N; i++) { for (const c of collide(rr, bs[i])) penB = Math.min(penB, c.sep); for (let j = i + 1; j < N; j++) for (const c of collide(bs[i], bs[j])) pw = Math.min(pw, c.sep);
        for (const [z, r] of Object.entries(ZONES)) if (ov(bs[i].aabb(), r) && collide(ZB[z], bs[i]).length) ztB[RAIN[i][0] + " x " + z] = 1; }
      const [x, y, sx, sy] = blueF[f]; const cb = new Body({ kind: "circle", r: BR * Math.min(sx, sy), pos: [x, y] });
      for (const [z, r] of Object.entries(ZONES)) if (z !== "copper" && ov(cb.aabb(), r) && collide(ZB[z], cb).length) ztB["Blue x " + z] = 1; if (x - BR * sx < 953) ztB["Blue crosses the axis"] = 1; });
    Object.keys(ztB).forEach((k) => fl.push(k)); if (penB < -2) fl.push(`RACI into a word ${penB.toFixed(1)} px`); if (pw < -2) fl.push(`word into word ${pw.toFixed(1)} px`);
    const end = blueF[blueF.length - 1], first = seq[0] || ["none", 0], axisN = seq.filter((q) => q[0] === "axis").length;
    const inGap = end[0] < raciX - RW / 2 - 4 && end[0] > 1005;
    const kinds = new Set(seq.map((q) => q[0])), life = tEnd === null ? 9 : tEnd - releaseT;          // a lively rattle: many hits, several surfaces, dies out in ~1.5-3 s
    const score = -fl.length * 50 + Math.min(seq.length, 9) * 4 + kinds.size * 8 + (kinds.has("raci") ? 10 : 0) + (kinds.has("axis") ? 25 : 0) - Math.abs(life - 2.2) * 10;
    return { V, raciX, score, fails: fl, seq, end, rEnd: raciF[raciF.length - 1], releaseT, hitT: +(fHit / FPS).toFixed(4), tEnd, dur: blueF.length / FPS, inGap, raciF, blueF, wordsF, penB: +penB.toFixed(2), squash: SQ };
  }
  const tries = [];
  if (GRID.trace) { const tr = []; runB({ dx: 0, speed: GRID.speed[0], ang: GRID.ang[0] * Math.PI / 180, trace: tr }); return { report: { fail: [], note: {}, trace: tr } }; }
  for (const dx of GRID.dx) for (const speed of GRID.speed) for (const ang of GRID.ang) tries.push(runB({ dx, speed, ang: (ang * Math.PI) / 180 }));
  tries.sort((a, c) => c.score - a.score); const best = tries[0];
  const BAKE = { raciX: best.raciX, A: { fps: FPS, n: framesA.length, words: framesA.flat(), blue: blueA, heroLand }, B: { fps: FPS, n: best.blueF.length, words: best.wordsF.flat(), raci: best.raciF, blue: best.blueF, hitT: best.hitT, releaseT: best.releaseT, dur: +best.dur.toFixed(2), launch: best.V }, end: { blue: best.end.slice(0, 2) } };
  const brief = (r) => ({ V: { dx: r.V.dx, raciX: r.raciX, speed: r.V.speed, ang: Math.round((r.V.ang * 180) / Math.PI) }, score: +r.score.toFixed(1), fails: r.fails, seq: r.seq, end: r.end, rEnd: r.rEnd, inGap: r.inGap, hitT: r.hitT, releaseT: r.releaseT, tEnd: r.tEnd, penB: r.penB, squash: r.squash });
  return { BAKE, report: { fail, note, raciX, SQY: +SQY.toFixed(2), heroLand, best: brief(best), others: tries.slice(1, 5).map(brief) } };
}, JSON.parse(process.argv[2] || '{"dx":[0],"speed":[1600,2000,2400,2800,3200],"ang":[0,5,10,15]}'));
if (R.BAKE) fs.writeFileSync(OUT, "// Baked by tools/bake_act2.mjs (tools/phys.js). Ink-box centres and angles, 60 fps.\nwindow.BAKE = " + JSON.stringify(R.BAKE) + ";\n");
console.log(JSON.stringify(R.report)); console.log(errs);
await b.close();
