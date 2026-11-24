/*
  PixelBlast — a background of dithered pixel clouds that drift, shimmer and light up under the cursor (motion-brew style).

  <PixelBlast className="h-44 rounded-xl bg-brandsoft" />
  <PixelBlast color="#00694d" cellSize={6} shape="square" speed={1} area={1.4} heaviness={0.8} floor={false}>…children on top…</PixelBlast>

  - color: any hex ("#252528"). Leave it out and the pixels follow the app theme (--brand), switching with light/dark.
  - cellSize: dot grid pitch in px.  shape: "square" | "circle" | "diamond".
  - speed: drift speed multiplier.  area: how wide the clouds spread.  heaviness: how dense/heavy they are.
  - floor: adds a perspective floor of dot rows rolling toward the viewer.
  Hover lights the pixels around the cursor, a press sends a ripple, and a ripple rises on its own while the pointer is away.
  The loop pauses off screen; the canvas is sized from layout (not the transformed box); reduced motion draws one still frame.
*/
import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

function hash(x, y) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
// smooth value noise, 0..1
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// one colour: the prop if given, else the theme's brand token
function resolveColor(prop) {
  if (prop) return prop;
  if (typeof document === 'undefined') return '#00694d';
  const v = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  return v ? `rgb(${v.split(/\s+/).join(',')})` : '#00694d';
}

const CLOUDS = [
  { fx: 0.17, fy: 0.23, px: 0.4, py: 1.9, r: 0.62, w: 1, s: 3 },
  { fx: 0.21, fy: 0.15, px: 2.6, py: 0.7, r: 0.5, w: 0.9, s: 11 },
  { fx: 0.13, fy: 0.27, px: 4.4, py: 3.3, r: 0.56, w: 0.95, s: 23 },
];

export function PixelBlast({
  color, cellSize = 6, shape = 'square', speed = 1, area = 1.4, heaviness = 0.8, floor = false,
  className = '', children,
}) {
  const box = useRef(null);
  const cv = useRef(null);

  useEffect(() => {
    const el = box.current, canvas = cv.current;
    if (!el || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cell = Math.max(2, cellSize);

    let W = 0, H = 0, raf = 0, visible = true, fill = resolveColor(color);
    const t0 = performance.now();
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, g: 0, tg: 0, inside: false };
    const ripples = [];
    let lastAuto = t0;

    const dot = (x, y, s) => {
      if (s <= 0) return;
      const h = s / 2;
      if (shape === 'circle') { ctx.beginPath(); ctx.arc(x, y, h, 0, TAU); ctx.fill(); }
      else if (shape === 'diamond') { ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + h, y); ctx.lineTo(x, y + h); ctx.lineTo(x - h, y); ctx.closePath(); ctx.fill(); }
      else ctx.fillRect(x - h, y - h, s, s);
    };

    const draw = (now, introP) => {
      const t = ((now - t0) / 1000) * speed + 8;
      const real = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = fill;
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const aspect = W / H;
      const cl = CLOUDS.map((c) => ({ ...c, cx: 0.5 + 0.42 * Math.sin(t * c.fx + c.px), cy: 0.5 + 0.38 * Math.sin(t * c.fy + c.py) }));
      const dens = 0.55 + heaviness * 0.75;
      const R = cell * 9, maxD = Math.hypot(W / 2, H / 2) * 1.1;
      const front = introP * maxD, ringW = cell * 3;
      const live = ripples.filter((r) => real - r.t < 1.8);
      ripples.length = 0; ripples.push(...live);

      for (let j = 0; j < rows; j++) {
        const ny = (j + 0.5) / rows, y = (j + 0.5) * cell;
        for (let i = 0; i < cols; i++) {
          const nx = (i + 0.5) / cols, x = (i + 0.5) * cell;
          let v = 0;
          for (const c of cl) {
            const dx = (nx - c.cx) * aspect, dy = ny - c.cy;
            const n = noise(nx * aspect * 5 + c.s + t * 0.15, ny * 5 + c.s - t * 0.1);
            const d = Math.hypot(dx, dy) / (c.r * area * (0.55 + 0.9 * n));
            v += Math.exp(-d * d * 2.2) * c.w;
          }
          let level = v * dens;
          level *= 0.86 + 0.14 * Math.sin(real * 2.2 + hash(i, j) * TAU);
          if (ptr.g > 0.001) {
            const dd = Math.hypot(x - ptr.x, y - ptr.y);
            level += ptr.g * Math.exp(-(dd * dd) / (R * R)) * 1.3;
          }
          for (const r of live) {
            const age = real - r.t, dd = Math.hypot(x - r.x, y - r.y);
            const k = (dd - age * 240) / ringW;
            level += Math.exp(-k * k) * (1 - age / 1.8) * 1.2;
          }
          if (introP < 1) {
            const dc = Math.hypot(x - W / 2, y - H / 2);
            if (dc > front) continue;
            const k = (dc - front) / ringW;
            level += Math.exp(-k * k) * 0.9 * (1 - introP);
          }
          const s = level * 4, base = Math.floor(s);
          const step = clamp(base + (s - base > BAYER[(j & 3) * 4 + (i & 3)] ? 1 : 0), 0, 4);
          if (step) dot(x, y, Math.max(1, cell * 0.9 * (step / 4)));
        }
      }

      if (floor) {
        const rowsN = 9, top = H * 0.6;
        for (let k = 0; k < rowsN; k++) {
          const z = ((k + real * 0.35 * speed) % rowsN) / rowsN;
          const y = top + (H - top) * z * z, sp = cell * (1.4 + z * 4.5);
          ctx.globalAlpha = Math.min(1, z * 1.6) * 0.8;
          for (let x = (W / 2) % sp; x < W; x += sp) dot(x, y, cell * (0.25 + 0.55 * z));
        }
        ctx.globalAlpha = 1;
      }
    };

    const intro = (now) => (still ? 1 : 1 - Math.pow(1 - clamp((now - t0) / 1400), 3));

    const frame = (now) => {
      raf = 0;
      if (!visible) return;
      ptr.x += (ptr.tx - ptr.x) * 0.25; ptr.y += (ptr.ty - ptr.y) * 0.25;
      ptr.g += (ptr.tg - ptr.g) * 0.12;
      if (!ptr.inside && now - lastAuto > 4200) {
        lastAuto = now;
        ripples.push({ x: W * (0.25 + Math.random() * 0.5), y: H * (0.25 + Math.random() * 0.5), t: (now - t0) / 1000 });
      }
      draw(now, intro(now));
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !still && visible) raf = requestAnimationFrame(frame); };

    const size = () => {
      W = el.clientWidth; H = el.clientHeight; // layout size, ignores transforms
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) draw(t0 + 4000, 1);
    };

    const local = (e) => {
      const r = el.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / (r.width || W)), y: (e.clientY - r.top) * (H / (r.height || H)) };
    };
    const move = (e) => { const p = local(e); ptr.tx = p.x; ptr.ty = p.y; if (!ptr.inside) { ptr.x = p.x; ptr.y = p.y; } ptr.inside = true; ptr.tg = 1; };
    const leave = () => { ptr.inside = false; ptr.tg = 0; lastAuto = performance.now(); };
    const down = (e) => { const p = local(e); ripples.push({ x: p.x, y: p.y, t: (performance.now() - t0) / 1000 }); };

    size();
    const ro = new ResizeObserver(size); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(el);
    // theme switch → pick up the new brand colour
    const mo = new MutationObserver(() => { fill = resolveColor(color); if (still) draw(t0 + 4000, 1); });
    if (!color) mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    if (!still) {
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave); el.addEventListener('pointerdown', down);
    }
    start();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect();
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', down);
    };
  }, [color, cellSize, shape, speed, area, heaviness, floor]);

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`}>
      <canvas ref={cv} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}

export default PixelBlast;
