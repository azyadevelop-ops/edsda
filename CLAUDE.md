# CLAUDE.md - Project Guide

## Project Overview

This is **Velocity** — a modern futuristic automotive showcase, built as an **Adobe Edge Delivery Services (EDS) / AEM (XWalk)** site on `@adobe/aem-boilerplate` v1.3.0. Content is authored in AEM and delivered via the Franklin/Helix pipeline. The content source is an AEM Cloud author instance (`author-p75453-e1795963.adobeaemcloud.com`) configured in `fstab.yaml` with markup-based delivery.

The visual identity is defined in `design-reference.html` (the style guide).

## Architecture

EDS uses a document-based authoring model. Pages are authored in AEM, converted to semantic HTML, then decorated client-side by JavaScript. The page lifecycle follows three phases:

1. **Eager** (`loadEager`) - Decorates DOM, loads first section and fonts for LCP
2. **Lazy** (`loadLazy`) - Loads header, remaining sections, footer, lazy styles
3. **Delayed** (`loadDelayed`) - Loads `delayed.js` after 3 seconds for non-critical work (scroll-reveal animations)

Blocks are auto-loaded: for a block with class `foo`, the system loads `blocks/foo/foo.js` and `blocks/foo/foo.css`.

## Design System — Velocity

The full style guide is in `design-reference.html`. Below is the reference for implementation.

### Color Palette

**Carbon Neutrals** (primary neutral scale, blue-undertone dark palette):
| Token | Hex | Usage |
|---|---|---|
| `--carbon-950` | `#07090C` | Body bg (deepest), footer bg |
| `--carbon-900` | `#0C1017` | Primary dark bg, hero, header, `--background-color` |
| `--carbon-800` | `#131721` | Card bg, elevated surfaces, highlight sections |
| `--carbon-700` | `#1C2233` | Borders (`--border-color`), input bg |
| `--carbon-600` | `#2A3347` | Border strong (`--border-strong`) |
| `--carbon-500` | `#4A5568` | Muted text (`--text-muted`) |
| `--carbon-400` | `#718096` | Placeholder, hero subtitles |
| `--carbon-300` | `#A0AEC0` | Secondary text (`--text-secondary`) |
| `--carbon-200` | `#CBD5E0` | — |
| `--carbon-100` | `#E2E8F0` | Primary text (`--text-color`) |
| `--carbon-50`  | `#F7FAFC` | Lightest (rare) |

**Accent Colors**:
| Token | Hex | Usage |
|---|---|---|
| `--electric-cyan` | `#00D4FF` | Primary action color, links, CTAs, glow effects |
| `--electric-cyan-light` | `#66E5FF` | Hover states |
| `--electric-cyan-dark` | `#00A3C7` | Pressed states |
| `--plasma-violet` | `#7B61FF` | Secondary accent, gradient endpoints |
| `--plasma-violet-light` | `#A48BFF` | Hover gradients |
| `--plasma-violet-dark` | `#5A3FD6` | Pressed gradients |

**Status Colors**:
| Token | Hex | Usage |
|---|---|---|
| `--status-error` | `#FF4D6A` | Error states, destructive actions |
| `--status-success` | `#00E68A` | Success states |
| `--status-warning` | `#FFB830` | Warnings |
| `--status-info` | `var(--electric-cyan)` | Informational |

### Typography

Four fonts loaded via Google Fonts (`fonts.css` lazy-loaded for performance):

| Variable | Font | Usage |
|---|---|---|
| `--font-display` | Orbitron | Hero titles, section headers, card headings. ALL CAPS. Never below 20px. |
| `--font-heading` | Space Grotesk | Headings h3-h6, nav, buttons, UI labels. Weights 300–700. |
| `--font-body` | Inter | Body text, descriptions. Weights 300–700. |
| `--font-mono` | JetBrains Mono | Technical data, specs, hex values. Weights 400–500. |

**Heading hierarchy**:
- `h1` — Orbitron 700, `--heading-font-size-xxl` (55px), uppercase, letter-spacing 3px
- `h2` — Orbitron 700, `--heading-font-size-xl` (42px), uppercase, letter-spacing 2px
- `h3` — Space Grotesk 700, `--heading-font-size-l` (32px)
- `h4` — Space Grotesk 700, `--heading-font-size-m` (24px)
- `h5` — Space Grotesk 600, `--heading-font-size-s` (18px)
- `h6` — Space Grotesk 600, `--heading-font-size-xs` (14px), uppercase, letter-spacing 2px, muted color

### Spacing, Radius & Shadows

```
--radius-sm: 2px    --shadow-sm: 0 1px 3px rgb(7 9 12 / 20%)
--radius-md: 4px    --shadow-md: 0 4px 12px rgb(7 9 12 / 25%)
--radius-lg: 8px    --shadow-lg: 0 8px 30px rgb(7 9 12 / 30%)
--radius-xl: 12px   --shadow-xl: 0 16px 50px rgb(7 9 12 / 40%)
```

### Glass Morphism Tokens

```
--glass-bg: rgba(19, 23, 33, 0.6)
--glass-border: rgba(0, 212, 255, 0.12)
--glass-blur: blur(12px)
--shadow-glow: 0 0 20px rgba(0,212,255,0.15), 0 0 60px rgba(0,212,255,0.05)
--shadow-glow-sm: 0 0 10px rgba(0,212,255,0.1)
```

Used for cards, header nav, dropdown menus. Always pair `backdrop-filter: blur()` with `--glass-border`.

### Button Styles

- **Default/Primary**: Cyan→Violet gradient bg, dark text, `--radius-md`, Space Grotesk 600 uppercase. Glow shadow on hover.
- **Secondary**: Transparent bg, `carbon-400` border, light text. On hover: border turns cyan with glow.
- **Disabled**: `carbon-700` bg, `carbon-500` text

### Animation System

Animations are split across two files for performance:

- **`blocks/hero/hero.js`** — Staggered entrance animation for hero content (h1, p, button). Uses double-rAF. Also creates `.hero-scanline` overlay div.
- **`styles/lazy-styles.css`** — Defines `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-children` CSS classes. Ambient floating orbs via `body::before`. Focus-visible glow ring.
- **`scripts/delayed.js`** — IntersectionObserver (threshold 0.1, -50px root margin). Observes sections (except first), cards blocks, and column rows. Adds `.reveal` then `.revealed` classes.

All animations respect `prefers-reduced-motion: reduce` — hero.js checks the media query and skips transitions; delayed.js skips the entire observer setup.

### Design Rules

1. `--electric-cyan` is the primary action color — reserve for CTAs, active states, links, key data
2. `--plasma-violet` is secondary — use for gradients alongside cyan, never alone as primary
3. Never use `Orbitron` for body text or below 20px
4. Never use `Space Grotesk` for body/paragraph text
5. Dark-first: body background is always `--carbon-950`
6. Use `--status-error` for errors, never cyan or violet
7. Glass morphism: always pair `backdrop-filter: blur()` with `--glass-border`
8. Max 2 accent colors per view (cyan + violet)
9. Respect `prefers-reduced-motion` — all animations must be skippable

## Key Files

### Root Configuration
- `fstab.yaml` - Content source mountpoint (AEM Cloud author instance, markup type)
- `paths.json` - AEM content path mappings (`/content/EDS/` -> `/`)
- `head.html` - Injected into every page `<head>` (CSP, viewport, Google Fonts preconnect, script/style includes)
- `helix-query.yaml` - Query index definition (generates `/query-index.json`)
- `helix-sitemap.yaml` - Sitemap generation config (source: query-index)
- `design-reference.html` - Complete visual style guide (colors, typography, components, usage rules)
- `404.html` - Custom 404 error page with SVG number display and back navigation
- `package.json` - Dev tooling only (linting, JSON merging, husky); no build step for site code

### Universal Editor / AEM Authoring (XWalk)
- `component-definition.json` - Defines available components (text, title, image, button, section, cards, columns, fragment, hero)
- `component-models.json` - Field definitions for each component's authoring dialog (properties, types, labels)
- `component-filters.json` - Controls which components can be placed inside which containers (e.g., `card` inside `cards`, `column` inside `columns`)
- `tools/sidekick/config.json` - AEM Sidekick configuration (project name, edit URL pattern)

### Per-Block Model Files (`models/` and `blocks/*/_*.json`)
JSON fragments that are merged via `npm run build:json` into the root `component-*.json` files:
- `models/_component-definition.json`, `models/_component-models.json`, `models/_component-filters.json` - Base definitions
- `models/_page.json`, `models/_section.json`, `models/_text.json`, `models/_title.json`, `models/_image.json`, `models/_button.json` - Core component models
- `blocks/hero/_hero.json`, `blocks/cards/_cards.json`, `blocks/columns/_columns.json`, `blocks/fragment/_fragment.json` - Block-specific model fragments

## Scripts (`scripts/`)

| File | Purpose |
|---|---|
| `aem.js` | Core EDS framework: RUM, DOM decoration (sections, blocks, buttons, icons), block loading, CSS/JS loading, image optimization. **Do not modify** - this is the AEM SDK. |
| `scripts.js` | Site-specific customization. Imports from `aem.js`. Contains `decorateMain()`, `loadEager/loadLazy/loadDelayed` lifecycle, `moveInstrumentation()` helper for Universal Editor. Entry point for page loading. |
| `delayed.js` | Scroll-reveal animations via IntersectionObserver. Loaded 3s after page load. Observes sections, cards, and column rows. Respects `prefers-reduced-motion`. |
| `editor-support.js` | Universal Editor live preview. Handles `aue:content-*` events for in-place content updates without page reload. |
| `editor-support-rte.js` | Rich text editor support. Groups richtext-instrumented elements into editable wrappers for the Universal Editor. |
| `dompurify.min.js` | DOMPurify library for HTML sanitization (used by editor-support). |

## Blocks (`blocks/`)

Each block has its own directory with `blockname.js` (decoration logic) and `blockname.css` (styles). Blocks export a default `decorate(block)` function.

| Block | Description |
|---|---|
| `header/` | Glass morphism navigation header. `backdrop-filter: blur(16px)` with glass border. Orbitron brand in electric cyan. Animated underline on desktop nav hover. Hamburger menu for mobile (<900px). |
| `footer/` | Dark footer (`carbon-950` bg, `carbon-700` top border). Cyan link hovers with glow. |
| `hero/` | Full-bleed hero with gradient mesh animation (cyan + violet radial gradients, 8s pulse). Bottom accent line (cyan→violet). Staggered entrance animations in `hero.js`. Scan-line overlay. |
| `cards/` | Glass morphism card grid. `backdrop-filter: blur(12px)`, glass border, gradient border overlay on hover (cyan→violet). Image zoom on hover. Staggered reveal via delayed.js. |
| `columns/` | Multi-column layout. Left border accent (carbon-700 → cyan on hover). Images get `--radius-lg` + border. |
| `fragment/` | Content fragment inclusion. Fetches `.plain.html`, decorates and loads it as inline content. Exports `loadFragment()` used by header and footer. |

## Styles (`styles/`)

| File | Purpose |
|---|---|
| `styles.css` | Global styles loaded eagerly. Velocity design tokens (carbon palette, electric cyan, plasma violet, glass morphism tokens, glow shadows), fallback font-face declarations, base typography, buttons, links, sections. |
| `fonts.css` | Google Fonts import for Orbitron, Space Grotesk, Inter, JetBrains Mono. Loaded after LCP on desktop or from session cache. |
| `lazy-styles.css` | Post-LCP animations: scroll-reveal classes (`.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-children`), ambient floating orbs, focus-visible glow ring, smooth scrolling. |

## Icons (`icons/`)

SVG icons referenced via `<span class="icon icon-{name}">`. Currently contains `search.svg`.

## Development

### Commands
- `npm run lint` - Run ESLint + Stylelint
- `npm run lint:fix` - Auto-fix lint issues
- `npm run lint:js` - ESLint only (JS + JSON)
- `npm run lint:css` - Stylelint only (blocks + styles CSS)
- `npm run build:json` - Merge per-block `_*.json` model fragments into root `component-*.json` files

### CI
GitHub Actions (`.github/workflows/main.yaml`) runs `npm ci && npm run lint` on every push.

### Linting
- ESLint: Airbnb base config with `eslint-plugin-xwalk` for EDS validation (`.eslintrc.js`)
- Stylelint: Standard config (`.stylelintrc.json`)
- Pre-commit hooks via Husky

## Conventions

### Adding a New Block
1. Create `blocks/blockname/blockname.js` with `export default function decorate(block) { ... }`
2. Create `blocks/blockname/blockname.css` for styles using Velocity design tokens
3. Create `blocks/blockname/_blockname.json` with `definitions`, `models`, and `filters` arrays
4. Run `npm run build:json` to merge into root component JSON files
5. The block auto-loads when a `<div class="blockname">` is encountered in page content

### Button Styling
- Default button: link in a `<p>` tag (cyan→violet gradient)
- Primary button: link wrapped in `<strong>` in a `<p>` tag (cyan→violet gradient)
- Secondary button: link wrapped in `<em>` in a `<p>` tag (transparent + carbon-400 border)

### Section Styles
Sections can have metadata-driven styles:
- `highlight` / `light` — `carbon-800` background with glass borders
- `dark` — `carbon-950` background with CSS grid pattern overlay (subtle cyan lines)

### Responsive Breakpoint
Single breakpoint at `900px` (mobile/tablet vs desktop). Used throughout styles and header JS. Container max-width is `1200px` with `24px` mobile / `32px` desktop padding.

### Content Fragments
Header and footer content come from AEM pages (`/nav` and `/footer` by default) loaded as fragments. Override via `nav` and `footer` metadata properties.
