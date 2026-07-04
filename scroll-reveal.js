/**
 * Bidirectional scroll-reveal for README content.
 * Elements animate in when entering the viewport and out when leaving.
 */
export function initScrollReveal(root = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const content = root.getElementById?.('content') ?? root.querySelector?.('.readme-body') ?? root;
  if (!content) return;

  const targets = [];

  content.querySelectorAll('div[align="center"]').forEach((hero) => {
    [...hero.children].forEach((child, i) => {
      child.classList.add('sr-el', 'sr-hero-item');
      child.style.setProperty('--sr-delay', `${i * 90}ms`);
      targets.push(child);
    });
  });

  content.querySelectorAll('h2, h3, img, blockquote, table, pre, hr').forEach((el, i) => {
    if (el.closest('div[align="center"]')) return;

    el.classList.add('sr-el');
    const tag = el.tagName;
    if (tag === 'H2') el.classList.add('sr-h2');
    else if (tag === 'H3') el.classList.add('sr-h3');
    else if (tag === 'IMG') el.classList.add('sr-img');
    else if (tag === 'BLOCKQUOTE') el.classList.add('sr-quote');
    else if (tag === 'TABLE') el.classList.add('sr-table');
    else if (tag === 'HR') el.classList.add('sr-divider');
    else el.classList.add('sr-block');

    el.style.setProperty('--sr-delay', `${(i % 5) * 70}ms`);
    targets.push(el);
  });

  const footer = root.querySelector?.('.site-footer');
  if (footer) {
    footer.classList.add('sr-el', 'sr-footer');
    targets.push(footer);
  }

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('sr-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
  );

  targets.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
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
      header.classList.toggle('is-scrolled', y > 12);
      header.classList.toggle('is-scrolled-deep', y > 120);
      document.documentElement.style.setProperty('--scroll-y', String(y));
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
