/**
 * Bidirectional scroll-reveal for README content.
 * Elements animate in when entering the viewport and out when leaving.
 */
export function initScrollReveal(root = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const content = root.getElementById?.('content') ?? root.querySelector?.('.readme-body') ?? root;
  if (!content) return;

  const targets = [];
  let order = 0;

  const mark = (el, ...classes) => {
    el.classList.add('sr-el', ...classes);
    el.style.setProperty('--sr-delay', `${(order++ % 8) * 95}ms`);
    el.style.setProperty('--sr-i', String(order));
    targets.push(el);
  };

  content.querySelectorAll('div[align="center"]').forEach((hero) => {
    [...hero.children].forEach((child, i) => {
      child.classList.add('sr-el', 'sr-hero-item');
      child.style.setProperty('--sr-delay', `${i * 120}ms`);
      targets.push(child);
    });
  });

  content.querySelectorAll('h2').forEach((el) => mark(el, 'sr-h2', 'sr-tilt'));

  content.querySelectorAll('h3').forEach((el) => {
    if (el.closest('div[align="center"]')) return;
    mark(el, 'sr-h3', 'sr-slide-left');
  });

  content.querySelectorAll('p, ul, ol, blockquote, table, pre, hr, img').forEach((el) => {
    if (el.closest('div[align="center"]')) return;
    if (el.matches('p') && el.querySelector('img')) return;

    const tag = el.tagName;
    if (tag === 'IMG') mark(el, 'sr-img', 'sr-zoom');
    else if (tag === 'BLOCKQUOTE') mark(el, 'sr-quote');
    else if (tag === 'TABLE') mark(el, 'sr-table');
    else if (tag === 'HR') mark(el, 'sr-divider');
    else if (tag === 'UL' || tag === 'OL') mark(el, 'sr-list');
    else if (tag === 'P') mark(el, 'sr-text');
    else mark(el, 'sr-block');
  });

  const footer = root.querySelector?.('.site-footer');
  if (footer) {
    footer.classList.add('sr-el', 'sr-footer');
    targets.push(footer);
  }

  if (!targets.length) return;

  let lastY = window.scrollY;
  let scrollDir = 'down';
  root.documentElement?.style.setProperty('--scroll-dir', '1');

  const onScrollDir = () => {
    const y = window.scrollY;
    scrollDir = y > lastY ? 'down' : 'up';
    lastY = y;
    document.documentElement.style.setProperty('--scroll-dir', scrollDir === 'down' ? '1' : '-1');
  };

  window.addEventListener('scroll', onScrollDir, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('sr-visible', entry.isIntersecting);
        entry.target.classList.toggle('sr-exiting', !entry.isIntersecting);
        entry.target.dataset.srDir = scrollDir;
      });
    },
    { threshold: [0, 0.12, 0.22], rootMargin: '0px 0px -4% 0px' },
  );

  targets.forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', onScrollDir);
  };
}

export function initHeaderScroll(root = document) {
  const header = root.querySelector('.site-header');
  if (!header) return;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      header.classList.toggle('is-scrolled-deep', y > 100);
      document.documentElement.style.setProperty('--scroll-y', String(y));
      document.documentElement.style.setProperty('--scroll-progress', String(Math.min(y / 1200, 1)));
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
