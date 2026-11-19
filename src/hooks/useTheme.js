import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const KEY = 'bdir.theme';
/* Day/night switch: slow, soft circle. Night grows out of the button, day shrinks back into it (CSS in styles/index.css) */
export const SWITCH_MS = 1300;
const SWITCH_EASE = 'cubic-bezier(.5,.05,.25,1)';
const BG = { light: '#00694d', dark: '#070c0b' };

function initial() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function paint(theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[theme]);
}

export default function useTheme() {
  const [theme, setTheme] = useState(initial);

  useEffect(() => paint(theme), [theme]);

  /** origin: বোতামটি — নতুন থিম এখান থেকে বৃত্তের মতো ছড়িয়ে পড়ে (View Transitions থাকলে) */
  const toggle = useCallback((origin) => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch { /* প্রাইভেট মোডে সংরক্ষণ নাও চলতে পারে */ }
    const root = document.documentElement;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const apply = () => { paint(next); setTheme(next); };

    if (!still && origin?.getBoundingClientRect && typeof document.startViewTransition === 'function') {
      const r = origin.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const st = root.style;
      st.setProperty('--vt-x', `${x}px`); st.setProperty('--vt-y', `${y}px`);
      st.setProperty('--vt-reach', `${reach}px`); st.setProperty('--vt-ms', `${SWITCH_MS}ms`); st.setProperty('--vt-ease', SWITCH_EASE);
      root.dataset.themeSwitch = next === 'dark' ? 'to-dark' : 'to-light';
      const vt = document.startViewTransition(() => flushSync(apply));
      // দুই দিকের অ্যানিমেশনই CSS-এ (styles/index.css) — শেষে <html>-এ কিছু পড়ে থাকে না, তাই পরের বার ভুল clip হয় না
      vt.ready.catch((e) => console.warn('[theme] view transition skipped:', e));
      vt.finished.finally(() => {
        delete root.dataset.themeSwitch;
        ['--vt-x', '--vt-y', '--vt-reach', '--vt-ms', '--vt-ease'].forEach((k) => st.removeProperty(k));
      });
      return;
    }
    if (still) return apply();
    root.classList.add('theme-fade');
    apply();
    setTimeout(() => root.classList.remove('theme-fade'), 1100);
  }, []);

  return { theme, toggle };
}
