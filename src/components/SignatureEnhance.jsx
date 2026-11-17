import { Switch } from './ui.jsx';

export default function SignatureEnhance({ settings: s, actions: a }) {
  return (
    <div className="space-y-4">
      <Switch
        checked={s.enhanceOn}
        onChange={(v) => a.setEnhance({ enhanceOn: v })}
        label="স্বাক্ষর ক্লিন করুন"
        description="কাগজে সই করে ছবি তুললে ব্যাকগ্রাউন্ড ধূসর দেখায়। এটা অন করলে ব্যাকগ্রাউন্ড সাদা আর কালি গাঢ় হবে, ফাইলও ছোট হয়।"
      />
      {s.enhanceOn && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="enhance" className="text-sm font-medium">
              ক্লিন করার মাত্রা
            </label>
            <span className="text-sm font-semibold text-brand">{s.enhanceStrength}%</span>
          </div>
          <input
            id="enhance"
            type="range"
            min="0"
            max="100"
            value={s.enhanceStrength}
            onChange={(e) => a.setEnhance({ enhanceStrength: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer accent-[rgb(var(--brand))]"
            aria-valuetext={`${s.enhanceStrength} শতাংশ`}
          />
          <p className="mt-1 text-xs text-muted">সইয়ের হালকা দাগ মুছে গেলে মাত্রা কমিয়ে দিন।</p>
        </div>
      )}
    </div>
  );
}
