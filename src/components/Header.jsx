import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import InstallButton from './InstallButton.jsx';
import { PATHS, navigate } from '../utils/router.js';

const LINKS = [
  { id: 'photo', href: '#workspace', label: 'ছবি রিসাইজ করুন', tool: 'photo' },
  { id: 'signature', href: '#workspace', label: 'স্বাক্ষর রিসাইজ করুন', tool: 'signature' },
  { id: 'presets', href: '#presets', label: 'প্রিসেট' },
  { id: 'links', href: PATHS.importantLinks, label: 'গুরুত্বপূর্ণ লিংক', path: PATHS.importantLinks },
  { id: 'dev', href: '/developer', label: 'ডেভেলপার', path: '/developer' },
];

export default function Header({ theme, onToggleTheme, onTool, onGoto, activeMode, install, currentPath = '/' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onOutside = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [open]);

  const go = (e, l) => {
    e.preventDefault();
    setOpen(false);
    if (l.path) navigate(l.path);
    else if (l.tool) onTool(l.tool);
    else onGoto(l.href.slice(1));
  };

  return (
    <header
      ref={ref}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      className="sticky top-0 z-40 border-b-[3px] border-accent bg-surface/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <a href="#top" onClick={(e) => {
            e.preventDefault();
            if (currentPath !== '/') navigate('/');
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }} aria-label="সরকারি চাকরি — হোম">
          <Logo />
        </a>

        <nav aria-label="প্রধান মেনু" className="mx-auto hidden items-center gap-1 rounded-full border border-line bg-sunken/70 p-1 lg:flex">
          {LINKS.map((l) => {
            const current = l.path ? l.path === currentPath : currentPath === '/' && l.tool && l.tool === activeMode;
            return (
              <a
                key={l.id}
                href={l.href}
                onClick={(e) => go(e, l)}
                aria-current={current ? 'true' : undefined}
                className={`inline-flex min-h-[2.5rem] items-center rounded-full px-4 text-sm font-medium transition hover:bg-surface ${current ? 'bg-surface text-brand shadow-sm' : ''}`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <InstallButton install={install} variant="header" />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface lg:hidden"
            aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="মোবাইল মেনু"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-surface lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 p-3 sm:px-6">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l)}
                    className="flex min-h-[3rem] items-center rounded-xl px-4 text-base font-medium hover:bg-sunken"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
