/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Hero (hero18)'];

  // Find the first image inside the element (background image)
  const img = element.querySelector('img');
  const backgroundRow = [img ? img : ''];

  // Always include the third row, even if empty (required by block spec)
  const contentRow = [''];

  const rows = [
    headerRow,
    backgroundRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
