import { useCallback, useEffect, useState } from 'react';

const KEY = 'bdir.theme';

function initial() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default function useTheme() {
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#081210' : '#00694d');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* প্রাইভেট মোডে সংরক্ষণ নাও চলতে পারে */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
