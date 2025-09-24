/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero54)'];

  // 2. Background image row (optional)
  let bgImg = '';
  const img = element.querySelector('img');
  if (img) {
    bgImg = img;
  }

  // 3. Content row: extract only the relevant headline/subheading/cta content
  // Find the heading (h2)
  const h2 = element.querySelector('h2');

  // Find the first <p> with <strong> (subheading)
  let subheading = null;
  const paragraphs = element.querySelectorAll('p');
  for (const p of paragraphs) {
    if (p.querySelector('strong')) {
      subheading = p;
      break;
    }
  }

  // Find the next paragraph after the subheading (if any) that has text
  let description = null;
  if (subheading) {
    let next = subheading.nextElementSibling;
    while (next && next.tagName !== 'P') {
      next = next.nextElementSibling;
    }
    if (next && next.textContent.trim()) {
      description = next;
    }
  }

  // Compose the content cell
  const contentCell = document.createElement('div');
  if (h2) contentCell.appendChild(h2.cloneNode(true));
  if (subheading && subheading !== h2) contentCell.appendChild(subheading.cloneNode(true));
  if (description && description !== subheading && description !== h2) contentCell.appendChild(description.cloneNode(true));

  // 4. Build the rows
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentCell],
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
