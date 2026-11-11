import { MIN_DIM, MAX_DIM, MAX_AREA } from './imageResize.js';
import { MESSAGES } from '../data/messages.js';

export const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const MIN_KB = 1;
export const MAX_KB = 20000;

/** ফাইলের প্রথম কয়েক বাইট দেখে আসল ফরম্যাট শনাক্ত (এক্সটেনশন বদলানো ফাইল ধরার জন্য) */
export async function sniffImageType(file) {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const ascii = (a, b) => String.fromCharCode(...head.slice(a, b));
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'image/jpeg';
  if (head[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  return null;
}

export async function validateFile(file) {
  if (!file) return { ok: false, error: MESSAGES.UNSUPPORTED };
  if (file.size === 0) return { ok: false, error: MESSAGES.EMPTY };
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: MESSAGES.TOO_BIG_FILE };
  let type = null;
  try {
    type = await sniffImageType(file);
  } catch {
    return { ok: false, error: MESSAGES.EMPTY };
  }
  if (!type) return { ok: false, error: MESSAGES.UNSUPPORTED };
  return { ok: true, type };
}

/** সেটিংসের ইনপুট যাচাই; ত্রুটি না থাকলে {} ফেরত */
export function validateDims(width, height) {
  const errors = {};
  const dimMsg = (label) => `${label} অবশ্যই ${MIN_DIM} থেকে ${MAX_DIM} Pixel-এর মধ্যে হতে হবে।`;
  if (width === '' || width == null) errors.width = 'প্রস্থ (Width) লিখুন।';
  else if (width < MIN_DIM || width > MAX_DIM) errors.width = dimMsg('প্রস্থ');
  if (height === '' || height == null) errors.height = 'উচ্চতা (Height) লিখুন।';
  else if (height < MIN_DIM || height > MAX_DIM) errors.height = dimMsg('উচ্চতা');
  if (!errors.width && !errors.height && width * height > MAX_AREA) {
    errors.height = 'মোট Pixel সংখ্যা অতিরিক্ত বেশি। প্রস্থ বা উচ্চতা কমিয়ে নিন।';
  }
  return errors;
}

export function validateKB(sizeKey, kb) {
  if (sizeKey !== 'custom') return null;
  if (kb === '' || kb == null) return 'সর্বোচ্চ KB লিখুন।';
  if (kb < MIN_KB || kb > MAX_KB) return `KB অবশ্যই ${MIN_KB} থেকে ${MAX_KB}-এর মধ্যে হতে হবে।`;
  return null;
}

export function validateSettings(s) {
  const errors = validateDims(s.width, s.height);
  const kbErr = validateKB(s.sizeKey, s.customKB);
  if (kbErr) errors.kb = kbErr;
  if (s.minKB !== '' && s.minKB != null) {
    if (s.minKB < MIN_KB || s.minKB > MAX_KB) errors.minKB = `KB অবশ্যই ${MIN_KB} থেকে ${MAX_KB}-এর মধ্যে হতে হবে।`;
    else if (!kbErr && s.sizeKey !== 'none') {
      const max = s.sizeKey === 'custom' ? Number(s.customKB) : Number(s.sizeKey);
      if (s.minKB > max) errors.minKB = 'সর্বনিম্ন সাইজ সর্বোচ্চ সাইজের চেয়ে বেশি হতে পারে না।';
    }
  }
  if (s.ratioKey === 'custom' && s.lock && !(s.customRW > 0 && s.customRH > 0)) {
    errors.ratio = 'কাস্টম অনুপাতের দুটি সংখ্যাই লিখুন (যেমন ৩ : ২)।';
  }
  return errors;
}
