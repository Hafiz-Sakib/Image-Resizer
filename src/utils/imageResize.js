import { gcd } from './format.js';
import { getCropRect } from './imageCrop.js';

export const MIN_DIM = 10;
export const MAX_DIM = 5000;
/** মোবাইল ব্রাউজারের ক্যানভাস সীমা (iOS ≈ ১৬.৭ মেগাপিক্সেল) মাথায় রেখে */
export const MAX_AREA = 16_000_000;
export const MAX_SOURCE_PIXELS = 120_000_000;

export const RATIO_KEYS = ['1:1', '3:1', '4:3', '3:4', '16:9'];

/** অনুপাতের সংখ্যাগত মান (প্রস্থ ÷ উচ্চতা) */
export function ratioValue({ ratioKey, customRW, customRH, srcW, srcH }) {
  if (ratioKey === 'original') return srcW && srcH ? srcW / srcH : 1;
  if (ratioKey === 'custom') return customRW > 0 && customRH > 0 ? customRW / customRH : null;
  const [a, b] = ratioKey.split(':').map(Number);
  return a / b;
}

/** প্রস্থ-উচ্চতা থেকে মিলে যাওয়া অনুপাতের অবস্থা */
export function ratioStateFromDims(w, h) {
  const g = gcd(w, h);
  const rw = w / g;
  const rh = h / g;
  const key = `${rw}:${rh}`;
  if (RATIO_KEYS.includes(key)) return { ratioKey: key };
  return { ratioKey: 'custom', customRW: rw, customRH: rh };
}

/**
 * আঁকার জ্যামিতি: মূল ছবির কোন অংশ (sx,sy,sw,sh) আউটপুটের কোথায় (dx,dy,dw,dh) বসবে
 */
export function computeDrawGeometry({ fit, srcW, srcH, outW, outH, crop }) {
  if (fit === 'crop') {
    const r = getCropRect(srcW, srcH, outW / outH, crop);
    return { sx: r.x, sy: r.y, sw: r.w, sh: r.h, dx: 0, dy: 0, dw: outW, dh: outH };
  }
  if (fit === 'fit') {
    const scale = Math.min(outW / srcW, outH / srcH);
    const dw = Math.max(1, Math.round(srcW * scale));
    const dh = Math.max(1, Math.round(srcH * scale));
    return {
      sx: 0,
      sy: 0,
      sw: srcW,
      sh: srcH,
      dx: Math.round((outW - dw) / 2),
      dy: Math.round((outH - dh) / 2),
      dw,
      dh,
    };
  }
  // stretch
  return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: outW, dh: outH };
}
