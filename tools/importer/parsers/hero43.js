/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero43)'];

  // 2. Background image row
  // The image is always the first <img> inside the block
  const img = element.querySelector('img');
  const bgImageRow = [img ? img : ''];

  // 3. Content row
  // Find heading (h2)
  const heading = element.querySelector('h2');

  // Find paragraphs (text description)
  const paragraphs = Array.from(element.querySelectorAll('.elementor-widget-text-editor p'));

  // Compose content cell
  const contentCell = document.createElement('div');
  if (heading) contentCell.appendChild(heading);
  paragraphs.forEach(p => contentCell.appendChild(p));

  // Defensive: If no content found, add a blank
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  // Compose table
  const cells = [headerRow, bgImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
