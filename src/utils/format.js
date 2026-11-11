const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

/** বাংলা সংখ্যা (০-৯) কে ইংরেজি সংখ্যায় রূপান্তর */
export function toAsciiDigits(str) {
  return String(str).replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

/** ইনপুট বক্সের লেখা থেকে পূর্ণসংখ্যা। বাংলা সংখ্যাও চলবে। খালি হলে '' */
export function parseIntInput(str) {
  const s = toAsciiDigits(str).replace(/[^\d]/g, '');
  if (s === '') return '';
  return Math.min(Number(s), 999999);
}

export function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** বাইট → মানুষের পড়ার উপযোগী (১ KB = ১০২৪ বাইট) */
export function formatBytes(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export function formatNumber(n) {
  return Number(n).toLocaleString('en-US');
}

export function bnYear() {
  try {
    return new Date().getFullYear().toLocaleString('bn-BD', { useGrouping: false });
  } catch {
    return String(new Date().getFullYear());
  }
}
