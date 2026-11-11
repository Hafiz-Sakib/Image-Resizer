import { Download } from 'lucide-react';
import { buildFilename, downloadUrl } from '../utils/imageExport.js';
import { cx } from './ui.jsx';

export default function DownloadButton({ processor, settings, className, compact }) {
  const { result, url, busy } = processor;
  const disabled = !result || !url || busy;
  const filename = result ? buildFilename({ mode: settings.mode, width: result.width, height: result.height, format: settings.format }) : '';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => downloadUrl(url, filename)}
      data-testid="download-btn"
      className={cx('btn-primary', compact ? 'px-5' : 'w-full py-3.5 text-lg', className)}
    >
      <Download size={compact ? 18 : 22} aria-hidden="true" />
      ছবি ডাউনলোড করুন
    </button>
  );
}
