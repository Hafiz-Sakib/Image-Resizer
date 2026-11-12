import { Alert } from './ui.jsx';

/** আউটপুট সব সময় JPG — আপলোড PNG/WebP হলেও ডাউনলোড হবে .jpg */
export default function FormatSelector({ info }) {
  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-brand bg-brandsoft px-3 py-3 sm:px-4">
        <div>
          <p className="font-semibold">JPG (.jpg)</p>
          <p className="text-xs text-muted sm:text-sm">আপলোড যে ফরম্যাটেরই হোক, ডাউনলোড সব সময় .jpg হবে।</p>
        </div>
      </div>

      {info?.hasAlpha && (
        <Alert tone="info" title="স্বচ্ছ অংশ সাদা হবে" live>
          আপনার ছবিতে স্বচ্ছ (transparent) অংশ আছে। প্রস্তুত ছবিতে সেই অংশ সাদা রঙে ভরাট হবে।
        </Alert>
      )}
    </div>
  );
}
