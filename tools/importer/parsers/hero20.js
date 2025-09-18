/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero20)'];

  // 2. Background image row
  let bgImg = '';
  const imgEl = element.querySelector(':scope > img');
  if (imgEl) {
    bgImg = imgEl;
  }

  // 3. Content row: only heading and first text (not accordion)
  let contentEls = [];
  // Find the first heading widget
  const headingWidget = element.querySelector('.elementor-widget-heading .elementor-widget-container');
  if (headingWidget) {
    contentEls.push(headingWidget);
  }
  // Find the first text widget that is NOT inside the accordion
  const textWidgets = Array.from(element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container'));
  let textWidget = null;
  for (const tw of textWidgets) {
    // Exclude if ancestor is accordion
    if (!tw.closest('.e-n-accordion')) {
      textWidget = tw;
      break;
    }
  }
  if (textWidget) {
    contentEls.push(textWidget);
  }

  // 2nd row: background image (optional)
  const bgRow = [bgImg ? bgImg : ''];
  // 3rd row: content (heading, text only)
  const contentRow = [contentEls.length ? contentEls : ''];

  // Build table
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
