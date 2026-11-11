import { Link2, Link2Off } from 'lucide-react';
import { NumberField, cx } from './ui.jsx';
import { MAX_DIM, MIN_DIM } from '../utils/imageResize.js';

export default function DimensionControls({ settings: s, actions: a, errors }) {
  const valid = !errors.width && !errors.height;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        <NumberField
          id="dim-width"
          label="প্রস্থ (Width)"
          suffix="px"
          value={s.width}
          onChange={a.setWidth}
          error={errors.width}
          placeholder="যেমন 300"
        />
        <button
          type="button"
          onClick={a.toggleLock}
          aria-pressed={s.lock}
          aria-label={s.lock ? 'অনুপাত লক চালু আছে — বন্ধ করতে চাপুন' : 'অনুপাত লক বন্ধ আছে — চালু করতে চাপুন'}
          title={s.lock ? 'অনুপাত ঠিক রাখা হচ্ছে' : 'প্রস্থ ও উচ্চতা আলাদাভাবে বদলানো যাবে'}
          className={cx(
            'mt-7 grid h-12 w-12 place-items-center rounded-xl border transition',
            s.lock ? 'border-brand bg-brandsoft text-brand' : 'border-line bg-surface text-muted hover:bg-sunken',
          )}
        >
          {s.lock ? <Link2 size={20} aria-hidden="true" /> : <Link2Off size={20} aria-hidden="true" />}
        </button>
        <NumberField
          id="dim-height"
          label="উচ্চতা (Height)"
          suffix="px"
          value={s.height}
          onChange={a.setHeight}
          error={errors.height}
          placeholder="যেমন 300"
        />
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        {s.lock
          ? 'অনুপাত ঠিক রাখা আছে — একটি মাপ বদলালে অন্যটি নিজে নিজে হিসাব হবে।'
          : 'অনুপাত লক বন্ধ — প্রস্থ ও উচ্চতা আলাদাভাবে লিখতে পারবেন।'}
      </p>

      <div className="flex items-center justify-between rounded-xl bg-sunken px-4 py-3">
        <span className="text-sm text-muted">চূড়ান্ত মাপ</span>
        <strong className="text-lg" data-testid="final-dims">
          {valid ? `${s.width} × ${s.height} px` : '—'}
        </strong>
      </div>
      <p className="text-xs text-muted">অনুমোদিত মাপ: {MIN_DIM} থেকে {MAX_DIM} Pixel পর্যন্ত। বাংলা সংখ্যাও (যেমন ৩০০) লিখতে পারবেন।</p>
    </div>
  );
}
