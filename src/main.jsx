import React from 'react';
import { createRoot } from 'react-dom/client';

// Hind Siliguri — নিজস্ব হোস্ট করা ফন্ট (বাংলা + ল্যাটিন সাবসেট), ফলে ফন্টের জন্যও কোনো বাইরের রিকোয়েস্ট লাগে না
import '@fontsource/hind-siliguri/bengali-300.css';
import '@fontsource/hind-siliguri/bengali-400.css';
import '@fontsource/hind-siliguri/bengali-500.css';
import '@fontsource/hind-siliguri/bengali-600.css';
import '@fontsource/hind-siliguri/bengali-700.css';
import '@fontsource/hind-siliguri/latin-300.css';
import '@fontsource/hind-siliguri/latin-400.css';
import '@fontsource/hind-siliguri/latin-500.css';
import '@fontsource/hind-siliguri/latin-600.css';
import '@fontsource/hind-siliguri/latin-700.css';

import './styles/index.css';
import { registerSW } from 'virtual:pwa-register';

// ইনস্টল প্রম্পট React চালু হওয়ার আগেই আসতে পারে, তাই এখানেই ধরে রাখা হয়
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__bdirInstallPrompt = e;
  window.dispatchEvent(new Event('bdir-install-ready'));
});
registerSW({ immediate: true });
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
