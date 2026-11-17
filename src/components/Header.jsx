import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import InstallButton from './InstallButton.jsx';
import { PATHS, navigate, usePath } from '../utils/router.js';

const LINKS = [
  { id: 'photo', label: 'ছবি রিসাইজ করুন', path: PATHS.photo },
  { id: 'signature', label: 'স্বাক্ষর রিসাইজ করুন', path: PATHS.signature },
  { id: 'presets', label: 'প্রিসেট', path: PATHS.presets },
  { id: 'links', label: 'গুরুত্বপূর্ণ লিংক', path: PATHS.importantLinks },
  { id: 'dev', label: 'ডেভেলপার', path: PATHS.developer },
];

export default function Header({ theme, onToggleTheme, install }) {
  const currentPath = usePath();

  const go = (e, path) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate(path);
  };

  return (
    <header
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      className="sticky top-0 z-40 border-b-[3px] border-accent bg-surface/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <a href={PATHS.home} onClick={(e) => go(e, PATHS.home)} aria-label="সরকারি চাকরি — হোম">
          <Logo />
        </a>

        {/* ডেস্কটপ মেনু; মোবাইলে নিচের ট্যাব বার ব্যবহার হয় */}
        <nav aria-label="প্রধান মেনু" className="mx-auto hidden items-center gap-1 rounded-full border border-line bg-sunken/70 p-1 lg:flex">
          {LINKS.map((l) => {
            const current = l.path === currentPath;
            return (
              <a
                key={l.id}
                href={l.path}
                onClick={(e) => go(e, l.path)}
                aria-current={current ? 'page' : undefined}
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
        </div>
      </div>
    </header>
  );
}
