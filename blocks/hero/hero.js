export default function decorate(block) {
  // Staggered entrance animations for hero content
  const animTargets = block.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .button-container');
  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
  });

  // Double-rAF for reliable paint trigger
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animTargets.forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
        });
      } else {
        animTargets.forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      }
    });
  });

  // Subtle scan-line overlay
  const scanline = document.createElement('div');
  scanline.className = 'hero-scanline';
  scanline.setAttribute('aria-hidden', 'true');
  block.appendChild(scanline);
}
