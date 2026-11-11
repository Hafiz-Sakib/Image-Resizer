// ছবি প্রসেসিং Web Worker — UI থ্রেড আটকে না রেখে ডিকোড, রিসাইজ ও কমপ্রেস করে।
// সবকিছু এই ব্রাউজারের ভেতরেই ঘটে; কোনো নেটওয়ার্ক রিকোয়েস্ট নেই।
import { loadBitmap, processImage, detectAlpha } from '../utils/imageCore.js';

let bitmap = null;
let latestProcessId = 0;
let chain = Promise.resolve();

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'process') latestProcessId = m.id;
  chain = chain.then(() => handle(m)).catch(() => {});
};

async function handle(m) {
  try {
    if (m.type === 'load') {
      const next = await loadBitmap(m.file);
      bitmap?.close?.();
      bitmap = next;
      const hasAlpha = /png|webp/.test(m.mime || '') ? detectAlpha(bitmap) : false;
      self.postMessage({ id: m.id, ok: true, info: { width: bitmap.width, height: bitmap.height, hasAlpha } });
    } else if (m.type === 'process') {
      if (m.id !== latestProcessId) return self.postMessage({ id: m.id, ok: true, skipped: true });
      if (!bitmap) throw Object.assign(new Error('no image'), { code: 'PROCESS_FAILED' });
      const result = await processImage(bitmap, m.opts);
      self.postMessage({ id: m.id, ok: true, result });
    } else if (m.type === 'clear') {
      bitmap?.close?.();
      bitmap = null;
      self.postMessage({ id: m.id, ok: true });
    }
  } catch (err) {
    self.postMessage({ id: m.id, ok: false, error: err.code || 'PROCESS_FAILED' });
  }
}
