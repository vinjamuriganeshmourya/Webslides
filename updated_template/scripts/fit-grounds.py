"""Fit CSS radial-gradient stacks to a reference background (needs numpy, scipy, pillow).

  python3 scripts/fit-grounds.py <reference.png> <out.json> <layers> < init.json

Used to produce src/design/grounds.ts; the init JSON gives a base colour and
one [cx, cy, rx, ry, r, g, b, a] row per layer in slide fractions. Env:
FIT_TRIALS (restarts), FIT_SIGMA (restart jitter).
"""
"""Fit a stack of CSS radial-gradients to a reference background.

Model = CSS semantics: a base colour, then K radial-gradient layers composited
source-over, bottom first. Each layer: ellipse centre (cx, cy), radii (rx, ry)
in slide units (fraction of width / height), a colour and a peak alpha; alpha
falls off from the centre along a fixed 5-stop profile that the CSS reproduces
exactly (same colour at every stop, so premultiplied interpolation == linear
alpha).
"""
import sys, json, os
import numpy as np
from PIL import Image, ImageFilter
from scipy.optimize import minimize

src, out_json, K = sys.argv[1], sys.argv[2], int(sys.argv[3])
W, H = 192, 108
ref_img = Image.open(src).convert('RGB').filter(ImageFilter.GaussianBlur(3))
ref = np.asarray(ref_img.resize((W, H), Image.LANCZOS)).astype(np.float64) / 255
ys, xs = np.mgrid[0:H, 0:W]
X = (xs + 0.5) / W
Y = (ys + 0.5) / H
STOPS_T = np.array([0, 0.25, 0.5, 0.75, 1.0])
STOPS_F = np.array([1, 0.78, 0.37, 0.10, 0.0])


def render(p, w=W, h=H):
    if (w, h) != (W, H):
        yy, xx = np.mgrid[0:h, 0:w]
        Xg, Yg = (xx + 0.5) / w, (yy + 0.5) / h
    else:
        Xg, Yg = X, Y
    img = np.ones((h, w, 3)) * np.clip(p[:3], 0, 1)
    layers = p[3:].reshape(K, 8)
    for cx, cy, rx, ry, r, g, b, a in layers:
        rx, ry = max(rx, 0.02), max(ry, 0.02)
        d = np.sqrt(((Xg - cx) / rx) ** 2 + ((Yg - cy) / ry) ** 2)
        f = np.interp(d, STOPS_T, STOPS_F)
        alpha = (np.clip(a, 0, 1) * f)[..., None]
        col = np.clip(np.array([r, g, b]), 0, 1)
        img = alpha * col + (1 - alpha) * img
    return img


def loss(p):
    return np.mean((render(p) - ref) ** 2)


init = json.loads(sys.stdin.read())
p0 = np.array(init['base'] + sum(init['layers'], []), dtype=np.float64)
assert len(p0) == 3 + 8 * K, (len(p0), K)
bounds = [(0, 1)] * 3
for _ in range(K):
    bounds += [(-0.6, 1.6), (-0.6, 1.6), (0.05, 2.5), (0.05, 2.5), (0, 1), (0, 1), (0, 1), (0, 1)]

best = None
rng = np.random.default_rng(1)
for trial in range(int(os.environ.get('FIT_TRIALS','4'))):
    start = p0 if trial == 0 else p0 + rng.normal(0, float(os.environ.get('FIT_SIGMA','0.04')), p0.shape)
    res = minimize(loss, start, method='L-BFGS-B', bounds=bounds, options={'maxiter': 600, 'maxfun': 60000})
    print(f'trial {trial}: rmse {np.sqrt(res.fun) * 255:.2f}', file=sys.stderr)
    if best is None or res.fun < best.fun:
        best = res
p = best.x
full = render(p, 384, 216)
ref_full = np.asarray(ref_img.resize((384, 216), Image.LANCZOS)).astype(np.float64) / 255
err = np.abs(full - ref_full) * 255
print(f'FINAL rmse {np.sqrt(best.fun) * 255:.2f}  mean abs {err.mean():.2f}  p99 {np.percentile(err, 99):.1f}  max {err.max():.1f}', file=sys.stderr)

# CSS, top layer first
layers = p[3:].reshape(K, 8)
css = []
for cx, cy, rx, ry, r, g, b, a in layers[::-1]:
    rgb = f'{int(round(np.clip(r,0,1)*255))},{int(round(np.clip(g,0,1)*255))},{int(round(np.clip(b,0,1)*255))}'
    a = float(np.clip(a, 0, 1))
    stops = ', '.join(f'rgba({rgb},{a*f:.3f}) {int(t*100)}%' for t, f in zip(STOPS_T, STOPS_F))
    css.append(f'radial-gradient({rx*1920:.0f}px {ry*1080:.0f}px at {cx*1920:.0f}px {cy*1080:.0f}px, {stops})')
base = p[:3]
base_hex = '#%02X%02X%02X' % tuple(int(round(np.clip(v,0,1)*255)) for v in base)
json.dump({'css': css, 'base': base_hex, 'params': p.tolist()}, open(out_json, 'w'), indent=1)
Image.fromarray((np.clip(full,0,1)*255).astype(np.uint8)).save(out_json.replace('.json', '.png'))
print('\n'.join(css) + '\n' + base_hex)
