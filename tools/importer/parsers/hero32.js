/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // 1. Header row: always block name
  const headerRow = ['Hero (hero32)'];

  // 2. Image row: find the main image (background)
  let imgEl = null;
  const imgs = element.querySelectorAll('img');
  if (imgs.length > 0) {
    imgEl = imgs[0];
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row: include all text content from the source html
  // Get the h2 (title)
  let titleEl = null;
  const h2 = element.querySelector('h2.entry-title');
  if (h2) {
    const a = h2.querySelector('a');
    if (a) {
      titleEl = document.createElement('h1');
      titleEl.textContent = a.textContent.trim();
    }
  }

  // Get the p (paragraph)
  let paragraphEl = null;
  const p = element.querySelector('p');
  if (p) {
    // Use the full paragraph element for maximum text coverage
    paragraphEl = p.cloneNode(true);
  }

  // Compose content row with all available elements
  const contentRow = [
    [
      titleEl ? titleEl : '',
      paragraphEl ? paragraphEl : ''
    ].filter(Boolean)
  ];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
