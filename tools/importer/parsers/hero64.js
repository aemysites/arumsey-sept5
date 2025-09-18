/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from elementor video overlay
  function getBackgroundImageUrl(el) {
    if (!el) return null;
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    return match ? match[1] : null;
  }

  // Find the inner container
  const inner = element.querySelector('.e-con-inner') || element;
  const children = Array.from(inner.children);

  // --- 1. Extract Background Image (from video overlay) ---
  let backgroundImageEl = null;
  let backgroundImageUrl = null;
  // Find the video widget
  const videoWidget = children.find((child) => child.classList && child.classList.contains('elementor-widget-video'));
  if (videoWidget) {
    const overlay = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
    backgroundImageUrl = getBackgroundImageUrl(overlay);
    if (backgroundImageUrl) {
      // Create an img element for the background image
      backgroundImageEl = document.createElement('img');
      backgroundImageEl.src = backgroundImageUrl;
      backgroundImageEl.alt = '';
      backgroundImageEl.loading = 'lazy';
      backgroundImageEl.style.maxWidth = '100%';
    }
  }

  // --- 2. Extract Headline ---
  let headlineEl = null;
  const headingWidget = children.find((child) => child.classList && child.classList.contains('elementor-widget-heading'));
  if (headingWidget) {
    headlineEl = headingWidget.querySelector('h2, h1, h3, h4, h5, h6');
  }

  // --- 3. Extract Subheading (first text editor after heading) ---
  let subheadingEl = null;
  let subheadingIdx = -1;
  if (headlineEl) {
    const headingIdx = children.indexOf(headingWidget);
    for (let i = headingIdx + 1; i < children.length; i++) {
      const child = children[i];
      if (child.classList && child.classList.contains('elementor-widget-text-editor')) {
        subheadingEl = child.querySelector('p');
        subheadingIdx = i;
        break;
      }
    }
  }

  // --- 4. Extract CTA Button ---
  let ctaEl = null;
  const buttonWidget = children.find((child) => child.classList && child.classList.contains('elementor-widget-button'));
  if (buttonWidget) {
    ctaEl = buttonWidget.querySelector('a');
  }

  // --- 5. Extract Additional Text (after video) ---
  let additionalTextEls = [];
  if (videoWidget) {
    const videoIdx = children.indexOf(videoWidget);
    for (let i = videoIdx + 1; i < children.length; i++) {
      const child = children[i];
      if (child.classList && child.classList.contains('elementor-widget-text-editor')) {
        const p = child.querySelector('p');
        if (p) additionalTextEls.push(p);
      }
    }
  }

  // --- 6. Compose the table rows ---
  const headerRow = ['Hero (hero64)'];

  // Row 2: Background image (optional)
  const backgroundRow = [backgroundImageEl ? backgroundImageEl : ''];

  // Row 3: Content (headline, subheading, CTA, additional text)
  const contentCells = [];
  if (headlineEl) contentCells.push(headlineEl);
  if (subheadingEl) contentCells.push(subheadingEl);
  if (additionalTextEls.length) contentCells.push(...additionalTextEls);
  if (ctaEl) contentCells.push(ctaEl);
  const contentRow = [contentCells.length ? contentCells : ''];

  // Build table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(table);
}
