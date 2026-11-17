import { ChipGroup } from './ui.jsx';

/** ওয়ার্কস্পেসের ভেতরের ছোট প্রিসেট বাছাই + বর্তমান সেটিং প্রিসেট হিসেবে সংরক্ষণ */
export default function PresetSelector({ presets, settings: s, actions: a }) {
  const visible = presets.list.filter((p) => p.kind === s.mode);
  const options = [
    ...visible.map((p) => ({ value: p.id, label: (
        <span className="flex flex-col items-center">
          <span>{p.name}</span>
          <span className="text-[0.68rem] opacity-75 sm:text-xs">{p.width}×{p.height}</span>
        </span>
      ),
    })),
    { value: 'custom', label: 'কাস্টম সাইজ' },
  ];
  const value = s.activePresetId && visible.some((p) => p.id === s.activePresetId) ? s.activePresetId : 'custom';
  const onPick = (v) => {
    if (v === 'custom') {
      a.customSize();
      // প্রস্থের ঘরে কার্সর গিয়ে লেখা অংশ সিলেক্ট হয়ে থাকবে — সরাসরি নতুন মাপ লিখুন
      setTimeout(() => {
        const el = document.getElementById('dim-width');
        el?.focus({ preventScroll: false });
        el?.select();
      }, 60);
      return;
    }
    const p = presets.list.find((x) => x.id === v);
    if (p) a.applyPreset(p);
  };

  return (
    <div className="space-y-2.5">
      <ChipGroup legend="প্রিসেট" hideLegend name="preset" options={options} value={value} onChange={onPick} />
      <p className="text-[0.72rem] leading-snug text-muted sm:text-xs">
        অন্য মাপ লাগলে “কাস্টম সাইজ” চাপুন, তারপর সার্কুলার দেখে প্রস্থ, উচ্চতা ও KB নিজে লিখে দিন।
      </p>

    </div>
  );
}
