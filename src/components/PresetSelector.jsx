import { useState } from 'react';
import { BookmarkPlus, Check } from 'lucide-react';
import { ChipGroup } from './ui.jsx';
import { validateSettings } from '../utils/imageValidation.js';

/** ওয়ার্কস্পেসের ভেতরের ছোট প্রিসেট বাছাই + বর্তমান সেটিং প্রিসেট হিসেবে সংরক্ষণ */
export default function PresetSelector({ presets, settings: s, actions: a, maxKB }) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
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
  const canSave = Object.keys(validateSettings(s)).length === 0;

  const onPick = (v) => {
    if (v === 'custom') return a.clearPreset();
    const p = presets.list.find((x) => x.id === v);
    if (p) a.applyPreset(p);
  };

  const save = (e) => {
    e.preventDefault();
    const p = presets.add({
      name: name.trim(),
      kind: s.mode,
      width: s.width,
      height: s.height,
      maxKB,
      minKB: s.minKB === '' ? null : s.minKB,
      format: s.format,
      fit: s.mode === 'signature' ? 'fit' : 'crop',
    });
    if (p) {
      a.patch({ activePresetId: p.id });
      setName('');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <ChipGroup legend="প্রিসেট" hideLegend name="preset" options={options} value={value} onChange={onPick} />
      <p className="text-[0.72rem] leading-snug text-muted sm:text-xs">
        প্রিসেট শুধু উদাহরণ। আপনার আবেদনের বিজ্ঞপ্তিতে দেওয়া সঠিক মাপ ও KB নিজে লিখে নিন।
      </p>

      {!saving ? (
        <button
          type="button"
          disabled={!canSave}
          onClick={() => setSaving(true)}
          className="btn-ghost min-h-[2.25rem] w-full px-3 text-[0.8rem] sm:w-auto sm:min-h-[2.5rem] sm:text-sm"
        >
          <BookmarkPlus size={16} aria-hidden="true" /> বর্তমান সেটিং প্রিসেট হিসেবে সংরক্ষণ করুন
        </button>
      ) : (
        <form onSubmit={save} className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="new-preset-name">
            প্রিসেটের নাম
          </label>
          <input
            id="new-preset-name"
            autoFocus
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="প্রিসেটের নাম, যেমন: বিসিএস ছবি"
            className="input"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary px-4">
              <Check size={18} aria-hidden="true" /> সংরক্ষণ
            </button>
            <button type="button" onClick={() => setSaving(false)} className="btn-ghost px-4">
              বাতিল
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
