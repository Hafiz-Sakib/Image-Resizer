// Lanczos3 রিসাইজ — ছবি ছোট করার সময় ধারালো ও পরিষ্কার ফলাফল দেয় (iLoveIMG/Photoshop-ধরনের মান)
// ব্রাউজারের ক্যানভাস স্কেলিং ছোট করার সময় ঝাপসা করে ফেলে, ফলে মুখ শনাক্তকরণে সমস্যা হতে পারে।

const A = 3;

function kernel(x) {
  if (x === 0) return 1;
  if (x <= -A || x >= A) return 0;
  const px = Math.PI * x;
  return (A * Math.sin(px) * Math.sin(px / A)) / (px * px);
}

/** এক অক্ষের জন্য প্রতিটি আউটপুট পিক্সেলের ওজন তৈরি */
function buildWeights(srcLen, dstLen) {
  const scale = dstLen / srcLen;
  const fscale = Math.min(1, scale); // ছোট করার সময় কার্নেল প্রশস্ত হয়
  const support = A / fscale;
  const out = new Array(dstLen);
  for (let i = 0; i < dstLen; i++) {
    const center = (i + 0.5) / scale;
    const start = Math.max(0, Math.floor(center - support));
    const end = Math.min(srcLen - 1, Math.ceil(center + support) - 1);
    const w = [];
    let sum = 0;
    for (let j = start; j <= end; j++) {
      const v = kernel((j + 0.5 - center) * fscale);
      w.push(v);
      sum += v;
    }
    if (sum !== 0) for (let k = 0; k < w.length; k++) w[k] /= sum;
    out[i] = { start, w };
  }
  return out;
}

/**
 * RGBA (সব অপাক, alpha=255) পিক্সেল ডেটাকে sw×sh থেকে dw×dh করে।
 * ফেরত: Uint8ClampedArray (RGBA)
 */
export function lanczosResize(src, sw, sh, dw, dh) {
  const wx = buildWeights(sw, dw);
  const wy = buildWeights(sh, dh);

  // অনুভূমিক ধাপ: sw×sh → dw×sh
  const tmp = new Float32Array(dw * sh * 3);
  for (let y = 0; y < sh; y++) {
    const row = y * sw * 4;
    for (let x = 0; x < dw; x++) {
      const { start, w } = wx[x];
      let r = 0;
      let g = 0;
      let b = 0;
      for (let k = 0; k < w.length; k++) {
        const p = row + (start + k) * 4;
        const wk = w[k];
        r += src[p] * wk;
        g += src[p + 1] * wk;
        b += src[p + 2] * wk;
      }
      const o = (y * dw + x) * 3;
      tmp[o] = r;
      tmp[o + 1] = g;
      tmp[o + 2] = b;
    }
  }

  // উল্লম্ব ধাপ: dw×sh → dw×dh
  const out = new Uint8ClampedArray(dw * dh * 4);
  for (let y = 0; y < dh; y++) {
    const { start, w } = wy[y];
    for (let x = 0; x < dw; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let k = 0; k < w.length; k++) {
        const o = ((start + k) * dw + x) * 3;
        const wk = w[k];
        r += tmp[o] * wk;
        g += tmp[o + 1] * wk;
        b += tmp[o + 2] * wk;
      }
      const p = (y * dw + x) * 4;
      out[p] = r;
      out[p + 1] = g;
      out[p + 2] = b;
      out[p + 3] = 255;
    }
  }
  return out;
}
