import { Alert, OptionCards } from './ui.jsx';

const FORMATS = [
  { value: 'jpeg', title: 'JPEG (.jpg)', desc: 'সবচেয়ে বহুল ব্যবহৃত। ফাইল ছোট, KB নিয়ন্ত্রণ সহজ। আবেদনের ছবির জন্য সেরা।' },
  { value: 'png', title: 'PNG (.png)', desc: 'ক্ষতিহীন মান, কিন্তু ফাইল বড় হয়।' },
];

export default function FormatSelector({ settings: s, actions: a, info }) {
  return (
    <div className="space-y-3 sm:space-y-5">
      <OptionCards legend="আউটপুট ফরম্যাট" name="format" cols="grid-cols-2" options={FORMATS} value={s.format} onChange={a.setFormat} />

      {info?.hasAlpha && (
        <Alert tone="info" title="স্বচ্ছ অংশ সাদা হবে" live>
          আপনার ছবিতে স্বচ্ছ (transparent) অংশ আছে। প্রস্তুত ছবিতে সেই অংশ সাদা রঙে ভরাট হবে।
        </Alert>
      )}
    </div>
  );
}
