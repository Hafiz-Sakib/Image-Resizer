import { useEffect, useState } from 'react';

// ছোট রাউটার। হোম পেজের সেকশনগুলোর নিজস্ব পথ আছে (/photo, /signature, /presets ...),
// তাই URL-এ # না এসে সুন্দর লিংক দেখায়। Vercel-এর rewrite থাকায় সরাসরি লিংকও কাজ করে।
export const PATHS = {
  home: '/',
  photo: '/photo',
  signature: '/signature',
  presets: '/presets',
  why: '/why',
  how: '/how',
  developer: '/developer',
  importantLinks: '/ImportantLinks',
  notFound: '/404',
};

/** হোম পেজের কোন পথ কোন সেকশনে নিয়ে যাবে (tool থাকলে ছবি/স্বাক্ষর ট্যাবও বদলাবে) */
export const SECTIONS = {
  [PATHS.photo]: { id: 'workspace', tool: 'photo' },
  [PATHS.signature]: { id: 'workspace', tool: 'signature' },
  [PATHS.presets]: { id: 'presets' },
  [PATHS.why]: { id: 'why' },
  [PATHS.how]: { id: 'how' },
};

export const isHomePath = (p) => p === PATHS.home || p in SECTIONS;

// বড়-ছোট হাতের অক্ষরে পার্থক্য করা হয় না (/importantlinks ও /ImportantLinks একই পেজ); অচেনা পথ ৪০৪ পেজে যায়
const KNOWN = Object.values(PATHS);
const canonical = (p) => KNOWN.find((k) => k.toLowerCase() === p.toLowerCase()) || PATHS.notFound;
const normalize = (p) => canonical(p.replace(/\/+$/, '') || '/');

/** ব্রাউজারের বর্তমান পথ (ক্যানোনিকাল রূপে) */
export const currentPath = () => normalize(window.location.pathname);

/** নতুন পেজ/সেকশনে যাওয়া (ইতিহাসে নতুন এন্ট্রি যোগ হয়, তাই Back বাটন কাজ করে) */
export function navigate(to) {
  if (currentPath() !== to) window.history.pushState({}, '', to);
  window.dispatchEvent(new Event('bdir-nav'));
  if (!isHomePath(to)) window.scrollTo({ top: 0 });
}

/** স্ক্রলের সময় URL চুপচাপ বদলায় — ইতিহাসে নতুন এন্ট্রি হয় না */
export function setUrl(to) {
  if (currentPath() === to) return;
  window.history.replaceState({}, '', to);
  window.dispatchEvent(new Event('bdir-url'));
}

export function usePath() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const on = () => setPath(currentPath());
    window.addEventListener('popstate', on);
    window.addEventListener('bdir-nav', on);
    window.addEventListener('bdir-url', on);
    return () => {
      window.removeEventListener('popstate', on);
      window.removeEventListener('bdir-nav', on);
      window.removeEventListener('bdir-url', on);
    };
  }, []);
  return path;
}
