/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero6)'];

  // 2. Background image row: find the first image in the element or its children
  let backgroundImage = '';
  const img = element.querySelector('img');
  if (img) {
    backgroundImage = img.cloneNode(true);
  }
  const bgRow = [backgroundImage];

  // 3. Content row: gather all content from the main overlay box (the green box)
  let contentCell = [];
  // Find all .elementor-widget-container that have at least one heading or paragraph
  const containers = Array.from(element.querySelectorAll('.elementor-widget-container'));
  let mainContent = null;
  for (const container of containers) {
    if (container.querySelector('h1, h2, h3, h4, p')) {
      mainContent = container;
      break;
    }
  }
  if (mainContent) {
    contentCell = [mainContent.cloneNode(true)];
  } else {
    // Fallback: collect all h1-h4 and p in DOM order
    const nodes = element.querySelectorAll('h1, h2, h3, h4, p');
    contentCell = Array.from(nodes).map(n => n.cloneNode(true));
  }

  // Always include the content row
  const contentRow = [contentCell];

  // Compose table rows (always 3 rows: header, bg, content)
  const cells = [headerRow, bgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
