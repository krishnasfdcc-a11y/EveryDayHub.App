/** Theme toggle — matches everydayhub.app (key: everydayhub-theme) */
(function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function updateAria() {
    const isDark = !document.documentElement.hasAttribute('data-theme');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  updateAria();

  btn.addEventListener('click', function () {
    const isDark = !document.documentElement.hasAttribute('data-theme');
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('everydayhub-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('everydayhub-theme', 'dark');
    }
    updateAria();
  });
})();
