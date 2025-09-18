/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Columns (columns23)'];

  // Per the HTML, there is no content in these containers, so do not create any content rows or columns
  // The correct output is a table with only the header row and no empty columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow
  ], document);
  element.replaceWith(table);
}
