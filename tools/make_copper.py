"""Remaster the copper sphere at 8x from the clip-2 sprite, so it stays the same character.
Same canvas proportions (168 x 193 -> 1344 x 1544), same centre (84.5) and radius (44.5) ratios, so place() is unchanged.
Colour: the original, sampled smoothly (bicubic, then a half-pixel blur to remove the enlargement staircase),
with the lookup pulled slightly inward near the edge so the old matte and fringe are never sampled.
Edge: an analytic anti-aliased circle, no rim, no matte. No shadow: shadow-copper.png stays separate.
Usage: python make_copper.py act1/sphere-copper.png act1/sphere-copper-16x.png act1/shadow-copper.png act1/shadow-copper-16x.png 16"""
import sys
import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
K = int(sys.argv[5]) if len(sys.argv) > 5 else 8   # scale factor: 16 for Act 2 (460 px sphere, sharp at 4K)
C0, R0, EDGE = 84.5, 44.5, 44.5   # EDGE: the edge of the original (alpha above half), so the shadow's contact crescent stays covered
im = Image.open(src).convert("RGBA")
W, H = im.size[0] * K, im.size[1] * K
C, R = C0 * K, R0 * K
# the colour field, enlarged smoothly, premultiplied so transparent pixels never bleed in
a = np.asarray(im).astype(np.float64)
pm = a[..., :3] * (a[..., 3:] / 255)
up = lambda arr: np.asarray(Image.fromarray(arr.clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(K * 0.5))).astype(np.float64)
rgb_up = np.dstack([up(pm[..., k]) for k in range(3)])
al_up = up(a[..., 3])[..., None] / 255
col = rgb_up / np.maximum(al_up, 1e-3)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float64)
dx, dy = xx + 0.5 - C, yy + 0.5 - C
d = np.hypot(dx, dy) / (EDGE * K)
# radial remap: identity to 0.85, then compressed so the new edge samples at 0.975 of the old one, keeping the dark contact rim
s = np.where(d < 0.85, d, 0.85 + (np.minimum(d, 1.02) - 0.85) * (0.975 - 0.85) / 0.15)
k = np.where(d > 0, s / np.maximum(d, 1e-9), 1)
sx, sy = np.clip(C + dx * k - 0.5, 0, W - 1.001), np.clip(C + dy * k - 0.5, 0, H - 1.001)
x0, y0 = np.floor(sx).astype(int), np.floor(sy).astype(int); fx, fy = (sx - x0)[..., None], (sy - y0)[..., None]
out_rgb = (col[y0, x0] * (1 - fx) * (1 - fy) + col[y0, x0 + 1] * fx * (1 - fy) + col[y0 + 1, x0] * (1 - fx) * fy + col[y0 + 1, x0 + 1] * fx * fy)
alpha = np.clip((EDGE * K - np.hypot(dx, dy)) / 1.5 + 0.5, 0, 1) * 255
out = np.dstack([out_rgb.clip(0, 255), alpha]).round().astype(np.uint8)
Image.fromarray(out).save(dst)
print("saved", dst, W, H)

# The shadow (multiplied onto the paper) is soft everywhere: enlarge it smoothly to the same 8x canvas.
if len(sys.argv) > 4:
    sh = np.asarray(Image.open(sys.argv[3]).convert("RGB").resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(K * 0.8))).astype(np.float64)
    # the clip left a grey ring around the whole sphere; keep only the contact crescent below
    r = np.hypot(dx, dy) / K
    ring = (1 - np.clip((r - 47.5) / 3.0, 0, 1)) * (1 - np.clip((dy / K - 0.35 * R0) / (0.3 * R0), 0, 1))
    base = np.median(sh[: int(20 * K)].reshape(-1, 3), axis=0)   # the sprite's own level where there is no shadow (it is not pure white)
    sh = sh + (base - sh) * ring[..., None]
    # under the sphere's lower half, extend the contact crescent inward, so a squash never opens a gap of paper
    r2 = np.maximum(np.hypot(dx, dy), 1e-6); inner = (r2 < 46 * K) & (dy > 0.2 * R)
    ex, ey = np.clip(C + dx / r2 * 46.5 * K, 0, W - 1).astype(int), np.clip(C + dy / r2 * 46.5 * K, 0, H - 1).astype(int)
    sh[inner] = np.minimum(sh[inner], sh[ey[inner], ex[inner]])
    Image.fromarray(sh.clip(0, 255).round().astype(np.uint8)).save(sys.argv[4])
    print("saved", sys.argv[4])
