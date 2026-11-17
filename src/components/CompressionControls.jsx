import { Alert, ChipGroup, NumberField } from './ui.jsx';
import { SIZE_OPTIONS } from '../data/presets.js';

export default function CompressionControls({ settings: s, actions: a, compression, errors }) {
  const options = [
    { value: 'none', label: 'সীমা নেই' },
    ...SIZE_OPTIONS.map((kb) => ({ value: String(kb), label: `${kb} KB` })),
    { value: 'custom', label: 'কাস্টম KB' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <ChipGroup legend="সর্বোচ্চ ফাইল সাইজ" name="size" options={options} value={s.sizeKey} onChange={a.setSize} />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <NumberField
          id="min-kb"
          label="সর্বনিম্ন (অপশনাল)"
          suffix="KB"
          value={s.minKB}
          onChange={a.setMinKB}
          error={errors?.minKB}
          placeholder="যেমন 4"
        />
        {s.sizeKey === 'custom' && (
          <NumberField
            id="custom-kb"
            label="সর্বোচ্চ (KB)"
            suffix="KB"
            value={s.customKB}
            onChange={a.setCustomKB}
            error={compression.kbError}
            placeholder="যেমন 40"
          />
        )}
      </div>

      {compression.hasLimit && s.format !== 'png' && (
        <p className="text-sm text-muted">
          টুল নিজেই কোয়ালিটি অ্যাডজাস্ট করে সীমার ভেতরে সবচেয়ে ভালো মানের ছবি বানিয়ে দেবে।
        </p>
      )}

      {!compression.hasLimit && s.format !== 'png' && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="quality" className="text-sm font-medium">
              কোয়ালিটি
            </label>
            <span className="text-sm font-semibold text-brand">{s.quality}%</span>
          </div>
          <input
            id="quality"
            type="range"
            min="10"
            max="100"
            step="1"
            value={s.quality}
            onChange={(e) => a.setQuality(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-[rgb(var(--brand))]"
            aria-valuetext={`${s.quality} শতাংশ`}
          />
          <p className="mt-1 text-xs text-muted">কোয়ালিটি বেশি হলে ছবি পরিষ্কার হয়, কিন্তু ফাইল বড় হয়।</p>
        </div>
      )}

      {compression.pngLimitNotice && (
        <Alert tone="warn" title="PNG-তে KB সীমার মধ্যে আনা কঠিন হতে পারে">
          PNG লসলেস ফরম্যাট, তাই JPEG-এর মতো কোয়ালিটি কমিয়ে সাইজ ছোট করা যায় না। সীমার ভেতরে আনতে
          JPEG সিলেক্ট করুন, অথবা ছবির মাপ কমান।
        </Alert>
      )}
    </div>
  );
}
