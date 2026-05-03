const COLOR_MAP = {
  white: { hex: '#F5F5F5', achromatic: true },
  black: { hex: '#1C1C1C', achromatic: true },
  silver: { hex: '#C0C0C0', achromatic: true },
  gray: { hex: '#808080', achromatic: true },
  red: { hex: '#CC0000', achromatic: false },
  blue: { hex: '#1A3399', achromatic: false },
  brown: { hex: '#7B4B2A', achromatic: false },
  green: { hex: '#2D6B3F', achromatic: false },
  orange: { hex: '#E86100', achromatic: false },
  yellow: { hex: '#D4A800', achromatic: false },
};

function applyColorShader(block, colorName) {
  const color = COLOR_MAP[colorName];
  if (!color) return;

  const overlay = block.querySelector('.car-hero-color-overlay');
  const img = block.querySelector('.car-hero-image img');

  if (overlay) {
    overlay.style.backgroundColor = color.hex;

    if (color.achromatic) {
      overlay.style.mixBlendMode = 'luminosity';
      overlay.style.opacity = '0.7';
      if (img) img.style.filter = 'saturate(0.15)';
    } else {
      overlay.style.mixBlendMode = 'color';
      overlay.style.opacity = '0.55';
      if (img) img.style.filter = 'saturate(1.1)';
    }
  }

  block.style.setProperty('--car-hero-glow', color.hex);
}

function formatPrice(value) {
  const num = Number(value.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(num)) return value;
  return `$${num.toLocaleString('en-US')}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function decorate(block) {
  const rows = [...block.children];

  // Extract picture
  let picture = null;
  const textElements = [];

  rows.forEach((row) => {
    const pic = row.querySelector('picture');
    if (pic && !picture) {
      picture = pic;
    }
    // Collect all inner content elements
    [...row.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')].forEach((el) => {
      if (!el.querySelector('picture')) textElements.push(el);
    });
  });

  // Categorize text elements
  const headings = textElements.filter((el) => /^H[1-6]$/.test(el.tagName));
  const paragraphs = textElements.filter((el) => el.tagName === 'P');

  let colorsParagraph = null;
  let priceParagraph = null;
  const descParagraphs = [];

  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (!text) return;

    // Check for comma-separated color names
    const colorNames = text.split(',').map((s) => s.trim().toLowerCase());
    const allColors = colorNames.length > 1
      && colorNames.every((name) => name in COLOR_MAP);

    if (allColors && !colorsParagraph) {
      colorsParagraph = p;
    } else if (/^[\d,. ]+$/.test(text) && !priceParagraph) {
      priceParagraph = p;
    } else {
      descParagraphs.push(p);
    }
  });

  const availableColors = colorsParagraph
    ? colorsParagraph.textContent.split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((c) => c in COLOR_MAP)
    : Object.keys(COLOR_MAP);

  const priceValue = priceParagraph ? priceParagraph.textContent.trim() : '';

  // Rebuild DOM
  block.textContent = '';

  // Image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'car-hero-image';
  if (picture) imageContainer.appendChild(picture);

  const colorOverlay = document.createElement('div');
  colorOverlay.className = 'car-hero-color-overlay';
  colorOverlay.setAttribute('aria-hidden', 'true');
  imageContainer.appendChild(colorOverlay);

  const gradientOverlay = document.createElement('div');
  gradientOverlay.className = 'car-hero-gradient';
  gradientOverlay.setAttribute('aria-hidden', 'true');
  imageContainer.appendChild(gradientOverlay);

  block.appendChild(imageContainer);

  // Content
  const content = document.createElement('div');
  content.className = 'car-hero-content';

  // Title
  if (headings.length > 0) {
    const title = headings[0];
    title.classList.add('car-hero-title');
    content.appendChild(title);
  }

  // Description
  if (descParagraphs.length > 0) {
    const descContainer = document.createElement('div');
    descContainer.className = 'car-hero-description';
    descParagraphs.forEach((p) => descContainer.appendChild(p));
    content.appendChild(descContainer);
  }

  // Price
  if (priceValue) {
    const priceEl = document.createElement('div');
    priceEl.className = 'car-hero-price';

    const priceLabel = document.createElement('span');
    priceLabel.className = 'car-hero-price-label';
    priceLabel.textContent = 'Starting at';

    const priceAmount = document.createElement('span');
    priceAmount.className = 'car-hero-price-amount';
    priceAmount.textContent = formatPrice(priceValue);

    priceEl.appendChild(priceLabel);
    priceEl.appendChild(priceAmount);
    content.appendChild(priceEl);
  }

  // Color selector
  if (availableColors.length > 0) {
    const colorSection = document.createElement('div');
    colorSection.className = 'car-hero-colors';

    const colorLabel = document.createElement('span');
    colorLabel.className = 'car-hero-colors-label';
    colorLabel.textContent = 'Select Color';
    colorSection.appendChild(colorLabel);

    const swatchContainer = document.createElement('div');
    swatchContainer.className = 'car-hero-swatches';

    const activeColorName = document.createElement('span');
    activeColorName.className = 'car-hero-active-color';
    activeColorName.textContent = capitalize(availableColors[0]);

    availableColors.forEach((colorName, i) => {
      const color = COLOR_MAP[colorName];
      const swatch = document.createElement('button');
      swatch.className = `car-hero-swatch${i === 0 ? ' active' : ''}`;
      swatch.dataset.color = colorName;
      swatch.style.setProperty('--swatch-color', color.hex);
      swatch.setAttribute('aria-label', `Select ${colorName} color`);
      swatch.title = capitalize(colorName);

      swatch.addEventListener('click', () => {
        swatchContainer
          .querySelectorAll('.car-hero-swatch')
          .forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        applyColorShader(block, colorName);
        activeColorName.textContent = capitalize(colorName);
      });

      swatchContainer.appendChild(swatch);
    });

    colorSection.appendChild(swatchContainer);
    colorSection.appendChild(activeColorName);
    content.appendChild(colorSection);
  }

  block.appendChild(content);

  // Scanline overlay
  const scanline = document.createElement('div');
  scanline.className = 'car-hero-scanline';
  scanline.setAttribute('aria-hidden', 'true');
  block.appendChild(scanline);

  // Apply initial color
  if (availableColors.length > 0) {
    applyColorShader(block, availableColors[0]);
  }

  // Staggered entrance animations
  const animTargets = content.querySelectorAll(
    '.car-hero-title, .car-hero-description, .car-hero-price, .car-hero-colors',
  );

  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
  });

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
}
