<div align="center">

# 🇧🇩 সরকারি চাকরি

**সরকারি চাকরির গুরুত্বপূর্ণ লিংক + আবেদনের ছবি ও স্বাক্ষর রিসাইজ টুল — এক জায়গায়**

বাংলা-প্রথম · PWA (ইনস্টল ও অফলাইন) · ১০০% ফ্রন্টএন্ড · কোনো ছবি সার্ভারে যায় না

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-ready-00694d)

</div>

---

## ✨ কী আছে

| পেজ | পথ | বিবরণ |
| --- | --- | --- |
| 🏠 হোম | `/` | ছবি ও স্বাক্ষর রিসাইজ + KB কমপ্রেস টুল, প্রিসেট |
| 🔗 গুরুত্বপূর্ণ লিংক | `/ImportantLinks` | সরকারি চাকরির দরকারি সাইট ও টুলের শর্টকাট, সার্চ ও ক্যাটাগরি ফিল্টারসহ |
| 👨‍💻 ডেভেলপার | `/developer` | ডেভেলপার পরিচিতি |

> পথগুলো বড়-ছোট হাতের অক্ষরে পার্থক্য করে না — `/importantlinks` ও `/ImportantLinks` একই পেজ খোলে।

## 🔗 গুরুত্বপূর্ণ লিংক

নেভবারের **“গুরুত্বপূর্ণ লিংক”** মেনুতে (ডেস্কটপে হোভার/ক্লিক, মোবাইলে মেনুর ভেতরেই) সরাসরি সাইটগুলো খোলা যায়। আলাদা `/ImportantLinks` পেজে প্রতিটির বিবরণ, “এখানে কী পাবেন”, দ্রুত শর্টকাট ও **লিংক কপি** বোতাম আছে।

| লিংক | ধরন | কী পাবেন |
| --- | --- | --- |
| [BD Govt Job](https://bdgovtjob.net/) | সার্কুলার পোর্টাল | প্রতিদিনের নিয়োগ বিজ্ঞপ্তি, শেষ তারিখ ফিল্টার, বয়স ক্যালকুলেটর |
| [টেলিটক অলজবস](https://alljobs.teletalk.com.bd/) | আবেদন পোর্টাল | টেলিটকের জব পোর্টাল ও চলমান নিয়োগ |
| [ApplyMama — Teletalk Autofill](https://chromewebstore.google.com/detail/applymama-%E2%80%94-teletalk-auto/mbohmdgofljbgicjfhoahcdnlpjmdejo) | ক্রোম এক্সটেনশন | টেলিটকের আবেদন ফর্ম এক ক্লিকে অটোফিল |

> ⚠️ BD Govt Job ও ApplyMama তৃতীয়-পক্ষের সেবা। আবেদনের আগে সবসময় অফিসিয়াল বিজ্ঞপ্তি মিলিয়ে নিন এবং ফর্ম জমা দেওয়ার আগে নিজে সব তথ্য যাচাই করুন।

### নতুন লিংক যোগ করা

শুধু `src/data/links.js`-এর `IMPORTANT_LINKS` তালিকায় একটি অবজেক্ট যোগ করুন — নেভবার ড্রপডাউন ও পেজ দুটোই নিজে থেকে আপডেট হবে।

```js
{
  id: 'example',
  category: 'circular',          // circular | apply | tool
  icon: 'newspaper',             // newspaper | send | puzzle
  title: 'সাইটের নাম',
  badge: 'সার্কুলার পোর্টাল',
  url: 'https://example.com/',
  tagline: 'এক লাইনের পরিচিতি',
  features: ['কী পাবেন ১', 'কী পাবেন ২'],
  shortcuts: [{ label: 'শর্টকাট', url: 'https://example.com/jobs' }],
  note: 'সতর্কবার্তা বা টিপস',
}
```

নতুন আইকন লাগলে `Header.jsx` ও `ImportantLinks.jsx`-এর `ICONS` ম্যাপে lucide আইকন যোগ করুন।

## 🖼️ ছবি ও স্বাক্ষর টুল

- JPG/PNG/WebP আপলোড (ড্র্যাগ-ড্রপ, ক্লিক, পেস্ট), আসল ফাইল-টাইপ যাচাই
- প্রস্থ/উচ্চতা (বাংলা সংখ্যাও চলে), অনুপাত লক, 1:1 / 3:1 / 4:3 / 3:4 / 16:9 / মূল / কাস্টম
- ছবির জন্য ইন্টারঅ্যাকটিভ ক্রপ (বক্স টানা, জুম, কিবোর্ড); স্বাক্ষরের জন্য পুরো ছবি ফিট
- সর্বোচ্চ ও সর্বনিম্ন (ঐচ্ছিক) KB — পোর্টালের “4–100 KB” ধরনের নিয়ম মানতে
- বাইনারি সার্চে কোয়ালিটি নির্ধারণ; **প্রকৃত Blob সাইজ মেপে** ফল দেখায়
- JPEG/PNG আউটপুট (ফাঁকা/স্বচ্ছ অংশ সাদা রঙে ভরে)
- স্বাক্ষর মোড (পরিষ্কার করার অপশন), প্রিসেট তৈরি/এডিট/মোছা (শুধু `localStorage`-এ)
- ডার্ক/লাইট থিম, মোবাইল স্টিকি ডাউনলোড বার, অ্যাক্সেসিবিলিটি (বাংলা লেবেল, কিবোর্ড)

## 📱 PWA

- হোম স্ক্রিনে ইনস্টল (Android Chrome-এ এক ট্যাপ, iPhone-এ ধাপে ধাপে গাইড)
- প্রথমবারের পর অফলাইনেও চলে (লিংক পেজ খুলতে অবশ্য ইন্টারনেট লাগবে)
- অ্যাপ শর্টকাট: **গুরুত্বপূর্ণ লিংক**, **ছবি**, **স্বাক্ষর**
- অ্যাপের নাম: **সরকারি চাকরি** (`vite.config.js`-এর manifest ও `index.html`)

## 🚀 চালানো

```bash
npm install
npm run dev       # ডেভেলপমেন্ট
npm run build     # প্রোডাকশন বিল্ড → dist/
npm run preview   # বিল্ড প্রিভিউ
```

Node 18+ প্রয়োজন।

## ☁️ Vercel-এ ডেপ্লয়

প্রজেক্ট GitHub-এ পুশ করে Vercel-এ Import করুন (Framework: Vite, Build: `npm run build`, Output: `dist`)। কোনো Environment Variable লাগে না।

`vercel.json`-এ SPA rewrite আছে, তাই `/ImportantLinks` ও `/developer`-এ সরাসরি ঢুকলে বা রিফ্রেশ করলেও পেজ খোলে। কঠোর CSP (`connect-src 'self'`) থাকায় ব্রাউজার বাইরে ডেটা পাঠাতে দেয় না; লিংকগুলো সাধারণ `<a>` ট্যাগ, তাই CSP-তে সমস্যা হয় না।

## 🗂️ কাঠামো

```text
src/
├── components/   Header (নেভবার + লিংক ড্রপডাউন), Footer, Logo, টুলের UI অংশ
├── pages/        Home, ImportantLinks, Developer
├── data/         links.js (গুরুত্বপূর্ণ লিংক), presets.js, messages.js
├── hooks/        useTheme, useInstall, usePresets, ইমেজ প্রসেসিং হুক
├── utils/        router.js (ছোট রাউটার), imageCore/Compression/Crop…
└── workers/      image.worker.js (Web Worker)
```

## 📝 নোট

- ফন্ট Hind Siliguri `@fontsource` দিয়ে নিজস্বভাবে হোস্ট করা (বাইরের Google Fonts রিকোয়েস্ট নেই)।
- KB লক্ষ্য 1 KB = 1000 বাইট ধরে, তাই 1000 বা 1024 — দুই হিসাবেই সীমার ভেতরে থাকে।
- প্রিসেটের মাপ শুধু উদাহরণ; আবেদনের বিজ্ঞপ্তির মাপ ব্যবহার করুন।
- থিম ডিফল্ট লাইট; ডার্ক বাছলে সেটি মনে রাখা হয়।

## 🎨 আইকন বদলাতে

`public/favicon.svg`, `public/icons/*.png`, `public/favicon-*.png`, `public/favicon.ico`, `public/og-image.png` প্রতিস্থাপন করুন। OG ইমেজের পূর্ণ URL দরকার হলে `index.html`-এর `og:image`-এ নিজের ডোমেইনসহ লিখুন।

## 👨‍💻 ডেভেলপার

**মোহাম্মদ হাফিজুর রহমান সাকিব** — [পোর্টফোলিও](https://hafizsakib.vercel.app/) · [গিটহাব](https://github.com/Hafiz-Sakib)
