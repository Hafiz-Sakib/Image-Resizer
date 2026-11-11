import { renderCanvas, releaseCanvas } from './imageResize.js';
import { compressCanvas } from './imageCompression.js';

/**
 * পুরো পাইপলাইন: রিসাইজ/ক্রপ → ব্যাকগ্রাউন্ড → কমপ্রেস → যাচাই।
 * মূল থ্রেড ও Web Worker — দুই জায়গাতেই একই কোড চলে।
 */
export async function processImage(bitmap, settings, { offscreen = false } = {}) {
  const canvas = renderCanvas(bitmap, settings, { offscreen });
  try {
    const maxBytes = settings.maxKB ? Math.floor(settings.maxKB * 1024) : null;
    const out = await compressCanvas(canvas, {
      format: settings.format,
      quality: settings.quality,
      maxBytes,
    });
    return {
      blob: out.blob,
      size: out.blob.size,
      width: settings.width,
      height: settings.height,
      format: settings.format,
      mime: out.blob.type,
      quality: out.quality,
      met: out.met,
      maxBytes,
      minBytes: out.minBytes,
    };
  } finally {
    releaseCanvas(canvas);
  }
}
