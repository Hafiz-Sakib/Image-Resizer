import { Alert, OptionCards, cx } from './ui.jsx';

const FORMATS = [
  { value: 'jpeg', title: 'JPEG (.jpg)', desc: 'সবচেয়ে বহুল ব্যবহৃত। ফাইল ছোট, KB নিয়ন্ত্রণ সহজ। আবেদনের ছবির জন্য সেরা।' },
  { value: 'png', title: 'PNG (.png)', desc: 'ক্ষতিহীন ও স্বচ্ছতা সমর্থন করে, কিন্তু ফাইল বড় হয়।' },
];

const SWATCHES = [
  { value: '#ffffff', label: 'সাদা' },
  { value: '#f1f5f9', label: 'হালকা ধূসর' },
  { value: '#000000', label: 'কালো' },
];

export default function FormatSelector({ settings: s, actions: a, info }) {
  const isJpeg = s.format === 'jpeg';
  const transparentChosen = s.bg === 'transparent';
  const isCustom = s.bg !== 'transparent' && !SWATCHES.some((x) => x.value === s.bg);

  return (
    <div className="space-y-5">
      <OptionCards legend="আউটপুট ফরম্যাট" name="format" cols="grid-cols-2" options={FORMATS} value={s.format} onChange={a.setFormat} />

      <fieldset>
        <legend className="mb-2 text-sm font-medium">ব্যাকগ্রাউন্ড রঙ</legend>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {SWATCHES.map((sw) => (
            <label key={sw.value} className="relative block min-w-0">
              <input
                type="radio"
                name="bg"
                className="peer sr-only"
                checked={s.bg === sw.value}
                onChange={() => a.setBg(sw.value)}
              />
              <span className="flex min-h-[2.5rem] w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-1.5 text-[0.8rem] font-medium leading-tight hover:bg-sunken sm:min-h-[2.75rem] sm:gap-2 sm:px-3 sm:text-sm peer-checked:border-brand peer-checked:ring-2 peer-checked:ring-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30">
                <span className="h-4 w-4 shrink-0 rounded-full border border-line sm:h-5 sm:w-5" style={{ background: sw.value }} />
                {sw.label}
              </span>
            </label>
          ))}

          <label className="relative block min-w-0">
            <input
              type="radio"
              name="bg"
              className="peer sr-only"
              checked={isCustom}
              onChange={() => a.setBg(isCustom ? s.bg : '#dbeafe')}
            />
            <span className="flex min-h-[2.5rem] w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-1.5 text-[0.8rem] font-medium leading-tight hover:bg-sunken sm:min-h-[2.75rem] sm:gap-2 sm:px-3 sm:text-sm peer-checked:border-brand peer-checked:ring-2 peer-checked:ring-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30">
              <input
                type="color"
                aria-label="নিজের পছন্দের ব্যাকগ্রাউন্ড রঙ বাছুন"
                value={s.bg === 'transparent' ? '#ffffff' : s.bg}
                onChange={(e) => a.setBg(e.target.value)}
                className="h-5 w-6 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0 sm:h-6 sm:w-8"
              />
              কাস্টম
            </span>
          </label>

          <label className={cx('relative block min-w-0', isJpeg && 'cursor-not-allowed')}>
            <input
              type="radio"
              name="bg"
              className="peer sr-only"
              disabled={isJpeg}
              checked={transparentChosen && !isJpeg}
              onChange={() => a.setBg('transparent')}
            />
            <span className="checker flex min-h-[2.5rem] w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-line px-1.5 text-[0.8rem] font-medium leading-tight sm:min-h-[2.75rem] sm:px-3 sm:text-sm peer-checked:border-brand peer-checked:ring-2 peer-checked:ring-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-40 peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30">
              স্বচ্ছ
            </span>
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">
          ছবির ফাঁকা অংশ (ফিট মোডে) ও স্বচ্ছ অংশ এই রঙে ভরবে। “স্বচ্ছ” শুধু PNG-তে চলে।
        </p>
      </fieldset>

      {isJpeg && info?.hasAlpha && (
        <Alert tone="warn" title="স্বচ্ছ ছবি JPEG-তে বদলানো হচ্ছে" live>
          আপনার ছবিতে স্বচ্ছ (transparent) অংশ আছে, কিন্তু JPEG স্বচ্ছতা সমর্থন করে না। তাই স্বচ্ছ অংশ উপরে নির্বাচিত ব্যাকগ্রাউন্ড রঙে
          ভরাট হবে। স্বচ্ছতা রাখতে চাইলে PNG বেছে নিন।
        </Alert>
      )}
    </div>
  );
}
