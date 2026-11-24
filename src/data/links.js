// সরকারি চাকরির গুরুত্বপূর্ণ লিংক — নতুন লিংক যোগ করতে শুধু এই তালিকায় একটি অবজেক্ট বসান
// icon: lucide আইকনের নাম (ImportantLinks পেজে ও নেভবারে ম্যাপ করা আছে)
export const LINK_CATEGORIES = [
  { id: 'all', label: 'সব' },
  { id: 'circular', label: 'সার্কুলার' },
  { id: 'apply', label: 'আবেদন' },
  { id: 'tool', label: 'টুল' },
];

export const IMPORTANT_LINKS = [
  {
    id: 'bdgovtjob',
    category: 'circular',
    icon: 'newspaper',
    title: 'BD Govt Job',
    badge: 'সার্কুলার পোর্টাল',
    url: 'https://bdgovtjob.net/',
    tagline: 'প্রতিদিনের সরকারি ও বেসরকারি নিয়োগ সার্কুলার এক জায়গায়',
    features: [
      'সরকারি, ব্যাংক, ডিফেন্স, বিশ্ববিদ্যালয়, এনজিও ও প্রাইভেট চাকরির সার্কুলার',
      'শেষ তারিখ, পদসংখ্যা ও যোগ্যতা অনুযায়ী ফিল্টার',
      'বয়স ক্যালকুলেটর ও সেভ করা চাকরির ট্র্যাকার',
    ],
    shortcuts: [
      { label: 'সরকারি চাকরি', url: 'https://bdgovtjob.net/category/government-jobs-circular/' },
      { label: 'আজ শেষ দিন', url: 'https://bdgovtjob.net/?deadline=today' },
      { label: 'অনলাইন আবেদন', url: 'https://bdgovtjob.net/category/teletalk-application/' },
      { label: 'বয়স ক্যালকুলেটর', url: 'https://bdgovtjob.net/age-calculator/' },
    ],
    note: 'এটা একটা থার্ড-পার্টি সাইট; আবেদনের আগে অফিসিয়াল সার্কুলার মিলিয়ে নিন।',
  },
  {
    id: 'jobcircular-app',
    category: 'circular',
    icon: 'smartphone',
    title: 'Job Circular',
    badge: 'অ্যান্ড্রয়েড অ্যাপ',
    url: 'https://play.google.com/store/apps/details?id=com.careerguidebd.jobcircular',
    tagline: 'চাকরির সার্কুলার, পরীক্ষার নোটিশ ও প্রস্তুতি — এক অ্যাপে',
    features: [
      'সার্কুলার, পরীক্ষার সময়সূচি, ফলাফল ও নোটিশ এক জায়গায়',
      'নতুন সার্কুলারের নোটিফিকেশন ও আবেদনের শেষ তারিখের রিমাইন্ডার',
      'প্রিলি, লিখিত ও ভাইভার প্রস্তুতি — কুইজ, মডেল টেস্ট ও আগের সমাধান',
    ],
    shortcuts: [
      { label: 'Play Store-এ দেখুন', url: 'https://play.google.com/store/apps/details?id=com.careerguidebd.jobcircular' },
      { label: 'ডেভেলপারের সাইট', url: 'http://www.careerguidebd.com' },
    ],
    note: 'সরকারি অ্যাপ নয় (থার্ড-পার্টি, বিজ্ঞাপন আছে); আবেদনের আগে অফিসিয়াল সার্কুলার মিলিয়ে নিন।',
  },
  {
    id: 'teletalk',
    category: 'apply',
    icon: 'send',
    title: 'টেলিটক অলজবস (Alljobs)',
    badge: 'আবেদন পোর্টাল',
    url: 'https://alljobs.teletalk.com.bd/',
    tagline: 'টেলিটকের জব পোর্টাল — সরকারি ও বেসরকারি চাকরির সুযোগ',
    features: [
      'টেলিটক পরিচালিত জব পোর্টাল (Alljobs by Teletalk)',
      'চলমান নিয়োগের তালিকা দেখা ও আবেদনের লিংক পাওয়া',
      'অনেক সরকারি নিয়োগের আবেদন teletalk.com.bd সাবডোমেইনে হয়',
    ],
    shortcuts: [{ label: 'পোর্টাল ওপেন করুন', url: 'https://alljobs.teletalk.com.bd/' }],
    note: 'আবেদনের ফর্ম ও ফি-এর নিয়ম সার্কুলারে দেওয়া থাকে — সেটা দেখে নিন।',
  },
  {
    id: 'applymama',
    category: 'tool',
    icon: 'puzzle',
    title: 'ApplyMama — Teletalk Autofill',
    badge: 'ক্রোম এক্সটেনশন',
    url: 'https://chromewebstore.google.com/detail/applymama-%E2%80%94-teletalk-auto/mbohmdgofljbgicjfhoahcdnlpjmdejo',
    tagline: 'একবার প্রোফাইল সেভ করুন, টেলিটকের আবেদন ফর্ম এক ক্লিকে পূরণ করুন',
    features: [
      'নাম, পিতা-মাতা, জন্মতারিখ, ঠিকানা, SSC/HSC/ডিগ্রির তথ্য অটোফিল',
      'প্রিভিউ পেজে সেভ করা ছবি ও স্বাক্ষর আপলোডে সাহায্য',
      'ডেটা ডিভাইসেই থাকে; JSON-এ ব্যাকআপ ও ইমপোর্ট করা যায়',
    ],
    shortcuts: [{ label: 'Chrome Web Store-এ দেখুন', url: 'https://chromewebstore.google.com/detail/applymama-%E2%80%94-teletalk-auto/mbohmdgofljbgicjfhoahcdnlpjmdejo' }],
    note: 'থার্ড-পার্টি এক্সটেনশন (ডেস্কটপ Chrome-এর জন্য)। ফর্ম সাবমিট করার আগে সব তথ্য নিজে চেক করে নিন।',
  },
];
