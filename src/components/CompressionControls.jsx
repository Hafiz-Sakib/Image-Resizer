import { Alert, ChipGroup, NumberField } from './ui.jsx';
import { SIZE_OPTIONS } from '../data/presets.js';

export default function CompressionControls({ settings: s, actions: a, compression, errors }) {
  const options = [
    { value: 'none', label: 'সীমা নেই' },
    ...SIZE_OPTIONS.map((kb) => ({ value: String(kb), label: `${kb} KB` })),
    { value: 'custom', label: 'কাস্টম KB' },
  ];

  return (
    <div className="space-y-4">
      <ChipGroup legend="সর্বোচ্চ ফাইল সাইজ" name="size" options={options} value={s.sizeKey} onChange={a.setSize} />

      <div className="max-w-[14rem]">
        <NumberField
          id="min-kb"
          label="সর্বনিম্ন সাইজ (ঐচ্ছিক)"
          suffix="KB"
          value={s.minKB}
          onChange={a.setMinKB}
          error={errors?.minKB}
          placeholder="যেমন 4"
          hint="কিছু পোর্টালে ন্যূনতম KB-ও বলা থাকে"
        />
      </div>

      {s.sizeKey === 'custom' && (
        <div className="max-w-[14rem]">
          <NumberField
            id="custom-kb"
            label="সর্বোচ্চ সাইজ (KB)"
            suffix="KB"
            value={s.customKB}
            onChange={a.setCustomKB}
            error={compression.kbError}
            placeholder="যেমন 40"
          />
        </div>
      )}

      {compression.hasLimit && s.format !== 'png' && (
        <p className="text-sm text-muted">
          টুল স্বয়ংক্রিয়ভাবে কোয়ালিটি সামঞ্জস্য করে সীমার ভেতরে সর্বোচ্চ সম্ভাব্য মানের ছবি তৈরি করবে।
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
          <p className="mt-1 text-xs text-muted">কোয়ালিটি বেশি = ছবি স্পষ্ট, কিন্তু ফাইল বড়।</p>
        </div>
      )}

      {compression.pngLimitNotice && (
        <Alert tone="warn" title="PNG-তে KB সীমা মানা কঠিন হতে পারে">
          PNG ক্ষতিহীন (lossless) ফরম্যাট, তাই JPEG-এর মতো কোয়ালিটি কমিয়ে ফাইল সাইজ নিয়ন্ত্রণ করা যায় না। সীমার ভেতরে আনতে
          JPEG বেছে নিন, অথবা ছবির মাপ কমান।
        </Alert>
      )}
    </div>
  );
}
