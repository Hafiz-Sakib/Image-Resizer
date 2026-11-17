// শুধু দুটি প্রিসেট: ছবি ৩০০×৩০০ ও স্বাক্ষর ৩০০×৮০। বাকি সব মাপ ব্যবহারকারী নিজে কাস্টম করে নেবেন।
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
];

export const KIND_LABEL = { photo: 'ছবি', signature: 'স্বাক্ষর' };
export const SIZE_OPTIONS = [20, 30, 50, 100, 200];
