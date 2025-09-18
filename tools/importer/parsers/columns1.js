/* global WebImporter */
export default function parse(element, { document }) {
  // Find image element
  const img = element.querySelector('img');

  // Find heading
  const heading = element.querySelector('h1, h2, h3');

  // Find all paragraphs
  const paragraphs = Array.from(element.querySelectorAll('p'));

  // Find button (anchor inside .elementor-button)
  const button = element.querySelector('a.elementor-button');

  // Compose content column: heading, paragraphs, button
  const contentCol = [heading, ...paragraphs, button].filter(Boolean);

  // Build table rows
  const headerRow = ['Columns (columns1)'];
  const secondRow = [img, contentCol];
  const cells = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
