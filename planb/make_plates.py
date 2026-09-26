# Plan B plates from Edu's real cover artwork (brand bible, page 1, 1536 x 864).
# 1. sheet-drawing.png: the artwork with its baked-in type bands replaced by its own paper tone and grain.
# 2. sheet-paper.png: the sheet as paper only.
# 3. figure-from-cover.png: the man, lifted out at his exact spot.
import numpy as np
from PIL import Image

def box(x, r):
    # separable box blur, edge padded; three passes approximate a gaussian
    for _ in range(3):
        for ax in (0, 1):
            p = np.pad(x, [(r + 1, r)] if x.ndim == 1 else ([(r + 1, r), (0, 0)] if ax == 0 else [(0, 0), (r + 1, r)]) + ([(0, 0)] if x.ndim == 3 else []), mode="edge")
            c = np.cumsum(p, axis=ax)
            x = (np.take(c, range(2 * r + 1, c.shape[ax]), axis=ax) - np.take(c, range(0, c.shape[ax] - 2 * r - 1), axis=ax)) / (2 * r + 1)
    return x

a = np.asarray(Image.open("planb/cover-artwork.jpg").convert("RGB")).astype(np.float32) / 255
H, W, _ = a.shape
lum, sat = a.mean(2), a.max(2) - a.min(2)
paper = ((lum > 0.78) & (sat < 0.28)).astype(np.float32)
model = box(a * paper[..., None], 30) / np.maximum(box(paper, 30), 1e-3)[..., None]
res = (a - model)[paper > 0]
rng = np.random.default_rng(7)
grain = box(rng.normal(0, 1, (H, W)).astype(np.float32), 1)
grain = grain / grain.std() * res.std()
fill = np.clip(model + grain[..., None], 0, 1)

yy, xx = np.mgrid[0:H, 0:W]
fig = (xx > 695) & (xx < 790) & (yy > 630) & (yy < 760)
band = ((yy < 212) | (yy > 726)).astype(np.float32)
band[fig] = 0
bandf = np.clip(box(band, 6), 0, 1)
out = a * (1 - bandf[..., None]) + fill * bandf[..., None]
Image.fromarray((out * 255).astype(np.uint8)).save("planb/sheet-drawing.png")
Image.fromarray((fill * 255).astype(np.uint8)).save("planb/sheet-paper.png")

d = np.abs(a - model).sum(2)
alpha = np.clip((d - 0.07) / 0.22, 0, 1) * fig
alpha = np.clip(box(alpha, 0) , 0, 1)
rgba = np.dstack([a, alpha])
Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").crop((695, 630, 790, 760)).save("planb/figure-from-cover.png")
print("plates written", W, H)
