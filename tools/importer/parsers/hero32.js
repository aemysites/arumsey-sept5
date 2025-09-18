/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get all direct children
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // Find the image (background)
  let img = null;
  for (const child of children) {
    if (child.tagName === 'A' && child.querySelector('img')) {
      img = child.querySelector('img');
      break;
    }
    if (child.tagName === 'IMG') {
      img = child;
      break;
    }
  }

  // Find the heading (title)
  let headingText = '';
  let headingLink = '';
  for (const child of children) {
    if (/^H[1-6]$/.test(child.tagName)) {
      const h = child;
      if (h.querySelector('a')) {
        headingText = h.textContent.trim();
        headingLink = h.querySelector('a').getAttribute('href');
      } else {
        headingText = h.textContent.trim();
      }
      break;
    }
    if (child.tagName === 'A' && child.querySelector('h2')) {
      const h = child.querySelector('h2');
      headingText = h.textContent.trim();
      headingLink = child.getAttribute('href');
      break;
    }
  }

  // Compose heading element as a heading tag (h2) with link if present
  let headingEl = null;
  if (headingText) {
    headingEl = document.createElement('h2');
    if (headingLink) {
      const a = document.createElement('a');
      a.href = headingLink;
      a.textContent = headingText;
      headingEl.appendChild(a);
    } else {
      headingEl.textContent = headingText;
    }
  }

  // Find paragraph (description/subheading)
  let paragraph = null;
  for (const child of children) {
    if (child.tagName === 'P') {
      paragraph = child;
      break;
    }
  }

  // Compose the content cell: headingEl, paragraph
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (paragraph) contentCell.push(paragraph);

  // Table rows
  const headerRow = ['Hero (hero32)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
