// Box2D-lite (Erin Catto), ported to JS in pixels, plus: circles, restitution, a soft (penalty) circle for Blue.
// Deterministic: fixed step, fixed iteration order, no randomness.
(function () {
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], sc = (a, s) => [a[0] * s, a[1] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const crossVS = (v, s) => [s * v[1], -s * v[0]], crossSV = (s, v) => [-s * v[1], s * v[0]];
  const rot = (a) => { const c = Math.cos(a), s = Math.sin(a); return { c, s }; };
  const mul = (R, v) => [R.c * v[0] - R.s * v[1], R.s * v[0] + R.c * v[1]];
  const mulT = (R, v) => [R.c * v[0] + R.s * v[1], -R.s * v[0] + R.c * v[1]];
  const col1 = (R) => [R.c, R.s], col2 = (R) => [-R.s, R.c];

  class Body {
    constructor(o) {
      Object.assign(this, { pos: [0, 0], a: 0, v: [0, 0], w: 0, kind: "box", hw: [10, 10], r: 0, density: 1, friction: 0.5, e: 0.1, isStatic: false, kinematic: false, soft: false, tag: "" }, o);
      if (this.isStatic || this.kinematic) { this.invM = 0; this.invI = 0; }
      else if (this.kind === "box") { const m = this.density * 4 * this.hw[0] * this.hw[1]; this.invM = 1 / m; this.invI = 1 / (m * (4 * (this.hw[0] ** 2 + this.hw[1] ** 2)) / 12); }
      else { const m = this.density * Math.PI * this.r * this.r; this.invM = 1 / m; this.invI = 1 / (0.5 * m * this.r * this.r); }
    }
    aabb() { if (this.kind === "circle") return [this.pos[0] - this.r, this.pos[1] - this.r, this.pos[0] + this.r, this.pos[1] + this.r];
      const R = rot(this.a), ex = Math.abs(R.c) * this.hw[0] + Math.abs(R.s) * this.hw[1], ey = Math.abs(R.s) * this.hw[0] + Math.abs(R.c) * this.hw[1];
      return [this.pos[0] - ex, this.pos[1] - ey, this.pos[0] + ex, this.pos[1] + ey]; }
  }

  // ---- box vs box (Box2D-lite Collide.cpp) ----
  function clip(vIn, n, off) {
    const out = [], d0 = dot(n, vIn[0]) - off, d1 = dot(n, vIn[1]) - off;
    if (d0 <= 0) out.push(vIn[0]); if (d1 <= 0) out.push(vIn[1]);
    if (d0 * d1 < 0) { const k = d0 / (d0 - d1); out.push(add(vIn[0], sc(sub(vIn[1], vIn[0]), k))); }
    return out;
  }
  function incident(h, pos, R, normal) {
    const n = sc(mulT(R, normal), -1), na = [Math.abs(n[0]), Math.abs(n[1])];
    let c0, c1;
    if (na[0] > na[1]) { if (n[0] > 0) { c0 = [h[0], -h[1]]; c1 = [h[0], h[1]]; } else { c0 = [-h[0], h[1]]; c1 = [-h[0], -h[1]]; } }
    else { if (n[1] > 0) { c0 = [h[0], h[1]]; c1 = [-h[0], h[1]]; } else { c0 = [-h[0], -h[1]]; c1 = [h[0], -h[1]]; } }
    return [add(pos, mul(R, c0)), add(pos, mul(R, c1))];
  }
  function boxBox(A, B) {
    const hA = A.hw, hB = B.hw, RA = rot(A.a), RB = rot(B.a);
    const dp = sub(B.pos, A.pos), dA = mulT(RA, dp), dB = mulT(RB, dp);
    // C = RA^T RB
    const C = [[RA.c * RB.c + RA.s * RB.s, -RA.c * RB.s + RA.s * RB.c], [-RA.s * RB.c + RA.c * RB.s, RA.s * RB.s + RA.c * RB.c]];
    const aC = C.map((r) => r.map(Math.abs));
    const faceA = [Math.abs(dA[0]) - hA[0] - (aC[0][0] * hB[0] + aC[0][1] * hB[1]), Math.abs(dA[1]) - hA[1] - (aC[1][0] * hB[0] + aC[1][1] * hB[1])];
    if (faceA[0] > 0 || faceA[1] > 0) return [];
    const faceB = [Math.abs(dB[0]) - (aC[0][0] * hA[0] + aC[1][0] * hA[1]) - hB[0], Math.abs(dB[1]) - (aC[0][1] * hA[0] + aC[1][1] * hA[1]) - hB[1]];
    if (faceB[0] > 0 || faceB[1] > 0) return [];
    let axis = 0, sep = faceA[0], normal = dA[0] > 0 ? col1(RA) : sc(col1(RA), -1);
    const rt = 0.95, at = 0.01;
    if (faceA[1] > rt * sep + at * hA[1]) { axis = 1; sep = faceA[1]; normal = dA[1] > 0 ? col2(RA) : sc(col2(RA), -1); }
    if (faceB[0] > rt * sep + at * hB[0]) { axis = 2; sep = faceB[0]; normal = dB[0] > 0 ? col1(RB) : sc(col1(RB), -1); }
    if (faceB[1] > rt * sep + at * hB[1]) { axis = 3; sep = faceB[1]; normal = dB[1] > 0 ? col2(RB) : sc(col2(RB), -1); }
    let fn, front, sn, negSide, posSide, inc;
    if (axis === 0) { fn = normal; front = dot(A.pos, fn) + hA[0]; sn = col2(RA); const s = dot(A.pos, sn); negSide = -s + hA[1]; posSide = s + hA[1]; inc = incident(hB, B.pos, RB, fn); }
    else if (axis === 1) { fn = normal; front = dot(A.pos, fn) + hA[1]; sn = col1(RA); const s = dot(A.pos, sn); negSide = -s + hA[0]; posSide = s + hA[0]; inc = incident(hB, B.pos, RB, fn); }
    else if (axis === 2) { fn = sc(normal, -1); front = dot(B.pos, fn) + hB[0]; sn = col2(RB); const s = dot(B.pos, sn); negSide = -s + hB[1]; posSide = s + hB[1]; inc = incident(hA, A.pos, RA, fn); }
    else { fn = sc(normal, -1); front = dot(B.pos, fn) + hB[1]; sn = col1(RB); const s = dot(B.pos, sn); negSide = -s + hB[0]; posSide = s + hB[0]; inc = incident(hA, A.pos, RA, fn); }
    let cp = clip(inc, sc(sn, -1), negSide); if (cp.length < 2) return [];
    cp = clip(cp, sn, posSide); if (cp.length < 2) return [];
    const out = [];
    for (const p of cp) { const s = dot(fn, p) - front; if (s <= 0) out.push({ sep: s, n: normal, p: sub(p, sc(fn, s)) }); }
    return out;
  }
  // circle (B) vs box (A): normal from A to B
  function boxCircle(A, B) {
    const R = rot(A.a), d = mulT(R, sub(B.pos, A.pos)), h = A.hw;
    const q = [Math.max(-h[0], Math.min(h[0], d[0])), Math.max(-h[1], Math.min(h[1], d[1]))];
    let n, dist;
    if (q[0] === d[0] && q[1] === d[1]) {                 // centre inside the box: push out along the nearest face
      const dx = h[0] - Math.abs(d[0]), dy = h[1] - Math.abs(d[1]);
      if (dx < dy) { n = [Math.sign(d[0]) || 1, 0]; q[0] = n[0] * h[0]; dist = -dx; } else { n = [0, Math.sign(d[1]) || 1]; q[1] = n[1] * h[1]; dist = -dy; }
    } else { const dd = sub(d, q); dist = Math.hypot(dd[0], dd[1]); if (dist > B.r) return []; n = sc(dd, 1 / dist); }
    const sep = dist - B.r; if (sep > 0) return [];
    return [{ sep, n: mul(R, n), p: add(A.pos, mul(R, q)) }];
  }
  function collide(A, B) {
    if (A.kind === "box" && B.kind === "box") return boxBox(A, B);
    if (A.kind === "box" && B.kind === "circle") return boxCircle(A, B);
    if (A.kind === "circle" && B.kind === "box") return boxCircle(B, A).map((c) => ({ ...c, n: sc(c.n, -1) }));
    return [];
  }

  class World {
    constructor(o = {}) { Object.assign(this, { g: [0, 3400], iters: 10, slop: 0.5, beta: 0.2, bodies: [], arb: new Map(), softK: 0, softC: 0, log: null }, o); }
    addBody(b) { b.id = this.bodies.length; this.bodies.push(b); return b; }
    step(dt) {
      const B = this.bodies, inv = 1 / dt, newArb = new Map(), soft = [];
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
        const a = B[i], b = B[j]; if (a.invM === 0 && b.invM === 0) continue;
        const p = a.aabb(), q = b.aabb(); if (p[2] < q[0] || q[2] < p[0] || p[3] < q[1] || q[3] < p[1]) continue;
        const cs = collide(a, b); if (!cs.length) continue;
        if (a.soft || b.soft) { soft.push([a, b, cs]); continue; }
        const key = i * 4096 + j, old = this.arb.get(key);
        if (old) for (const c of cs) { const m = old.cs.find((o) => Math.abs(o.p[0] - c.p[0]) + Math.abs(o.p[1] - c.p[1]) < 3); if (m) { c.Pn = m.Pn; c.Pt = m.Pt; } }
        const ew = a.eWith ? a.eWith(b) : b.eWith ? b.eWith(a) : null, fw = a.fWith ? a.fWith(b) : b.fWith ? b.fWith(a) : null;
        newArb.set(key, { a, b, cs, fr: fw ?? Math.sqrt(a.friction * b.friction), e: ew ?? Math.max(a.e, b.e) });
      }
      this.arb = newArb;
      for (const b of B) if (b.invM > 0) { b.v = add(b.v, sc(this.g, dt)); }
      // soft contacts (Blue): a spring-damper along the normal, Coulomb friction along the tangent
      this.softLog = [];
      for (const [a, b, cs] of soft) for (const c of cs) {
        const r1 = sub(c.p, a.pos), r2 = sub(c.p, b.pos);
        const dv = sub(add(b.v, crossSV(b.w, r2)), add(a.v, crossSV(a.w, r1))), vn = dot(dv, c.n);
        const kk = typeof this.softK === "function" ? this.softK(a, b) : [this.softK, this.softC]; const F = Math.max(0, kk[0] * -c.sep - kk[1] * vn);
        const t = [c.n[1], -c.n[0]], vt = dot(dv, t), kt = a.invM + b.invM + a.invI * cross(r1, t) ** 2 + b.invI * cross(r2, t) ** 2;
        const Pt = Math.max(-0.3 * F * dt, Math.min(0.3 * F * dt, -vt / (kt || 1)));
        const P = add(sc(c.n, F * dt), sc(t, Pt));
        a.v = sub(a.v, sc(P, a.invM)); a.w -= a.invI * cross(r1, P); b.v = add(b.v, sc(P, b.invM)); b.w += b.invI * cross(r2, P);
        this.softLog.push({ a: a.tag, b: b.tag, n: c.n, sep: c.sep, F, p: c.p });
      }
      for (const A of this.arb.values()) {
        const { a, b } = A;
        for (const c of A.cs) {
          const r1 = sub(c.p, a.pos), r2 = sub(c.p, b.pos), rn1 = dot(r1, c.n), rn2 = dot(r2, c.n);
          c.mn = 1 / (a.invM + b.invM + a.invI * (dot(r1, r1) - rn1 * rn1) + b.invI * (dot(r2, r2) - rn2 * rn2));
          const t = [c.n[1], -c.n[0]], rt1 = dot(r1, t), rt2 = dot(r2, t);
          c.mt = 1 / (a.invM + b.invM + a.invI * (dot(r1, r1) - rt1 * rt1) + b.invI * (dot(r2, r2) - rt2 * rt2));
          c.bias = -this.beta * inv * Math.min(0, c.sep + this.slop);
          const dv = sub(add(b.v, crossSV(b.w, r2)), add(a.v, crossSV(a.w, r1))), vn = dot(dv, c.n);
          if (vn < -60) c.bias = Math.max(c.bias, -A.e * vn);
          c.Pn = c.Pn || 0; c.Pt = c.Pt || 0;
          const P = add(sc(c.n, c.Pn), sc(t, c.Pt));
          a.v = sub(a.v, sc(P, a.invM)); a.w -= a.invI * cross(r1, P); b.v = add(b.v, sc(P, b.invM)); b.w += b.invI * cross(r2, P);
          c.r1 = r1; c.r2 = r2; c.t = t;
        }
      }
      for (let it = 0; it < this.iters; it++) for (const A of this.arb.values()) {
        const { a, b } = A;
        for (const c of A.cs) {
          let dv = sub(add(b.v, crossSV(b.w, c.r2)), add(a.v, crossSV(a.w, c.r1)));
          let d = c.mn * (-dot(dv, c.n) + c.bias); const P0 = c.Pn; c.Pn = Math.max(P0 + d, 0); d = c.Pn - P0;
          let P = sc(c.n, d);
          a.v = sub(a.v, sc(P, a.invM)); a.w -= a.invI * cross(c.r1, P); b.v = add(b.v, sc(P, b.invM)); b.w += b.invI * cross(c.r2, P);
          dv = sub(add(b.v, crossSV(b.w, c.r2)), add(a.v, crossSV(a.w, c.r1)));
          let dt2 = c.mt * -dot(dv, c.t); const max = A.fr * c.Pn, T0 = c.Pt; c.Pt = Math.max(-max, Math.min(max, T0 + dt2)); dt2 = c.Pt - T0;
          P = sc(c.t, dt2);
          a.v = sub(a.v, sc(P, a.invM)); a.w -= a.invI * cross(c.r1, P); b.v = add(b.v, sc(P, b.invM)); b.w += b.invI * cross(c.r2, P);
        }
      }
      for (const b of B) if (b.invM > 0) { b.pos = add(b.pos, sc(b.v, dt)); b.a += b.w * dt; b.v = sc(b.v, 1 - (b.drag ?? 0.02) * dt); b.w *= 1 - (b.angDamp || 0.5) * dt; }
    }
  }
  const api = { Body, World, collide, rot, mul };
  if (typeof window !== "undefined") window.Phys = api; else module.exports = api;
})();
