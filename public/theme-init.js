(function () {
  try {
    // ডিফল্ট সবসময় দিনের (লাইট) মোড; ব্যবহারকারী নিজে ডার্ক বেছে নিলে সেটি মনে রাখা হয়
    var saved = localStorage.getItem('bdir.theme');
    document.documentElement.classList.toggle('dark', saved === 'dark');
  } catch (e) {}
})();
