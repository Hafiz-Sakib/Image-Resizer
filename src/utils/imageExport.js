// ক্যানভাস তৈরি, Blob এনকোডিং ও ডাউনলোড — মেইন থ্রেড ও Web Worker দুই জায়গাতেই চলে

export const MIME = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
export const EXT = { jpeg: 'jpg', png: 'png', webp: 'webp' };

/** ১ KB = ১০০০ বাইট ধরে লক্ষ্য ঠিক করা হয়: তাহলে ১০২৪-ভিত্তিক ও ১০০০-ভিত্তিক — দুই ধরনের পোর্টালেই সীমার ভেতরে থাকে */
export function kbToBytes(kb) {
  return Math.floor(Number(kb) * 1000);
}

export function createCanvas(w, h) {
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  return new OffscreenCanvas(w, h);
}

export function releaseCanvas(c) {
  // সাফারি ও মোবাইলে ক্যানভাসের মেমরি দ্রুত ছাড়তে সাইজ শূন্য করা হয়
  try {
    c.width = 0;
    c.height = 0;
  } catch {
    /* উপেক্ষা */
  }
}

export function canvasToBlob(canvas, type, quality) {
  if (typeof canvas.convertToBlob === 'function') {
    return canvas.convertToBlob({ type, quality });
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(Object.assign(new Error('encode failed'), { code: 'PROCESS_FAILED' }))),
      type,
      quality,
    );
  });
}

export function buildFilename({ mode, width, height, format }) {
  const base = mode === 'signature' ? 'signature' : 'photo';
  return `${base}_${width}x${height}.${EXT[format] || 'jpg'}`;
}

/** একটি Object URL থেকে ফাইল ডাউনলোড চালু করে (মেইন থ্রেড) */
export function downloadUrl(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 0);
}
