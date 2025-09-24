/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image for the 2nd row
  const img = element.querySelector('img');

  // Table rows as per block spec
  const headerRow = ['Hero (hero18)'];
  const imageRow = [img ? img : '']; // 2nd row: background image (optional)
  const contentRow = ['']; // 3rd row: must be present, even if empty

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
