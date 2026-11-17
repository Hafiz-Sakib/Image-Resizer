import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Download } from 'lucide-react';
import { buildFilename, downloadUrl } from '../utils/imageExport.js';
import { cx } from './ui.jsx';

/* ক্লিকে ভরাট হওয়া বার, তারপর টিক চিহ্ন (motion-brew download-button ধাঁচে) */
export default function DownloadButton({ processor, settings, className, compact }) {
  const { result, url, busy } = processor;
  const disabled = !result || !url || busy;
  const [phase, setPhase] = useState('idle'); // idle | running | done
  const timers = useRef([]);
  const filename = result ? buildFilename({ mode: settings.mode, width: result.width, height: result.height, format: settings.format }) : '';

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const click = () => {
    if (phase === 'running') return;
    downloadUrl(url, filename);
    setPhase('running');
    timers.current.push(setTimeout(() => setPhase('done'), 700), setTimeout(() => setPhase('idle'), 2600));
  };

  const label = phase === 'done' ? 'ডাউনলোড হয়েছে' : 'ছবি ডাউনলোড করুন';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={click}
      data-testid="download-btn"
      className={cx('btn-primary relative overflow-hidden', compact ? 'px-5' : 'w-full py-3.5 text-lg', className)}
    >
      {phase === 'running' && (
        <motion.span aria-hidden="true" className="absolute inset-y-0 left-0 bg-white/25" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.7, ease: 'easeInOut' }} />
      )}
      <span className="relative flex items-center gap-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={phase === 'done' ? 'c' : 'd'} initial={{ scale: 0.4, opacity: 0, rotate: -40 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.18 }} className="grid place-items-center">
            {phase === 'done' ? <Check size={compact ? 18 : 22} strokeWidth={3} aria-hidden="true" /> : <Download size={compact ? 18 : 22} aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
        <span aria-live="polite">{label}</span>
      </span>
    </button>
  );
}
