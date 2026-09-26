# Trace the ink of a storyboard panel into centre line paths, used as invisible mask strokes.
# The panel's own pixels are what the audience sees; these paths only decide the order they appear in.
# Usage: python tools/trace_panel.py <board.png> <x0> <y0> <x1> <y1> <out-name>
import json, sys
import numpy as np
from PIL import Image
from skimage.morphology import skeletonize, remove_small_objects

src, x0, y0, x1, y1, name = sys.argv[1], *map(int, sys.argv[2:6]), sys.argv[6]
img = Image.open(src).convert("RGB").crop((x0, y0, x1, y1))
a = np.asarray(img).astype(np.float32) / 255
H, W, _ = a.shape

# Paper is the bright, low saturation majority. Ink is anything clearly darker or more coloured.
lum, sat = a.mean(2), a.max(2) - a.min(2)
paper_lum = np.median(lum)
ink = ((lum < paper_lum - 0.07) | (sat > 0.16))
ink = remove_small_objects(ink, 6)
skel = skeletonize(ink)

# Walk the skeleton into polylines, splitting at junctions.
ys, xs = np.nonzero(skel)
P = set(zip(xs.tolist(), ys.tolist()))
N8 = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
nb = lambda p: [(p[0] + dx, p[1] + dy) for dx, dy in N8 if (p[0] + dx, p[1] + dy) in P]
deg = {p: len(nb(p)) for p in P}
nodes = {p for p, d in deg.items() if d != 2}
seen_edges, paths = set(), []

def walk(start, nxt):
    path, prev, cur = [start, nxt], start, nxt
    while cur not in nodes:
        cand = [q for q in nb(cur) if q != prev and (min(cur, q), max(cur, q)) not in seen_edges]
        if not cand: break
        seen_edges.add((min(cur, cand[0]), max(cur, cand[0])))
        prev, cur = cur, cand[0]
        path.append(cur)
    return path

for n in nodes:
    for q in nb(n):
        e = (min(n, q), max(n, q))
        if e in seen_edges: continue
        seen_edges.add(e)
        paths.append(walk(n, q))
# Closed loops with no node at all
left = P - {p for path in paths for p in path}
while left:
    s = left.pop(); ring = [s]; cur = s
    while True:
        cand = [q for q in nb(cur) if q in left]
        if not cand: break
        cur = cand[0]; left.discard(cur); ring.append(cur)
    if len(ring) > 3: paths.append(ring + [s])

def rdp(pts, eps=0.9):
    if len(pts) < 3: return pts
    a0, b0 = np.array(pts[0], float), np.array(pts[-1], float)
    d = b0 - a0; L = np.hypot(*d) or 1
    dist = [abs(d[0] * (a0[1] - p[1]) - d[1] * (a0[0] - p[0])) / L for p in pts]
    i = int(np.argmax(dist))
    if dist[i] > eps: return rdp(pts[: i + 1], eps)[:-1] + rdp(pts[i:], eps)
    return [pts[0], pts[-1]]

out = []
for path in paths:
    L = sum(np.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]) for i in range(1, len(path)))
    if L < 4: continue
    pts = rdp(path)
    col = np.array([a[y, x] for x, y in path]).mean(0)
    blue = bool(col[2] > col[0] + 0.03)
    cx, cy = np.mean([p[0] for p in path]), np.mean([p[1] for p in path])
    out.append({"d": "M" + " L".join(f"{x} {y}" for x, y in pts), "blue": blue, "len": round(float(L), 1), "cx": float(cx), "cy": float(cy)})

# Drawing order: copper before blue (the idea before reality), each spreading out from the drawing's centre line
axis = W / 2
out.sort(key=lambda p: (p["blue"], abs(p["cx"] - axis) + 0.35 * abs(p["cy"] - H * 0.45)))
img.save(f"assets/storyboard/proof/{name}.png")
json.dump({"w": W, "h": H, "paths": out}, open(f"assets/storyboard/proof/{name}.json", "w"))
print(name, W, H, "paths:", len(out), "copper:", sum(not p["blue"] for p in out), "blue:", sum(p["blue"] for p in out), "ink px:", int(ink.sum()))
