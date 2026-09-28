# The masterplan (act1/src/masterplan-original.jpg, 2732 x 1536) as an ink layer on white,
# so it multiplies onto the deck's own aged paper and the sheet never changes colour.
# Removes the baked spheres and their shadows (the deck's own spheres take their place)
# and clears the garbled labels (clean labels are set as live type).
import numpy as np
from PIL import Image

def box(x, r):
    for _ in range(3):
        for ax in (0, 1):
            pad = [(0, 0)] * x.ndim; pad[ax] = (r + 1, r); p = np.pad(x, pad, mode="edge"); c = np.cumsum(p, axis=ax)
            n = c.shape[ax]; x = (np.take(c, range(2 * r + 1, n), axis=ax) - np.take(c, range(0, n - 2 * r - 1), axis=ax)) / (2 * r + 1)
    return x

S = 2732 / 2000                                   # boxes below are measured in the 2000 px preview
a = np.asarray(Image.open("act1/src/masterplan-original.jpg").convert("RGB")).astype(np.float32)
H, W, _ = a.shape
lum = a.mean(2)
# Paper = brighter than its own neighbourhood, so the sheet's vignette counts as paper, not ink
local = box(lum, 60)
paper = (lum > local - 10).astype(np.float32)
model = box(a * paper[..., None], 45) / np.maximum(box(paper, 45), 1e-3)[..., None]
ratio = np.clip(a / np.maximum(model, 1), 0, 1)
g = ratio.mean(2)
k = np.clip((1 - g - 0.07) / 0.93, 0, 1)            # darkness with the paper grain knocked out
col = ratio / np.maximum(g[..., None], 1e-3)        # keep the ink's own hue (navy)
ink = np.clip(1 - k[..., None] * (1 - np.clip(col * 0 + 0.0, 0, 1)), 0, 1)
ink = np.clip(1 - k[..., None] * (1 - np.array([0.30, 0.36, 0.55], np.float32)), 0, 1)   # navy ink, the plan's own colour

yy, xx = np.mgrid[0:H, 0:W]

def remove_shadow(cx, cy, r):
    """Near a sphere, keep only thin lines: subtract the soft, broad darkness of its cast shadow."""
    near = np.hypot(xx - cx * S, yy - cy * S) < r * S
    kk = k.copy()
    hp = np.clip(kk - box(kk, 9) - 0.02, 0, 1) * 2.2
    k[near] = np.clip(hp[near], 0, 1)

remove_shadow(300, 255, 150)
remove_shadow(1770, 905, 140)
ink = np.clip(1 - k[..., None] * (1 - np.array([0.30, 0.36, 0.55], np.float32)), 0, 1)

def clear(x0, y0, x1, y1, pad=2):
    ink[int((y0 - pad) * S):int((y1 + pad) * S), int((x0 - pad) * S):int((x1 + pad) * S)] = 1

def clear_disc(cx, cy, r):
    m = np.hypot(xx - cx * S, yy - cy * S) < r * S
    ink[m] = 1
    repair(m)

def repair(m):
    """Straight lines that cross a cleared area are continued through it, from the ink on either side."""
    ys, xs = np.nonzero(m); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    dark = ink.mean(2) < 0.75
    for y in range(y0, y1 + 1):
        row = np.nonzero(m[y])[0]
        if len(row) and row[0] > 10 and row[-1] < W - 11 and dark[y, row[0] - 3] and dark[y, row[0] - 9] and dark[y, row[-1] + 3] and dark[y, row[-1] + 9]:
            ink[y, row[0]:row[-1] + 1] = (ink[y, row[0] - 3] + ink[y, row[-1] + 3]) / 2
    for x in range(x0, x1 + 1):
        col = np.nonzero(m[:, x])[0]
        if len(col) and col[0] > 10 and col[-1] < H - 11 and dark[col[0] - 3, x] and dark[col[0] - 9, x] and dark[col[-1] + 3, x] and dark[col[-1] + 9, x]:
            ink[col[0]:col[-1] + 1, x] = (ink[col[0] - 3, x] + ink[col[-1] + 3, x]) / 2

# baked spheres and their cast shadows
clear_disc(285, 240, 62)
clear_disc(1756, 896, 74)
# the plan's own tiny figure: the deck's man stands below the plan instead, at the foot of its avenue
clear_disc(1004, 556, 16); clear(1008, 560, 1075, 612, 0)
# garbled or repeated labels in the governance block, and the plant label
for bx in [(219, 127, 277, 153), (307, 127, 362, 153), (133, 196, 183, 226), (393, 199, 450, 227),
           (469, 170, 539, 198), (134, 286, 184, 315), (393, 290, 450, 315), (473, 297, 532, 322),
           (217, 345, 283, 373), (297, 345, 367, 373), (1699, 810, 1824, 828)]:
    clear(*bx)
# Outside the plan's outer border there is only the photographed table edge: paper
outside = (xx < 98 * S) | (xx > 1914 * S) | (yy < 86 * S) | (yy > 1045 * S)
ink[outside] = 1
Image.fromarray((ink * 255).astype(np.uint8)).save("act1/masterplan-ink.png", optimize=True)
print("act1/masterplan-ink.png", W, H)
