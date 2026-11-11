import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
      title={dark ? 'লাইট মোড' : 'ডার্ক মোড'}
      className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-ink transition hover:bg-sunken"
    >
      {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  );
}
