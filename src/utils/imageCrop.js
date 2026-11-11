// ক্রপ এলাকার গণিত। ক্রপ সংরক্ষণ হয় {cx, cy, zoom} হিসেবে (cx, cy = মূল ছবির ০–১ অনুপাতে কেন্দ্র)
// ফলে আউটপুটের অনুপাত বদলালেও ক্রপ এলাকা স্বাভাবিকভাবে মানিয়ে নেয়।

export const MAX_ZOOM = 8;
export const DEFAULT_CROP = { cx: 0.5, cy: 0.5, zoom: 1 };

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/** মূল ছবির ভেতরে নির্দিষ্ট অনুপাতের সবচেয়ে বড় আয়তক্ষেত্র */
export function maxCropSize(srcW, srcH, aspect) {
  let w = srcW;
  let h = w / aspect;
  if (h > srcH) {
    h = srcH;
    w = h * aspect;
  }
  return { w, h };
}

/** ক্রপ অবস্থা → মূল ছবির পিক্সেলে আয়তক্ষেত্র {x,y,w,h} */
export function getCropRect(srcW, srcH, aspect, crop = DEFAULT_CROP) {
  const m = maxCropSize(srcW, srcH, aspect);
  const zoom = clamp(crop.zoom || 1, 1, MAX_ZOOM);
  const w = m.w / zoom;
  const h = m.h / zoom;
  const x = clamp(crop.cx * srcW - w / 2, 0, srcW - w);
  const y = clamp(crop.cy * srcH - h / 2, 0, srcH - h);
  return { x, y, w, h };
}

/** আয়তক্ষেত্র → ক্রপ অবস্থা */
export function rectToCrop(srcW, srcH, aspect, rect) {
  const m = maxCropSize(srcW, srcH, aspect);
  return {
    cx: (rect.x + rect.w / 2) / srcW,
    cy: (rect.y + rect.h / 2) / srcH,
    zoom: clamp(m.w / rect.w, 1, MAX_ZOOM),
  };
}

/** আয়তক্ষেত্র সরানো (সীমানার ভেতরে) */
export function moveRect(rect, dx, dy, srcW, srcH) {
  return {
    ...rect,
    x: clamp(rect.x + dx, 0, srcW - rect.w),
    y: clamp(rect.y + dy, 0, srcH - rect.h),
  };
}

/**
 * কোণ ধরে টানলে উল্টো কোণ স্থির রেখে আয়তক্ষেত্রের মাপ বদলায়, অনুপাত অপরিবর্তিত থাকে।
 * corner: 'nw' | 'ne' | 'sw' | 'se'; p = মূল ছবির পিক্সেলে পয়েন্টার অবস্থান
 */
export function resizeRectFromCorner(rect, corner, p, srcW, srcH, aspect) {
  const east = corner.includes('e');
  const south = corner.includes('s');
  const ox = east ? rect.x : rect.x + rect.w; // উল্টো কোণ
  const oy = south ? rect.y : rect.y + rect.h;
  const dirX = east ? 1 : -1;
  const dirY = south ? 1 : -1;
  const roomX = dirX > 0 ? srcW - ox : ox;
  const roomY = dirY > 0 ? srcH - oy : oy;
  const m = maxCropSize(srcW, srcH, aspect);
  const maxW = Math.min(roomX, roomY * aspect, m.w);
  const minW = m.w / MAX_ZOOM;
  const raw = Math.max(dirX * (p.x - ox), dirY * (p.y - oy) * aspect);
  const w = clamp(raw, minW, Math.max(minW, maxW));
  const h = w / aspect;
  return { x: dirX > 0 ? ox : ox - w, y: dirY > 0 ? oy : oy - h, w, h };
}
