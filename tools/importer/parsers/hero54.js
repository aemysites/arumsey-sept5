/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero54)'];

  // 2. Background image row
  let bgImg = element.querySelector(':scope > img');
  if (!bgImg && element.dataset.hlxBackgroundImage) {
    const urlMatch = element.dataset.hlxBackgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      bgImg = document.createElement('img');
      bgImg.src = urlMatch[1];
    }
  }
  const bgRow = [bgImg || ''];

  // 3. Content row (title, subheading, CTA)
  // Only include heading and visible text, skip accordion/details content
  let contentCell = [];

  // Find the main heading (h2 with strong, or h2)
  let heading = element.querySelector('h2');
  if (heading) contentCell.push(heading);

  // Find the first bolded paragraph (subheading)
  let subheading = null;
  const ps = Array.from(element.querySelectorAll('p'));
  for (const p of ps) {
    if (!p.closest('details') && p.querySelector('strong')) {
      subheading = p;
      break;
    }
  }
  if (subheading && !contentCell.includes(subheading)) contentCell.push(subheading);

  // Find the first non-empty paragraph not in details/accordion and not the subheading
  for (const p of ps) {
    if (!p.closest('details') && p !== subheading && p.textContent.trim()) {
      contentCell.push(p);
      break;
    }
  }

  // If nothing found, fallback to empty string
  if (!contentCell.length) contentCell = [''];

  const contentRow = [contentCell];

  // Compose table
  const rows = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
