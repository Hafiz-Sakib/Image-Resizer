// ছবি প্রসেসিংয়ের মূল পাইপলাইন (এনভায়রনমেন্ট-নিরপেক্ষ: Worker ও মেইন থ্রেড দুটোতেই চলে)
import { computeDrawGeometry, MAX_AREA, MAX_SOURCE_PIXELS } from './imageResize.js';
import { createCanvas, releaseCanvas } from './imageExport.js';
import { encodeCanvas } from './imageCompression.js';
import { lanczosResize } from './lanczos.js';

export function coded(code, message = code) {
  return Object.assign(new Error(message), { code });
}

/** ফাইল → ডিকোড করা ছবি (ImageBitmap; না থাকলে <img> দিয়ে) */
export async function loadBitmap(file) {
  let img = null;
  if (typeof createImageBitmap === 'function') {
    try {
      img = await createImageBitmap(file);
    } catch {
      img = null;
    }
  } else if (typeof document === 'undefined') {
    throw coded('NO_BITMAP'); // Worker-এ সমর্থন নেই — মেইন থ্রেডে ফলব্যাক হবে
  }
  if (!img) img = await loadViaImageElement(file);
  if (img.width * img.height > MAX_SOURCE_PIXELS) {
    img.close?.();
    throw coded('TOO_MANY_PIXELS');
  }
  return img;
}

function loadViaImageElement(file) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(coded('DECODE_FAILED'));
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      URL.revokeObjectURL(url);
      resolve(el);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(coded('DECODE_FAILED'));
    };
    el.src = url;
  });
}

/** ছবিতে সত্যিকারের স্বচ্ছ অংশ আছে কি না (ছোট নমুনা এঁকে দেখা হয়) */
export function detectAlpha(img) {
  const scale = Math.min(1, 256 / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  let found = false;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] < 250) {
      found = true;
      break;
    }
  }
  releaseCanvas(c);
  return found;
}

/**
 * ছবি আঁকা। ছোট করার সময়: (বড় হলে) আগে ধাপে ধাপে অর্ধেক করে লক্ষ্যের ~২–৩ গুণে আনা হয়,
 * তারপর শেষ ধাপ Lanczos3 দিয়ে — ফলে ছবি ধারালো থাকে (ব্রাউজারের সাধারণ স্কেলিং ঝাপসা করে দেয়)।
 * বড় করার সময় ব্রাউজারের স্মুথ স্কেলিং ব্যবহার হয়।
 */
function drawHighQuality(ctx, img, g, bg) {
  const downscale = g.dw < g.sw || g.dh < g.sh;
  let cur = img;
  let cx = g.sx;
  let cy = g.sy;
  let cw = g.sw;
  let ch = g.sh;
  const temps = [];

  if (downscale) {
    while (cw / 2 >= g.dw * 3 && ch / 2 >= g.dh * 3) {
      const nw = Math.max(1, Math.floor(cw / 2));
      const nh = Math.max(1, Math.floor(ch / 2));
      const t = createCanvas(nw, nh);
      const tctx = t.getContext('2d');
      tctx.imageSmoothingEnabled = true;
      tctx.imageSmoothingQuality = 'high';
      tctx.drawImage(cur, cx, cy, cw, ch, 0, 0, nw, nh);
      temps.push(t);
      cur = t;
      cx = 0;
      cy = 0;
      cw = nw;
      ch = nh;
    }
    // উৎস অংশটি অপাক রঙে (সাদা/বেছে নেওয়া ব্যাকগ্রাউন্ডে) পিক্সেল-ডেটা হিসেবে নেওয়া
    const srcCanvas = createCanvas(cw, ch);
    const sctx = srcCanvas.getContext('2d', { willReadFrequently: true });
    sctx.fillStyle = bg === 'transparent' ? '#ffffff' : bg;
    sctx.fillRect(0, 0, cw, ch);
    sctx.drawImage(cur, cx, cy, cw, ch, 0, 0, cw, ch);
    const data = sctx.getImageData(0, 0, cw, ch).data;
    const resized = lanczosResize(data, cw, ch, g.dw, g.dh);
    const dstCanvas = createCanvas(g.dw, g.dh);
    const dctx = dstCanvas.getContext('2d');
    dctx.putImageData(new ImageData(resized, g.dw, g.dh), 0, 0);
    ctx.drawImage(dstCanvas, g.dx, g.dy);
    releaseCanvas(srcCanvas);
    releaseCanvas(dstCanvas);
    temps.forEach(releaseCanvas);
    return;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, cx, cy, cw, ch, g.dx, g.dy, g.dw, g.dh);
  temps.forEach(releaseCanvas);
}

/** স্বাক্ষর পরিষ্কার: ধূসর করে কালো/সাদা বিন্দু টেনে ব্যাকগ্রাউন্ড সাদা ও কালি গাঢ় করা */
function applyEnhance(ctx, w, h, strength) {
  const s = Math.min(Math.max(strength, 0), 100) / 100;
  const black = Math.round(s * 70);
  const white = Math.round(255 - s * 110);
  const range = Math.max(1, white - black);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    let v = ((g - black) * 255) / range;
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
}

/**
 * opts: { outW, outH, fit, crop, format, maxBytes, quality, bg, enhance }
 * ফেরত: { blob, width, height, quality, met, reason, size, mime, maxBytes }
 */
export async function processImage(img, opts) {
  const { outW, outH, fit, crop, format, maxBytes, minBytes, quality, bg, enhance } = opts;
  if (outW * outH > MAX_AREA) throw coded('OUTPUT_TOO_LARGE');

  const canvas = createCanvas(outW, outH);
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: Boolean(enhance) });
    // JPEG স্বচ্ছতা সমর্থন করে না, তাই সবসময় রঙ ভরা হয়; PNG/WebP-তে 'transparent' হলে ফাঁকা থাকে
    const opaque = format === 'jpeg' || bg !== 'transparent';
    if (opaque) {
      ctx.fillStyle = bg === 'transparent' ? '#ffffff' : bg;
      ctx.fillRect(0, 0, outW, outH);
    }
    const g = computeDrawGeometry({ fit, srcW: img.width, srcH: img.height, outW, outH, crop });
    drawHighQuality(ctx, img, g, bg);
    if (enhance) applyEnhance(ctx, outW, outH, enhance.strength);

    const enc = await encodeCanvas(canvas, { format, maxBytes, minBytes, quality });
    return {
      ...enc,
      width: outW,
      height: outH,
      mime: enc.blob.type,
      maxBytes: maxBytes || null,
    };
  } finally {
    releaseCanvas(canvas);
  }
}
