/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero20)'];

  // 2. Background image row (always present, can be empty string)
  let bgImage = '';
  let node = element;
  while (node && node !== document.body) {
    const style = node.getAttribute && node.getAttribute('style');
    if (style && /background-image\s*:\s*url\(([^)]+)\)/i.test(style)) {
      const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1].replace(/['"]/g, '');
        img.alt = '';
        bgImage = img;
        break;
      }
    }
    node = node.parentNode;
  }
  // Always include a background image row, even if empty
  const bgRow = [bgImage ? bgImage : ''];

  // 3. Content row (title, subheading, cta, etc)
  // Only extract heading and first text-editor (the visible overlay content)
  let contentCell = '';
  const overlayContainer = Array.from(element.children).find(
    (child) => child.classList && child.classList.contains('elementor-element-477fd6f1')
  );
  if (overlayContainer) {
    const headingWidget = overlayContainer.querySelector('.elementor-widget-heading .elementor-widget-container');
    const textWidget = overlayContainer.querySelector('.elementor-widget-text-editor .elementor-widget-container');
    const contentParts = [];
    if (headingWidget) {
      contentParts.push(...Array.from(headingWidget.childNodes));
    }
    if (textWidget) {
      contentParts.push(...Array.from(textWidget.childNodes));
    }
    if (contentParts.length > 0) {
      contentCell = contentParts.length === 1 ? contentParts[0] : contentParts;
    }
  }
  const contentRow = [contentCell];

  // Compose table: always 3 rows, always 1 column
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
