import { NumberField, cx } from './ui.jsx';
import { MAX_DIM, MIN_DIM } from '../utils/imageResize.js';

export default function DimensionControls({ settings: s, actions: a, errors }) {
  const valid = !errors.width && !errors.height;
  return (
    <div className="space-y-2.5 sm:space-y-4">
      <div className="grid grid-cols-2 items-start gap-3">
        <NumberField
          id="dim-width"
          label="প্রস্থ (Width)"
          suffix="px"
          value={s.width}
          onChange={a.setWidth}
          error={errors.width}
          placeholder="যেমন 300"
        />
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

      <label
        htmlFor="dim-lock"
        className={cx(
          'flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 transition sm:px-4',
          s.lock ? 'border-brand bg-brandsoft' : 'border-line bg-surface hover:bg-sunken',
        )}
      >
        <input
          id="dim-lock"
          type="checkbox"
          checked={s.lock}
          onChange={a.toggleLock}
          className="h-5 w-5 shrink-0 cursor-pointer accent-brand"
        />
        <span className="text-sm font-medium sm:text-base">অনুপাত ঠিক রাখুন (Maintain aspect ratio)</span>
      </label>

      <p className="text-xs text-muted sm:text-sm" aria-live="polite">
        {s.lock
          ? 'একটি মাপ বদলালে অন্যটি নিজে নিজে হিসাব হবে। ছবি আপলোড করলে আসল মাপ বসে যাবে।'
          : 'অনুপাত লক বন্ধ — প্রস্থ ও উচ্চতা আলাদাভাবে লিখতে পারবেন (ছবি চেপে/টেনে যেতে পারে)।'}
      </p>

      <div className="flex items-center justify-between rounded-xl bg-sunken px-3 py-2 sm:px-4 sm:py-3">
        <span className="text-xs text-muted sm:text-sm">চূড়ান্ত মাপ</span>
        <strong className="text-base sm:text-lg" data-testid="final-dims">
          {valid ? `${s.width} × ${s.height} px` : '—'}
        </strong>
      </div>
      <p className="text-[0.7rem] leading-snug text-muted sm:text-xs">অনুমোদিত মাপ: {MIN_DIM} থেকে {MAX_DIM} Pixel পর্যন্ত। বাংলা সংখ্যাও (যেমন ৩০০) লিখতে পারবেন।</p>
    </div>
  );
}
