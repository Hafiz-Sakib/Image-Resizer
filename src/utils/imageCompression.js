import { MIME, canvasToBlob } from './imageExport.js';

// JPEG কোয়ালিটি সার্চের সীমা
export const Q_MAX = 0.95;
export const Q_MIN = 0.05;
const ITERATIONS = 9; // (০.৯ ÷ ২^৯) ≈ ০.২% নির্ভুলতা

/**
 * ক্যানভাসকে নির্বাচিত ফরম্যাটে এনকোড করে।
 * - maxBytes থাকলে বাইনারি সার্চে সীমার ভেতরের সর্বোচ্চ কোয়ালিটি খোঁজে।
 * - প্রকৃত Blob সাইজ মেপে met (সীমা পূরণ হয়েছে কি না) নির্ধারণ করে — কখনো অনুমান করে না।
 *
 * ফেরত: { blob, quality (০–১ বা null), met, reason, size }
 * reason: 'ok' | 'too_large' | 'png_over' | 'format_unsupported'
 */
export async function encodeCanvas(canvas, { format, maxBytes = null, minBytes = null, quality = 0.92 }) {
  const res = await encodeInner(canvas, { format, maxBytes, quality });
  // সর্বনিম্ন সাইজ চাওয়া হলে ও ফাইল ছোট হলে JPEG-তে সর্বোচ্চ কোয়ালিটিতে আবার চেষ্টা
  if (minBytes && res.reason === 'ok' && res.size < minBytes) {
    if (format === 'jpeg') {
      const hi = await canvasToBlob(canvas, MIME.jpeg, 1);
      if (hi.size > res.size && (!maxBytes || hi.size <= maxBytes)) {
        res.blob = hi;
        res.size = hi.size;
        res.quality = 1;
      }
    }
    if (res.size < minBytes) res.belowMin = true;
  }
  return res;
}

async function encodeInner(canvas, { format, maxBytes, quality }) {
  const type = MIME[format];

  // PNG: ক্ষতিহীন, কোয়ালিটি প্যারামিটার নেই
  if (format === 'png') {
    const blob = await canvasToBlob(canvas, type);
    const met = maxBytes ? blob.size <= maxBytes : true;
    return { blob, quality: null, met, reason: met ? 'ok' : 'png_over', size: blob.size };
  }

  const unsupported = (blob) => blob.type !== type; // ব্রাউজার অনুরোধ করা ফরম্যাট এনকোড না পারলে PNG ফেরত দেয়
  const done = (blob, q, met, reason) => ({ blob, quality: q, met, reason, size: blob.size });

  // সীমা নেই: ব্যবহারকারীর নির্ধারিত কোয়ালিটিতে একবারেই
  if (!maxBytes) {
    const blob = await canvasToBlob(canvas, type, quality);
    if (unsupported(blob)) return done(blob, null, false, 'format_unsupported');
    return done(blob, quality, true, 'ok');
  }

  // ১) সর্বোচ্চ কোয়ালিটিতেই সীমার ভেতরে হলে সেটাই সেরা
  const top = await canvasToBlob(canvas, type, Q_MAX);
  if (unsupported(top)) return done(top, null, false, 'format_unsupported');
  if (top.size <= maxBytes) return done(top, Q_MAX, true, 'ok');

  // ২) সর্বনিম্ন কোয়ালিটিতেও না হলে লক্ষ্য অসম্ভব
  const floor = await canvasToBlob(canvas, type, Q_MIN);
  if (floor.size > maxBytes) return done(floor, Q_MIN, false, 'too_large');

  // ৩) বাইনারি সার্চ: সীমার ভেতরে সবচেয়ে বেশি কোয়ালিটি
  let lo = Q_MIN;
  let hi = Q_MAX;
  let best = { blob: floor, q: Q_MIN };
  for (let i = 0; i < ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, type, mid);
    if (blob.size <= maxBytes) {
      best = { blob, q: mid };
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return done(best.blob, best.q, true, 'ok');
}
