import { Alert, Spinner } from './ui.jsx';
import { formatBytes, formatNumber } from '../utils/format.js';

const FORMAT_NAME = { jpeg: 'JPEG', png: 'PNG' };

/** প্রসেসিংয়ের ফলাফল ও সীমা পূরণ হয়েছে কি না — প্রকৃত Blob সাইজের ভিত্তিতে */
export default function ResultStatus({ processor, settings: s, maxKB, hasErrors, onSwitchFormat }) {
  const { status, result, error, busy } = processor;

  if (hasErrors) {
    return (
      <Alert tone="warn" title="সেটিংসে ভুল আছে" live>
        বাম পাশের লাল চিহ্নিত ঘরগুলো ঠিক করুন, তাহলেই প্রস্তুত ছবি দেখা যাবে।
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
  const stale = busy ? <p className="text-xs opacity-80">সেটিংস বদলানো হয়েছে — নতুন ফলাফল তৈরি হচ্ছে…</p> : null;

  if (result.reason === 'format_unsupported') {
    return (
      <Alert
        tone="err"
        title="আপনার ব্রাউজার এই ফরম্যাটের ফাইল তৈরি করতে পারছে না"
        action={
          <button type="button" onClick={() => onSwitchFormat('jpeg')} className="btn-ghost mt-2 min-h-[2.5rem] px-3 text-sm text-ink">
            JPEG-তে পরিবর্তন করুন
          </button>
        }
      >
        আপনার ব্রাউজার এই ফরম্যাট এনকোড করতে পারছে না। অনুগ্রহ করে JPEG ফরম্যাট বেছে নিন।
      </Alert>
    );
  }

  if (!result.met && result.reason === 'png_over') {
    return (
      <Alert
        tone="warn"
        title="নির্ধারিত ফাইল সাইজ অর্জন করা সম্ভব হয়নি।"
        live
        action={
          <button type="button" onClick={() => onSwitchFormat('jpeg')} className="btn-ghost mt-2 min-h-[2.5rem] px-3 text-sm text-ink">
            JPEG-তে পরিবর্তন করুন
          </button>
        }
      >
        <p>
          তৈরি হওয়া PNG ফাইলের প্রকৃত সাইজ <strong>{actual}</strong> ({formatNumber(result.size)} বাইট), কিন্তু সীমা <strong>{limit}</strong>।
          PNG ক্ষতিহীন ফরম্যাট, তাই JPEG-এর মতো কোয়ালিটি কমিয়ে সাইজ ঠিক করা যায় না।
        </p>
        <ul>
          <li>আউটপুট ফরম্যাট JPEG করুন।</li>
          <li>অথবা ছবির প্রস্থ ও উচ্চতা (Pixel) কমান।</li>
        </ul>
        {stale}
      </Alert>
    );
  }

  if (!result.met) {
    return (
      <Alert tone="warn" title="নির্ধারিত ফাইল সাইজ অর্জন করা সম্ভব হয়নি। ছবির ডাইমেনশন কমিয়ে আবার চেষ্টা করুন।" live>
        <p>
          সবচেয়ে কম কোয়ালিটিতেও ফাইলের প্রকৃত সাইজ <strong>{actual}</strong> ({formatNumber(result.size)} বাইট) হয়েছে, যা সীমা{' '}
          <strong>{limit}</strong>-এর বেশি। তাই এই ফাইল আবেদনে গৃহীত নাও হতে পারে।
        </p>
        <ul>
          <li>প্রস্থ ও উচ্চতা (Pixel) কমিয়ে দেখুন।</li>
          {s.format !== 'jpeg' && <li>ফরম্যাট JPEG করে দেখুন।</li>}
          {s.mode === 'signature' && <li>“স্বাক্ষর পরিষ্কার করুন” চালু করলে ফাইল ছোট হতে পারে।</li>}
        </ul>
        {stale}
      </Alert>
    );
  }

  if (result.belowMin) {
    return (
      <Alert tone="warn" title="সর্বনিম্ন ফাইল সাইজ পূরণ হয়নি" live>
        <p>
          ফাইলের প্রকৃত সাইজ <strong>{actual}</strong>, কিন্তু আপনি সর্বনিম্ন <strong>{s.minKB} KB</strong> চেয়েছেন। ছবিতে বিস্তারিত কম থাকলে (যেমন সাদা ব্যাকগ্রাউন্ডের স্বাক্ষর) ফাইল ছোট হয়।
        </p>
        <ul>
          <li>ছবির মাপ (Pixel) আবেদনের নিয়ম অনুযায়ী ঠিক আছে কি না দেখুন।</li>
          <li>স্বাক্ষর হলে “স্বাক্ষর পরিষ্কার করুন” বন্ধ করে দেখুন, অথবা বেশি বিস্তারিত ছবি ব্যবহার করুন।</li>
        </ul>
      </Alert>
    );
  }

  const lowQuality = result.quality != null && maxKB && result.quality < 0.35;
  return (
    <div className="space-y-2.5">
      <Alert tone="ok" title={limit ? 'আপনার ছবিটি নির্ধারিত সাইজের মধ্যে তৈরি হয়েছে।' : 'আপনার ছবি প্রস্তুত হয়েছে।'} live>
        <p>
          প্রকৃত সাইজ: <strong>{actual}</strong>
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
          সীমার ভেতরে আনতে কোয়ালিটি {Math.round(result.quality * 100)}%-এ নামাতে হয়েছে, তাই ছবি কিছুটা ঝাপসা দেখাতে পারে। ছবির মাপ (Pixel) কমালে
          স্পষ্টতা বাড়বে।
        </Alert>
      )}
    </div>
  );
}
