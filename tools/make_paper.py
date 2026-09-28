# Aged archival paper for the opening, drawn to match Edu's target image.
# Writes two layers for the 1920 x 1080 stage:
#   opening/paper-age.png    multiply layer (white = no change): tone, burn, stains, foxing, folds, pencil marks
#   opening/paper-light.png  screen layer (black = no change): the lit side of each fold
# Deterministic (one seed), so the paper is identical on every run.
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1920, 1080
rng = np.random.default_rng(1957)


def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255


def noise(scale, octaves=4):
    """Value noise in 0..1 built from blurred random fields."""
    out = np.zeros((H, W), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        s = max(2, int(scale / 2 ** o))
        small = rng.random((H // s + 2, W // s + 2)).astype(np.float32)
        big = np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((W + 2 * s, H + 2 * s), Image.BICUBIC)).astype(np.float32)[:H, :W] / 255
        out += amp * big
        tot += amp
        amp *= 0.5
    return out / tot


yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
dark = np.zeros((H, W), np.float32)            # 0 = untouched paper, 1 = fully dark
tint = np.zeros((H, W), np.float32)            # how much of the stain colour (warm brown) to add

# 1. Mottled tone and fibre grain
dark += (noise(260) - 0.5) * 0.10
dark += (noise(40, 2) - 0.5) * 0.05
dark += (rng.random((H, W)).astype(np.float32) - 0.5) * 0.035

# 2. Burnt, irregular edges
ex = np.minimum(xx, W - 1 - xx) / W
ey = np.minimum(yy, H - 1 - yy) / H
edge = np.clip(1 - np.minimum(ex / 0.10, ey / 0.14), 0, 1) ** 2
edge *= 0.6 + 0.8 * noise(120)
dark += edge * 0.16
tint += edge * 0.55


# 3. Tide mark stains: a pale fill with a darker, irregular rim
def stain(cx, cy, r, strength, ring=0.6):
    ang = np.arctan2(yy - cy, xx - cx)
    wob = 1 + 0.10 * np.sin(ang * 3 + rng.random() * 6) + 0.06 * np.sin(ang * 7 + rng.random() * 6)
    d = np.hypot(xx - cx, yy - cy) / (r * wob)
    fill = np.clip(1 - d, 0, 1) ** 0.5 * 0.55
    rim = np.exp(-((d - 1) / 0.10) ** 2) * ring * 0.55          # a soft tide edge, never a drawn outline
    s = (fill + rim) * strength * (0.7 + 0.6 * noise(30, 2))
    return s

for cx, cy, r, k in [(1480, 20, 95, 0.55), (1528, 60, 55, 0.35),     # top right corner (as in the target)
                     (-10, 650, 70, 0.45),                          # left edge
                     (70, 1080, 120, 0.50), (205, 1075, 60, 0.30),  # bottom left
                     (1905, 470, 40, 0.25)]:
    s = blur(np.clip(stain(cx, cy, r, k), 0, 1), 6)
    dark += s * 0.22
    tint += s * 1.3

# 4. Foxing: small brown spots, more toward the edges
for _ in range(260):
    x, y = rng.random() * W, rng.random() * H
    near = max(1 - min(x, W - x) / 400, 1 - min(y, H - y) / 260, 0)
    if rng.random() > 0.25 + near: continue
    r = 0.6 + rng.random() * 2.4
    d = np.hypot(xx[int(max(0, y - 8)):int(y + 9), int(max(0, x - 8)):int(x + 9)] - x, yy[int(max(0, y - 8)):int(y + 9), int(max(0, x - 8)):int(x + 9)] - y)
    spot = np.clip(1 - d / r, 0, 1) * (0.25 + rng.random() * 0.35)
    dark[int(max(0, y - 8)):int(y + 9), int(max(0, x - 8)):int(x + 9)] += spot * 0.5
    tint[int(max(0, y - 8)):int(y + 9), int(max(0, x - 8)):int(x + 9)] += spot

# 5. Folds: horizontal at 31%, vertical at 51%, each a shadow line with a lit edge beside it
light = np.zeros((H, W), np.float32)
fy, fx = int(H * 0.313), int(W * 0.51)
wav_x = (noise(200, 2)[:, 0] - 0.5) * 6
wav_y = (noise(200, 2)[0, :] - 0.5) * 6
for x in range(W):
    y = int(fy + wav_y[x])
    dark[y - 1:y + 2, x] += 0.10
    dark[y + 2:y + 9, x] += np.linspace(0.05, 0, 7)
    light[y - 6:y - 1, x] += np.linspace(0, 0.07, 5)
for y in range(H):
    x = int(fx + wav_x[y])
    dark[y, x - 1:x + 2] += 0.08
    dark[y, x + 2:x + 8] += np.linspace(0.04, 0, 6)
    light[y, x - 5:x - 1] += np.linspace(0, 0.06, 4)
dark = dark * (0.85 + 0.3 * noise(90, 2))

# 6. Pencil marks: ruled ledger lines and faded notes top left, grid bottom left and bottom right,
#    a molecule sketch top right (as in the target). Drawn in graphite, then faded.
marks = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(marks)
def font(size, italic=True):
    for f in (["/System/Library/Fonts/Supplemental/Georgia Italic.ttf"] if italic else []) + ["/System/Library/Fonts/Supplemental/Georgia.ttf"]:
        try: return ImageFont.truetype(f, size)
        except OSError: pass
    return ImageFont.load_default()

def scribble(x0, y0, length, height=9):
    """An illegible handwritten line: small loops travelling right."""
    pts, x = [], x0
    while x < x0 + length:
        step = 5 + rng.random() * 6
        pts.append((x, y0 + (rng.random() - 0.5) * height))
        x += step
        if rng.random() < 0.08: x += 10 + rng.random() * 14            # a gap between words
    for i in range(len(pts) - 1):
        if abs(pts[i + 1][0] - pts[i][0]) < 16: d.line([pts[i], pts[i + 1]], fill=150, width=1)

for x in (52, 175): d.line([(x, 0), (x, 415)], fill=120, width=1)             # ruled margins, top left
for i, y in enumerate((40, 78, 114, 150, 186)):
    d.line([(0, y + 16), (470, y + 16)], fill=55, width=1)
    scribble(12, y + 4, 150 + rng.random() * 120)
d.text((305, 64), "6.1128", font=font(30), fill=140)
d.text((300, 102), "4.295", font=font(30), fill=140)
for gx in range(0, 180, 22): d.line([(gx, 860), (gx, H)], fill=60, width=1)       # grid, bottom left
for gy in range(860, H, 22): d.line([(0, gy), (180, gy)], fill=60, width=1)
for i, y in enumerate((930, 1000, 1040)): scribble(1560, y, 300)                # notes, bottom right
d.text((1745, 900), "0.5386", font=font(28), fill=110)
cx, cy, R = 1745, 245, 70                                                       # molecule, top right
ring = [(cx + R * math.cos(math.radians(-90 + 72 * k)), cy + R * math.sin(math.radians(-90 + 72 * k))) for k in range(5)]
d.line(ring + [ring[0]], fill=85, width=2)
d.line([(ring[1][0] - 9, ring[1][1] + 6), (ring[2][0] - 9, ring[2][1] - 4)], fill=120, width=1)   # double bond
d.line([ring[4], (ring[4][0] - 70, ring[4][1] + 38)], fill=80, width=2)
d.line([ring[1], (ring[1][0] + 75, ring[1][1] + 20)], fill=120, width=1)
d.line([ring[0], (ring[0][0] + 10, ring[0][1] - 60)], fill=120, width=1)
d.text((ring[4][0] - 105, ring[4][1] + 28), "O", font=font(40, False), fill=80)
d.text((ring[4][0] - 185, ring[4][1] - 35), "H₃C", font=font(38, False), fill=80)
d.text((cx - 40, cy + 120), "109.24", font=font(30, False), fill=75)
d.line([(cx - 45, cy + 158), (cx + 70, cy + 158)], fill=100, width=1)
marks = np.asarray(marks.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255
marks *= 0.55 + 0.45 * noise(25, 2)                                              # graphite breaks up on the tooth

# Compose the multiply layer: paper stays white where untouched
dark = np.clip(dark, 0, 1)
tint = np.clip(tint, 0, 1)
stain_rgb = np.array([0.78, 0.58, 0.38], np.float32)                             # warm brown of old tide marks
base = 1 - dark[..., None] * np.array([0.45, 0.66, 1.00], np.float32)           # darkening leans warm, toward amber
base = base * (1 - tint[..., None] * (1 - stain_rgb) * 0.35)
graphite = np.array([0.30, 0.28, 0.26], np.float32)
base = base * (1 - marks[..., None] * 0.40 * (1 - graphite))
base = base * np.array([1.0, 0.985, 0.93], np.float32)                           # an overall amber cast, as in the target
Image.fromarray((np.clip(base, 0, 1) * 255).astype(np.uint8)).save("opening/paper-age.png", optimize=True)
lit = np.clip(blur(np.clip(light, 0, 1), 1.2), 0, 1)
Image.fromarray((np.dstack([lit, lit * 0.95, lit * 0.85]) * 255).astype(np.uint8)).save("opening/paper-light.png", optimize=True)
print("paper-age.png and paper-light.png written")
