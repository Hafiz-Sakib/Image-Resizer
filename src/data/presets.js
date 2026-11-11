// সাধারণ উদাহরণ প্রিসেট। এগুলো সব আবেদনের জন্য সার্বজনীন নয় —
// আবেদনের বিজ্ঞপ্তিতে দেওয়া সঠিক মাপ ও KB নিজে লিখে নিন, অথবা প্রিসেট এডিট করুন।
export const DEFAULT_PRESETS = [
  {
    id: 'profile',
    name: 'প্রোফাইল ছবি',
    kind: 'photo',
    width: 300,
    height: 300,
    maxKB: 100,
    minKB: 4,
    format: 'jpeg',
    fit: 'crop',
    builtIn: true,
  },
  {
    id: 'signature',
    name: 'স্বাক্ষর',
    kind: 'signature',
    width: 300,
    height: 80,
    maxKB: 60,
    minKB: 3,
    format: 'jpeg',
    fit: 'fit',
    builtIn: true,
  },
  {
    id: 'square',
    name: 'বর্গাকার ছবি',
    kind: 'photo',
    width: 600,
    height: 600,
    maxKB: 200,
    format: 'jpeg',
    fit: 'crop',
    builtIn: true,
  },
  {
    id: 'wide',
    name: 'চওড়া ছবি',
    kind: 'photo',
    width: 600,
    height: 200,
    maxKB: 100,
    format: 'jpeg',
    fit: 'crop',
    builtIn: true,
  },
];

export const KIND_LABEL = { photo: 'ছবি', signature: 'স্বাক্ষর' };
export const SIZE_OPTIONS = [20, 30, 50, 100, 200];
