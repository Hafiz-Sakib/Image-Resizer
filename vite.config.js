import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const icon = (src, sizes, purpose = 'any') => ({ src, sizes, type: 'image/png', purpose });

// সম্পূর্ণ স্ট্যাটিক বিল্ড — কোনো ব্যাকএন্ড বা এনভায়রনমেন্ট ভেরিয়েবল লাগে না
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // নতুন ডেপ্লয় হলে নিজে আপডেট হয়
      includeAssets: ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'icons/apple-touch-icon.png', 'og-image.png'],
      manifest: {
        id: '/',
        name: 'সরকারি চাকরি',
        short_name: 'সরকারি চাকরি',
        description: 'সরকারি চাকরির গুরুত্বপূর্ণ লিংক এক জায়গায়, সাথে আবেদনের ছবি ও স্বাক্ষর Pixel ও KB অনুযায়ী রিসাইজ ও কমপ্রেস — সবকিছু আপনার ব্রাউজারেই।',
        lang: 'bn',
        dir: 'ltr',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#f5f8f4',
        theme_color: '#00694d',
        categories: ['utilities', 'productivity', 'photo'],
        icons: [icon('/icons/icon-192.png', '192x192'), icon('/icons/icon-512.png', '512x512'), icon('/icons/maskable-512.png', '512x512', 'maskable')],
        shortcuts: [
          { name: 'গুরুত্বপূর্ণ লিংক', short_name: 'লিংক', url: '/ImportantLinks', icons: [icon('/icons/icon-192.png', '192x192')] },
          { name: 'ছবি রিসাইজ করুন', short_name: 'ছবি', url: '/?tool=photo', icons: [icon('/icons/icon-192.png', '192x192')] },
          { name: 'স্বাক্ষর রিসাইজ করুন', short_name: 'স্বাক্ষর', url: '/?tool=signature', icons: [icon('/icons/icon-192.png', '192x192')] },
        ],
      },
      workbox: {
        // অ্যাপ শেল, ওয়ার্কার ও ফন্ট প্রি-ক্যাশ হয় — প্রথমবার খোলার পর ইন্টারনেট ছাড়াও চলে
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest}'],
        globIgnores: ['**/*.woff', '**/og-image.png'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  worker: { format: 'es' },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
