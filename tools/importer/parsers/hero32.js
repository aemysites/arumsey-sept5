/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // 1. Header row
  const headerRow = ['Hero (hero32)'];

  // 2. Image row: use the referenced <img> element (not a new one)
  const img = element.querySelector('img');
  const imageRow = [img || ''];

  // 3. Content row: Title (h1), paragraph, no CTA (no visible button in screenshot)
  const h2 = element.querySelector('h2');
  let titleEl = null;
  if (h2) {
    const a = h2.querySelector('a');
    titleEl = document.createElement('h1');
    titleEl.textContent = a ? a.textContent : h2.textContent;
  }

  const p = element.querySelector('p');
  let paraEl = null;
  if (p) {
    paraEl = document.createElement('p');
    paraEl.innerHTML = p.innerHTML;
  }

  // Compose content cell: Title (h1), then paragraph
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (paraEl) contentCell.push(paraEl);

  const contentRow = [contentCell];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
