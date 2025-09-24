/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find all direct column containers
  let columns = [];
  const inner = element.querySelector(':scope > .e-con-inner');
  if (inner) {
    columns = Array.from(inner.children);
  } else {
    columns = Array.from(element.children);
  }

  // Step 2: For each column, extract image and heading (preserve structure)
  // Only include columns with actual content
  const columnCells = columns
    .map((col) => {
      const img = col.querySelector('img');
      const heading = col.querySelector('h2, h1, h3, h4, h5, h6');
      const cellContent = document.createElement('div');
      if (img) cellContent.appendChild(img);
      if (heading) cellContent.appendChild(heading);
      return cellContent.childNodes.length ? cellContent : null;
    })
    .filter(cell => cell !== null); // Remove empty columns

  // Step 3: Build the table
  const headerRow = ['Columns (columns63)'];
  const tableRows = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Step 4: Replace original element
  element.replaceWith(table);
}
