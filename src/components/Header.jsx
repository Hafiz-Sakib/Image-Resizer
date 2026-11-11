import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Menu, Newspaper, Puzzle, Send, X } from 'lucide-react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import InstallButton from './InstallButton.jsx';
import { PATHS, navigate } from '../utils/router.js';
import { IMPORTANT_LINKS } from '../data/links.js';

const ICONS = { newspaper: Newspaper, send: Send, puzzle: Puzzle };

const LINKS = [
  { id: 'photo', href: '#workspace', label: 'ছবি রিসাইজ করুন', tool: 'photo' },
  { id: 'signature', href: '#workspace', label: 'স্বাক্ষর রিসাইজ করুন', tool: 'signature' },
  { id: 'presets', href: '#presets', label: 'প্রিসেট' },
  { id: 'links', href: PATHS.importantLinks, label: 'গুরুত্বপূর্ণ লিংক', path: PATHS.importantLinks, menu: true },
  { id: 'dev', href: '/developer', label: 'ডেভেলপার', path: '/developer' },
];

/** নেভবারের "গুরুত্বপূর্ণ লিংক" ড্রপডাউন — হোভার/ক্লিক/কিবোর্ডে খোলে, লিংকে ক্লিক করলে নতুন ট্যাবে সাইট খোলে */
function LinksDropdown({ link, current, onOpenPage }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onOutside = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [open]);

  return (
    <div ref={box} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-current={current ? 'true' : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex min-h-[2.5rem] items-center gap-1 rounded-full px-4 text-sm font-medium transition hover:bg-surface ${current || open ? 'bg-surface text-brand shadow-sm' : ''}`}
      >
        {link.label}
        <ChevronDown size={16} aria-hidden="true" className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-2"
          >
            <div className="card overflow-hidden p-2 shadow-pop">
              <ul className="space-y-1">
                {IMPORTANT_LINKS.map((l) => {
                  const Icon = ICONS[l.icon] || ExternalLink;
                  return (
                    <li key={l.id}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-brandsoft"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandsoft text-brand group-hover:bg-surface">
                          <Icon size={20} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 font-semibold leading-snug">
                            {l.title}
                            <ExternalLink size={13} aria-hidden="true" className="shrink-0 text-muted" />
                          </span>
                          <span className="block text-xs leading-relaxed text-muted">{l.tagline}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <a
                href={PATHS.importantLinks}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  onOpenPage();
                }}
                className="mt-1 flex min-h-[2.75rem] items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-onbrand hover:opacity-90"
              >
                সব লিংক ও শর্টকাট দেখুন
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
            if (l.menu) return <LinksDropdown key={l.id} link={l} current={current} onOpenPage={() => navigate(l.path)} />;
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
                  {l.menu && (
                    <ul className="mb-1 ml-4 space-y-0.5 border-l-2 border-brand/30 pl-3">
                      {IMPORTANT_LINKS.map((q) => (
                        <li key={q.id}>
                          <a
                            href={q.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="flex min-h-[2.75rem] items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-sunken hover:text-brand"
                          >
                            {q.title}
                            <ExternalLink size={13} aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
