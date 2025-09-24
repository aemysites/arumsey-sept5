/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero20)'];

  // 2. Background image row
  let bgImg = '';
  const imgEl = element.querySelector('img');
  if (imgEl) bgImg = imgEl;
  const bgImgRow = [bgImg];

  // 3. Content row (heading, subheading, CTA)
  // Only include heading and first text block, exclude accordion/details and extra lists
  const contentContainer = element.querySelector('[data-id="477fd6f1"]');
  const contentFragments = [];
  if (contentContainer) {
    // Heading
    const h2 = contentContainer.querySelector('h2');
    if (h2) contentFragments.push(h2);
    // Only the first text-editor widget (direct child, not inside accordion)
    const textBlocks = contentContainer.querySelectorAll('.elementor-widget-text-editor');
    for (const tb of textBlocks) {
      if (!tb.closest('.e-n-accordion')) {
        contentFragments.push(tb);
        break; // Only the first one for subheading/paragraph
      }
    }
    // Do NOT include the accordion/details content
  }
  const contentRow = [contentFragments.length ? contentFragments : ''];

  // Compose the table
  const tableRows = [
    headerRow,
    bgImgRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
