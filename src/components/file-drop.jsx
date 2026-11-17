/*
  FileDrop — animated drop zone with an upload progress ring (motion-brew style).

  <FileDrop maxSize={5 * 1024 * 1024} upload={(file, progress) => uploadWithProgress(file, progress)} />

  - upload(file, progress): return a promise; call progress(0..100) while working. Throw to show an error
    (throw an error with `silent: true` to reset quietly when the caller already shows its own message).
  - maxSize: bytes; bigger files are rejected before upload starts.
  Idle -> hover/drag -> uploading (ring + %) -> done (tick) -> idle. Click, keyboard and drag-and-drop all work.
*/
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Check, ImagePlus, UploadCloud, X } from 'lucide-react';

const fmt = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const R = 28;
const C = 2 * Math.PI * R;

export function FileDrop({
  upload,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/jpeg,image/png,image/webp',
  title = 'ছবি এখানে ছাড়ুন',
  hint = 'অথবা ক্লিক করে বেছে নিন',
  button = 'ছবি নির্বাচন করুন',
  formats = 'JPG, PNG, WEBP',
  className = '',
  inputProps = {},
}) {
  const reduce = useReducedMotion();
  const input = useRef(null);
  const timers = useRef([]);
  const [drag, setDrag] = useState(false);
  const [st, setSt] = useState({ phase: 'idle', pct: 0, name: '', size: 0, error: '' });

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const run = async (file) => {
    if (!file || st.phase === 'uploading') return;
    if (file.size > maxSize) {
      setSt({ phase: 'error', pct: 0, name: file.name, size: file.size, error: `ফাইল বড় (${fmt(file.size)}) — সর্বোচ্চ ${fmt(maxSize)}।` });
      later(() => setSt((s) => (s.phase === 'error' ? { ...s, phase: 'idle' } : s)), 3500);
      return;
    }
    setSt({ phase: 'uploading', pct: 0, name: file.name, size: file.size, error: '' });
    try {
      await upload(file, (p) => setSt((s) => (s.phase === 'uploading' ? { ...s, pct: Math.max(s.pct, Math.min(100, Math.round(p))) } : s)));
      setSt((s) => ({ ...s, phase: 'done', pct: 100 }));
      later(() => setSt((s) => ({ ...s, phase: 'idle', pct: 0 })), 1400);
    } catch (e) {
      if (e?.silent) return setSt({ phase: 'idle', pct: 0, name: '', size: 0, error: '' });
      setSt((s) => ({ ...s, phase: 'error', error: e?.message || 'আপলোড হয়নি, আবার চেষ্টা করুন।' }));
      later(() => setSt((s) => (s.phase === 'error' ? { ...s, phase: 'idle' } : s)), 3500);
    }
  };

  const pick = () => st.phase !== 'uploading' && input.current?.click();
  const busy = st.phase === 'uploading';

  return (
    <div className={className}>
      <input
        ref={input}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-label="ছবি নির্বাচন করুন"
        data-testid="file-input"
        {...inputProps}
        onChange={(e) => { run(e.target.files?.[0]); e.target.value = ''; }}
      />
      <motion.div
        role="button"
        tabIndex={0}
        aria-busy={busy}
        aria-label="ছবি আপলোড করুন — ক্লিক করুন বা ছবি টেনে এনে ছাড়ুন"
        onClick={pick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } }}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrag(false); }}
        onDrop={(e) => { e.preventDefault(); setDrag(false); run(e.dataTransfer.files?.[0]); }}
        animate={st.phase === 'error' && !reduce ? { x: [0, -8, 8, -5, 5, 0] } : { scale: drag && !reduce ? 1.02 : 1, x: 0 }}
        transition={{ duration: st.phase === 'error' ? 0.4 : 0.25 }}
        className={`relative flex min-h-[15rem] cursor-pointer select-none flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
          st.phase === 'error' ? 'border-err bg-errsoft/60'
            : drag || busy || st.phase === 'done' ? 'border-brand bg-brandsoft'
              : 'border-line bg-sunken/50 hover:border-brand/60 hover:bg-brandsoft/60'
        }`}
      >
        {/* drag glow */}
        <AnimatePresence>
          {drag && (
            <motion.span aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(var(--brand)/.22),transparent_65%)]" />
          )}
        </AnimatePresence>

        <div className="relative grid h-[4.5rem] w-[4.5rem] place-items-center">
          {/* progress ring */}
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="4" />
            <motion.circle cx="32" cy="32" r={R} fill="none" stroke={st.phase === 'error' ? 'rgb(var(--err))' : 'rgb(var(--brand))'} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={C} initial={false} animate={{ strokeDashoffset: C * (1 - (busy || st.phase === 'done' ? st.pct / 100 : 0)), opacity: busy || st.phase === 'done' ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }} />
          </svg>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={st.phase} initial={{ scale: 0.4, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.18 }}
              className={`grid h-12 w-12 place-items-center rounded-2xl shadow-card ${st.phase === 'error' ? 'bg-err text-white' : 'bg-brand text-onbrand'}`}>
              {st.phase === 'done' ? <Check size={24} strokeWidth={3} aria-hidden="true" />
                : st.phase === 'error' ? <AlertCircle size={24} aria-hidden="true" />
                  : busy ? <span className="text-sm font-bold tabular-nums">{st.pct}%</span>
                    : <motion.span animate={drag && !reduce ? { y: [0, -5, 0] } : { y: 0 }} transition={{ repeat: drag ? Infinity : 0, duration: 0.7 }}><UploadCloud size={24} aria-hidden="true" /></motion.span>}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="relative min-h-[3.25rem]" aria-live="polite">
          {st.phase === 'idle' && (
            <>
              <p className="text-xl font-semibold">{drag ? 'এবার ছেড়ে দিন' : title}</p>
              <p className="mt-1 text-sm text-muted">{hint}</p>
            </>
          )}
          {busy && (<><p className="max-w-[16rem] truncate text-lg font-semibold" title={st.name}>{st.name}</p><p className="text-sm text-muted">{fmt(st.size)} · লোড হচ্ছে…</p></>)}
          {st.phase === 'done' && (<><p className="text-lg font-semibold text-brand">ছবি নেওয়া হয়েছে</p><p className="text-sm text-muted">{st.name}</p></>)}
          {st.phase === 'error' && (<><p className="text-lg font-semibold text-err">ছবি নেওয়া যায়নি</p><p className="max-w-xs text-sm text-err">{st.error}</p></>)}
        </div>

        {st.phase === 'idle' && (
          <span className="btn-primary pointer-events-none relative mt-1"><ImagePlus size={18} aria-hidden="true" /> {button}</span>
        )}
        <p className="relative text-xs text-muted">সমর্থিত ফরম্যাট: {formats} · সর্বোচ্চ {fmt(maxSize)}</p>

        {st.phase === 'error' && (
          <button type="button" aria-label="বন্ধ করুন" onClick={(e) => { e.stopPropagation(); setSt((s) => ({ ...s, phase: 'idle' })); }} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-surface/80 text-err">
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default FileDrop;
