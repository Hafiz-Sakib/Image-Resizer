import { Alert, Spinner } from './ui.jsx';
import { formatBytes, formatNumber } from '../utils/format.js';

const FORMAT_NAME = { jpeg: 'JPEG', png: 'PNG', webp: 'WebP' };

/** প্রসেসিংয়ের ফলাফল ও সীমা পূরণ হয়েছে কি না — প্রকৃত Blob সাইজের ভিত্তিতে */
export default function ResultStatus({ processor, settings: s, maxKB, hasErrors, onSwitchFormat }) {
  const { status, result, error, busy } = processor;

  if (hasErrors) {
    return (
      <Alert tone="warn" title="সেটিংসে ভুল আছে" live>
        বাম পাশের লাল দাগ দেওয়া ঘরগুলো ঠিক করুন, তাহলেই রেডি ছবি দেখতে পাবেন।
      </Alert>
    );
  }
  if (status === 'error') {
    return (
      <Alert tone="err" title="প্রসেস করা যায়নি">
        {error}
      </Alert>
    );
  }
  if (!result) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-sunken p-3.5 text-sm text-muted" role="status">
        <Spinner /> ছবি প্রসেস হচ্ছে…
      </div>
    );
  }

  const actual = formatBytes(result.size);
  const limit = maxKB ? `${maxKB} KB` : null;
  const stale = busy ? <p className="text-xs opacity-80">সেটিংস বদলেছে — নতুন ছবি তৈরি হচ্ছে…</p> : null;

  if (result.reason === 'format_unsupported') {
    return (
      <Alert
        tone="err"
        title="আপনার ব্রাউজার এই ফরম্যাটে ফাইল বানাতে পারছে না"
        action={
          <button type="button" onClick={() => onSwitchFormat('jpeg')} className="btn-ghost mt-2 min-h-[2.5rem] px-3 text-sm text-ink">
            JPEG করে নিন
          </button>
        }
      >
        আপনার ব্রাউজার এই ফরম্যাট বানাতে পারছে না। JPEG ফরম্যাট সিলেক্ট করুন।
      </Alert>
    );
  }

  if (!result.met && result.reason === 'png_over') {
    return (
      <Alert
        tone="warn"
        title="ফাইল সাইজ সীমার মধ্যে আনা যায়নি।"
        live
        action={
          <button type="button" onClick={() => onSwitchFormat('jpeg')} className="btn-ghost mt-2 min-h-[2.5rem] px-3 text-sm text-ink">
            JPEG করে নিন
          </button>
        }
      >
        <p>
          PNG ফাইলের আসল সাইজ <strong>{actual}</strong> ({formatNumber(result.size)} বাইট), কিন্তু সীমা <strong>{limit}</strong>।
          PNG লসলেস ফরম্যাট, তাই JPEG-এর মতো কোয়ালিটি কমিয়ে সাইজ ছোট করা যায় না।
        </p>
        <ul>
          <li>ফরম্যাট JPEG করে নিন।</li>
          <li>অথবা ছবির প্রস্থ ও উচ্চতা (Pixel) কমিয়ে দিন।</li>
        </ul>
        {stale}
      </Alert>
    );
  }

  if (!result.met) {
    return (
      <Alert tone="warn" title="ফাইল সাইজ সীমার মধ্যে আনা যায়নি। ছবির মাপ কমিয়ে আবার চেষ্টা করুন।" live>
        <p>
          সবচেয়ে কম কোয়ালিটিতেও ফাইলের সাইজ <strong>{actual}</strong> ({formatNumber(result.size)} বাইট) হয়েছে, যা সীমা{' '}
          <strong>{limit}</strong>-এর বেশি। তাই এই ফাইল আবেদনে নাও নিতে পারে।
        </p>
        <ul>
          <li>প্রস্থ ও উচ্চতা (Pixel) কমিয়ে দেখুন।</li>
          {s.format !== 'jpeg' && <li>ফরম্যাট JPEG করে দেখুন।</li>}
          {s.mode === 'signature' && <li>“স্বাক্ষর ক্লিন করুন” অন করলে ফাইল ছোট হতে পারে।</li>}
        </ul>
        {stale}
      </Alert>
    );
  }

  if (result.belowMin) {
    return (
      <Alert tone="warn" title="সর্বনিম্ন ফাইল সাইজ পূরণ হয়নি" live>
        <p>
          ফাইলের সাইজ <strong>{actual}</strong>, কিন্তু আপনি কমপক্ষে <strong>{s.minKB} KB</strong> চেয়েছেন। ছবিতে ডিটেইল কম থাকলে (যেমন সাদা ব্যাকগ্রাউন্ডের স্বাক্ষর) ফাইল ছোট হয়।
        </p>
        <ul>
          <li>ছবির মাপ (Pixel) সার্কুলারের নিয়ম মতো আছে কি না দেখে নিন।</li>
          <li>স্বাক্ষর হলে “স্বাক্ষর ক্লিন করুন” অফ করে দেখুন, অথবা আরেকটু ডিটেইল আছে এমন ছবি দিন।</li>
        </ul>
      </Alert>
    );
  }

  const lowQuality = result.quality != null && maxKB && result.quality < 0.35;
  return (
    <div className="space-y-2.5">
      <Alert tone="ok" title={limit ? 'ছবি রেডি, সাইজও সীমার মধ্যে আছে।' : 'আপনার ছবি রেডি।'} live>
        <p>
          সাইজ: <strong>{actual}</strong>
          {limit && (
            <>
              {' '}
              (সর্বোচ্চ সীমা: {limit})
            </>
          )}
          {' · '}
          {result.width} × {result.height} px · {FORMAT_NAME[s.format]}
        </p>
        {stale}
      </Alert>
      {lowQuality && (
        <Alert tone="warn" title="কোয়ালিটি অনেক কমে গেছে">
          সীমার ভেতরে আনতে কোয়ালিটি {Math.round(result.quality * 100)}%-এ নামাতে হয়েছে, তাই ছবি একটু ঝাপসা দেখাতে পারে। ছবির মাপ (Pixel) কমালে
          ছবি আরও পরিষ্কার আসবে।
        </Alert>
      )}
    </div>
  );
}
