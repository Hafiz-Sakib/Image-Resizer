import { useEffect, useState } from 'react';

// খুব ছোট রাউটার: "/" (হোম) ও "/developer" — Vercel-এর rewrite থাকায় সরাসরি লিংকও কাজ করে
export const PATHS = { home: '/', developer: '/developer' };

let pending = null;

const normalize = (p) => p.replace(/\/+$/, '') || '/';

/** পেজ বদলের পর হোম কী করবে (যেমন নির্দিষ্ট সেকশনে স্ক্রল) তা এক বার পড়ে নেওয়া যায় */
export const takePending = () => {
  const p = pending;
  pending = null;
  return p;
};

export function navigate(to, pend = null) {
  pending = pend;
  if (normalize(window.location.pathname) !== to) window.history.pushState({}, '', to);
  window.dispatchEvent(new Event('bdir-nav'));
  if (!pend) window.scrollTo({ top: 0 });
}

export function usePath() {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  useEffect(() => {
    const on = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', on);
    window.addEventListener('bdir-nav', on);
    return () => {
      window.removeEventListener('popstate', on);
      window.removeEventListener('bdir-nav', on);
    };
  }, []);
  return path;
}
