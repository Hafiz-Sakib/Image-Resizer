import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const KEY = 'bdir.theme';
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
      root.dataset.themeSwitch = next === 'dark' ? 'to-dark' : 'to-light';
      const vt = document.startViewTransition(() => flushSync(apply));
      vt.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`] },
          { duration: 800, easing: 'cubic-bezier(.65,.05,.25,1)', pseudoElement: '::view-transition-new(root)' },
        );
      }).catch(() => {});
      vt.finished.finally(() => { delete root.dataset.themeSwitch; });
      return;
    }
    if (still) return apply();
    root.classList.add('theme-fade');
    apply();
    setTimeout(() => root.classList.remove('theme-fade'), 500);
  }, []);

  return { theme, toggle };
}
