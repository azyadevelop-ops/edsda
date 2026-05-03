// Scroll-reveal animations via IntersectionObserver
// Loaded ~3s after page load — zero LCP impact

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
  );

  // Observe all sections except the first (hero), cards blocks, and column rows
  document.querySelectorAll('main > .section:not(:first-of-type)').forEach((section) => {
    section.classList.add('reveal');
    observer.observe(section);
  });

  document.querySelectorAll('.cards').forEach((cards) => {
    cards.classList.add('reveal', 'reveal-children');
    observer.observe(cards);
  });

  document.querySelectorAll('.columns > div').forEach((row) => {
    row.classList.add('reveal');
    observer.observe(row);
  });
}
