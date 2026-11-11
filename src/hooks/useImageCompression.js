import { useMemo } from 'react';
import { validateKB } from '../utils/imageValidation.js';

/**
 * সেটিংস থেকে ফাইল সাইজ সংক্রান্ত তথ্য বের করে:
 * maxKB (null = সীমা নেই), kbError, এবং PNG-এর জন্য সতর্কতা দরকার কি না
 */
export default function useImageCompression(settings) {
  const { sizeKey, customKB, format } = settings;
  return useMemo(() => {
    const kbError = validateKB(sizeKey, customKB);
    let maxKB = null;
    if (sizeKey === 'custom') maxKB = kbError ? null : Number(customKB);
    else if (sizeKey !== 'none') maxKB = Number(sizeKey);
    return {
      maxKB,
      kbError,
      hasLimit: sizeKey !== 'none',
      pngLimitNotice: format === 'png' && sizeKey !== 'none',
    };
  }, [sizeKey, customKB, format]);
}
