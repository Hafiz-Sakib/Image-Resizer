// Developer page content (English only). Edit this file to change the text.
const common = [
  { img: 'nikah', u: 'https://nikah-convention.vercel.app/', gh: 'https://github.com/Hafiz-Sakib/Nikah-Community-Center', tags: ['React', 'Node.js', 'Express', 'Supabase'], c: '234 122 47' },
  { img: 'cp-pathshala', u: 'https://cp-pathshala.vercel.app/', gh: 'https://github.com/Hafiz-Sakib/CP-Pathshala', tags: ['React', 'Vite', 'PWA', 'Python'], c: '124 108 246' },
  { img: 'subcalc', u: 'https://subcalc-pro.vercel.app/', gh: 'https://github.com/Hafiz-Sakib/SubCalc-Pro', tags: ['React', 'Tailwind', 'IPv4', 'VLSM'], c: '234 122 47' },
  { img: 'algoviz', u: 'https://algorithm-hunter.vercel.app/', gh: 'https://github.com/Hafiz-Sakib/algorithm-visualizer', tags: ['React', 'TypeScript', 'Three.js', 'Tailwind'], c: '16 165 107' },
  { img: 'nova', u: 'https://nova-mathplot.vercel.app/', gh: 'https://github.com/Hafiz-Sakib/nova-mathplot', tags: ['React', 'Three.js', 'R3F', 'Math.js'], c: '47 127 224' },
];

const projects = [
  { t: 'Nikah Community Center', k: 'Booking platform', d: 'A full-stack booking system for a wedding venue in Chattogram, with live availability and advance payments.', pts: ['Live date availability and advance payments', 'PDF invoices and an admin dashboard'] },
  { t: 'CP Pathshala', k: 'Educational PWA', d: 'A full C++ competitive programming course in plain Bangla. It works offline once installed.', pts: ['144 lessons and 200 runnable C++ examples in 5 tracks', 'STL, bit manipulation, number theory, DP and graphs'] },
  { t: 'SubCalc Pro', k: 'Networking tool', d: 'A subnetting helper for students and network engineers. It explains each step, not just the answer.', pts: ['FLSM and VLSM splits with a step-by-step breakdown', 'Overlap detection and a visual subnet tree'] },
  { t: 'AlgoViz', k: 'Algorithm visualizer', d: 'Watch algorithms think. Playback can step, pause and rewind while the matching C++ code lights up line by line.', pts: ['60+ algorithms in 11 categories', 'Live C++ STL code panel'] },
  { t: 'NOVA MathPlot', k: '2D / 3D math plots', d: 'A browser-only math playground for students and teachers. Plot a function, spin a surface or watch a curve draw itself.', pts: ['60+ ready 3D surfaces and 40+ animated curves', '17 neural activation functions with derivative overlay'] },
];

export const DEV = {
  code: 'en',
  name: 'Mohammad Hafizur Rahman Sakib',
  place: 'Chattogram, Bangladesh',
  role: 'Full-stack developer',
  pill: 'Developer',
  before: "I'm a",
  words: ['full-stack developer.', 'competitive programmer.', 'NLP researcher.'],
  bio: "Hi! I'm a CSE graduate from Premier University, interested in software development, competitive programming, and emerging technologies. I enjoy building performant, scalable applications with a focus on full-stack development and system design, while also exploring Linux, DevOps, and machine learning.",
  marks: ['software development', 'competitive programming', 'full-stack development', 'machine learning'],
  portfolio: 'Visit portfolio',
  graduated: 'Graduated',
  edu: { pill: 'Education', h: 'Where I studied.' },
  eduItems: [
    { t: 'B.Sc in Computer Science & Engineering', o: 'Premier University, Chittagong', p: '2022 – 2026', d: 'Software engineering, algorithms and full-stack development. Undergraduate thesis on applied AI/ML.', done: true },
    { t: 'Higher Secondary Certificate', o: 'Govt. Hazi Mohammad Mohsin College', p: '2017 – 2019', d: 'Science group, GPA 5.00.' },
    { t: 'Secondary School Certificate', o: 'Govt. Muslim High School', p: '2015 – 2017', d: 'Science group, GPA 5.00.' },
  ],
  pro: { pill: 'Projects', h: "Things I've built.", sub: 'Tap the arrows or the dots to turn the page. Each project links to its live site and its source code.', prev: 'Previous project', next: 'Next project', pick: 'Choose a project', shot: 'screenshot', live: 'Live site', src: 'Source code' },
  touch: { pill: 'Contact', h: "Let's build something together.", p: 'A new idea, freelance work or an open-source project, anything is worth a chat.', links: 'Links' },
  labels: { portfolio: 'Portfolio', email: 'Email', linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram' },
  num: (n) => String(n).padStart(2, '0'),
  projects: projects.map((p, i) => ({ ...common[i], ...p })),
};