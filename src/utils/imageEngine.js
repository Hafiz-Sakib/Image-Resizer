// ইঞ্জিন: Web Worker থাকলে সেখানে, না থাকলে (বা ক্র্যাশ করলে) মেইন থ্রেডে একই কোড চালায়
import { loadBitmap, processImage, detectAlpha } from './imageCore.js';

const DOMAIN_ERRORS = new Set(['DECODE_FAILED', 'TOO_MANY_PIXELS', 'PROCESS_FAILED', 'OUTPUT_TOO_LARGE']);

function supportsWorker() {
  return (
    typeof Worker !== 'undefined' &&
    typeof OffscreenCanvas !== 'undefined' &&
    typeof createImageBitmap === 'function' &&
    typeof OffscreenCanvas.prototype.convertToBlob === 'function'
  );
}

function createWorkerClient() {
  let worker = null;
  let seq = 0;
  const pending = new Map();

  const failAll = (err) => {
    pending.forEach((p) => p.reject(err));
    pending.clear();
  };

  function ensure() {
    if (worker) return worker;
    worker = new Worker(new URL('../workers/image.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const m = e.data;
      const p = pending.get(m.id);
      if (!p) return;
      pending.delete(m.id);
      if (m.ok) p.resolve(m);
      else p.reject(Object.assign(new Error(m.error), { code: m.error }));
    };
    worker.onerror = () => {
      failAll(Object.assign(new Error('worker crashed'), { code: 'WORKER_CRASH' }));
      worker?.terminate();
      worker = null;
    };
    return worker;
  }

  return {
    call(type, payload = {}) {
      return new Promise((resolve, reject) => {
        const id = ++seq;
        pending.set(id, { resolve, reject });
        try {
          ensure().postMessage({ id, type, ...payload });
        } catch (err) {
          pending.delete(id);
          reject(Object.assign(err, { code: 'WORKER_CRASH' }));
        }
      });
    },
    terminate() {
      failAll(Object.assign(new Error('terminated'), { code: 'TERMINATED' }));
      worker?.terminate();
      worker = null;
    },
  };
}

export function createEngine() {
  let client = supportsWorker() ? createWorkerClient() : null;
  let inlineImg = null;
  let currentFile = null;

  async function inlineLoad(file) {
    const img = await loadBitmap(file);
    inlineImg?.close?.();
    inlineImg = img;
    const hasAlpha = /png|webp/.test(file.type) ? detectAlpha(img) : false;
    return { width: img.width, height: img.height, hasAlpha };
  }

  const shouldFallback = (err) => err.code !== 'TERMINATED' && !DOMAIN_ERRORS.has(err.code);

  return {
    /** ছবি লোড করে {width, height, hasAlpha} ফেরত দেয় */
    async load(file, mime) {
      currentFile = file;
      if (client) {
        try {
          const r = await client.call('load', { file, mime: mime || file.type });
          return r.info;
        } catch (err) {
          if (!shouldFallback(err)) throw err;
          client = null; // Worker কাজ না করলে মেইন থ্রেডে চলবে
        }
      }
      return inlineLoad(file);
    },

    /** প্রসেস করে {blob, width, height, quality, met, reason, size, ...} ফেরত দেয় */
    async process(opts) {
      if (client) {
        try {
          const r = await client.call('process', { opts });
          return r.skipped ? { skipped: true } : r.result;
        } catch (err) {
          if (!shouldFallback(err)) throw err;
          client = null;
          if (currentFile) await inlineLoad(currentFile);
        }
      }
      if (!inlineImg) throw Object.assign(new Error('no image'), { code: 'PROCESS_FAILED' });
      return processImage(inlineImg, opts);
    },

    /** মেমরি ছেড়ে দেয় (ছবি মুছলে) */
    clear() {
      currentFile = null;
      if (client) client.call('clear').catch(() => {});
      inlineImg?.close?.();
      inlineImg = null;
    },

    dispose() {
      client?.terminate();
      inlineImg?.close?.();
      inlineImg = null;
      currentFile = null;
    },
  };
}
