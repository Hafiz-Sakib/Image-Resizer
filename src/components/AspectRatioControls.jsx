import { Crop, Maximize, Move } from 'lucide-react';
import { Alert, ChipGroup, NumberField, OptionCards } from './ui.jsx';

const FIT_OPTIONS = [
  {
    value: 'crop',
    title: 'ক্রপ করে ভরান',
    icon: <Crop size={16} aria-hidden="true" />,
    desc: 'মাপ পূর্ণ করতে ছবির বাড়তি অংশ কেটে ফেলা হবে। ক্রপ এলাকা আপনি নিজে ঠিক করতে পারবেন।',
  },
  {
    value: 'fit',
    title: 'ভেতরে ফিট করুন',
    icon: <Maximize size={16} aria-hidden="true" />,
    desc: 'পুরো ছবি অক্ষত থাকবে; ফাঁকা অংশ ব্যাকগ্রাউন্ড রঙে ভরবে। স্বাক্ষরের জন্য উপযুক্ত।',
  },
  {
    value: 'stretch',
    title: 'টেনে সমান করুন',
    icon: <Move size={16} aria-hidden="true" />,
    desc: 'ছবি টেনে ঠিক নির্ধারিত মাপে আনা হবে। ছবির আকার বিকৃত হতে পারে।',
  },
];

export default function AspectRatioControls({ settings: s, actions: a, errors }) {
  const hasSrc = s.srcW != null;
  const options = [
    { value: '1:1', label: '1:1' },
    { value: '3:1', label: '3:1' },
    { value: '4:3', label: '4:3' },
    { value: '3:4', label: '3:4' },
    { value: '16:9', label: '16:9' },
    { value: 'original', label: 'মূল অনুপাত', disabled: !hasSrc },
    { value: 'custom', label: 'কাস্টম অনুপাত' },
  ];

  return (
    <div className="space-y-5">
      <ChipGroup
        legend="অনুপাত (Aspect Ratio)"
        name="ratio"
        options={options}
        value={s.ratioKey}
        onChange={(v) => (v === 'custom' ? a.setCustomRatio(s.customRW || 1, s.customRH || 1) : a.setRatio(v))}
      />
      {!hasSrc && <p className="-mt-3 text-xs text-muted">“মূল অনুপাত” ব্যবহার করতে আগে একটি ছবি আপলোড করুন।</p>}

      {s.ratioKey === 'custom' && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
          <NumberField
            id="ratio-w"
            label="অনুপাতের প্রস্থ অংশ"
            value={s.customRW}
            onChange={(v) => a.setCustomRatio(v, s.customRH)}
          />
          <span className="mt-9 text-xl font-bold text-muted" aria-hidden="true">
            :
          </span>
          <NumberField
            id="ratio-h"
            label="অনুপাতের উচ্চতা অংশ"
            value={s.customRH}
            onChange={(v) => a.setCustomRatio(s.customRW, v)}
          />
          {errors.ratio && (
            <p role="alert" className="col-span-3 text-sm text-err">
              {errors.ratio}
            </p>
          )}
        </div>
      )}

      <OptionCards legend="ছবি সামঞ্জস্যের পদ্ধতি" name="fit" options={FIT_OPTIONS} value={s.fit} onChange={a.setFit} />

      {s.fit === 'stretch' && (
        <Alert tone="warn" title="সতর্কতা: ছবি বিকৃত হতে পারে" live>
          ছবির অনুপাত আর আউটপুটের অনুপাত আলাদা হলে ছবি টেনে চ্যাপ্টা বা লম্বা হয়ে যাবে। ছবি বা স্বাক্ষর ঠিক রাখতে “ক্রপ” বা “ফিট” বেছে নিন।
        </Alert>
      )}
    </div>
  );
}
