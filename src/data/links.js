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
    tagline: 'প্রতিদিনের সরকারি ও বেসরকারি নিয়োগ বিজ্ঞপ্তি এক জায়গায়',
    features: [
      'সরকারি, ব্যাংক, ডিফেন্স, বিশ্ববিদ্যালয়, এনজিও ও প্রাইভেট চাকরির সার্কুলার',
      'শেষ তারিখ, পদসংখ্যা ও যোগ্যতা অনুযায়ী ফিল্টার',
      'বয়স ক্যালকুলেটর ও সেভ করা চাকরির ট্র্যাকার',
    ],
    shortcuts: [
      { label: 'সরকারি চাকরি', url: 'https://bdgovtjob.net/category/government-jobs-circular/' },
      { label: 'আজ শেষ দিন', url: 'https://bdgovtjob.net/?deadline=today' },
      { label: 'অনলাইন আবেদন', url: 'https://bdgovtjob.net/category/teletalk-application/' },
      { label: 'ব্যাংক চাকরি', url: 'https://bdgovtjob.net/category/bank-jobs/' },
      { label: 'ডিফেন্স চাকরি', url: 'https://bdgovtjob.net/category/defence-job-circular/' },
      { label: 'বয়স ক্যালকুলেটর', url: 'https://bdgovtjob.net/age-calculator/' },
      { label: 'চাকরি খুঁজুন', url: 'https://bdgovtjob.net/smart-search/' },
    ],
    note: 'এটি একটি তৃতীয়-পক্ষের সাইট; আবেদনের আগে অফিসিয়াল বিজ্ঞপ্তি মিলিয়ে নিন।',
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
      'চলমান নিয়োগের তালিকা দেখা ও আবেদনের পথ খুঁজে পাওয়া',
      'অনেক সরকারি নিয়োগের আবেদন teletalk.com.bd সাবডোমেইনে হয়',
    ],
    shortcuts: [{ label: 'পোর্টাল খুলুন', url: 'https://alljobs.teletalk.com.bd/' }],
    note: 'আবেদনের ফর্ম ও ফি-এর নিয়ম নিয়োগ বিজ্ঞপ্তিতে দেওয়া থাকে — সেটি অনুসরণ করুন।',
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
      'প্রিভিউ পেজে সেভ করা ছবি ও স্বাক্ষর আপলোডে সহায়তা',
      'ডেটা ডিভাইসেই থাকে; JSON-এ ব্যাকআপ ও ইমপোর্ট করা যায়',
    ],
    shortcuts: [{ label: 'Chrome Web Store-এ দেখুন', url: 'https://chromewebstore.google.com/detail/applymama-%E2%80%94-teletalk-auto/mbohmdgofljbgicjfhoahcdnlpjmdejo' }],
    note: 'তৃতীয়-পক্ষের এক্সটেনশন (ডেস্কটপ Chrome-এর জন্য)। ফর্ম জমা দেওয়ার আগে সব তথ্য নিজে যাচাই করুন।',
  },
];
