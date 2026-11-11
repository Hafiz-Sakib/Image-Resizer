/* eslint-env worker */
// ছবির ভারী প্রসেসিং UI থ্রেডের বাইরে চালানোর Web Worker।
// ছবি শুধু এই ব্রাউজারের ভেতরেই থাকে — কোনো নেটওয়ার্ক রিকোয়েস্ট নেই।
import { processImage } from '../utils/imageProcessing.js';

const bitmaps = new Map();

self.onmessage = async (event) => {
  const { type, id, reqId } = event.data;
  try {
    if (type === 'load') {
      bitmaps.get(id)?.close?.();
      bitmaps.set(id, await createImageBitmap(event.data.file));
      self.postMessage({ type: 'loaded', reqId });
    } else if (type === 'release') {
      bitmaps.get(id)?.close?.();
      bitmaps.delete(id);
    } else if (type === 'process') {
      const bitmap = bitmaps.get(id);
      if (!bitmap) throw new Error('ছবি লোড করা নেই');
      const result = await processImage(bitmap, event.data.settings, { offscreen: true });
      self.postMessage({ type: 'done', reqId, result });
    }
  } catch (err) {
    self.postMessage({ type: 'error', reqId, message: String(err?.message || err), code: err?.code });
  }
};
