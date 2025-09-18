/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Identify columns (each direct child container)
  const columns = Array.from(element.children).filter(col => {
    // Only keep columns with content (heading, paragraph, button, image)
    return col.querySelector('h2, p, a, img');
  });

  // Step 2: For each column, extract structured content
  const columnCells = columns.map(col => {
    const cellContent = [];
    // Extract heading (preserve semantic level)
    const heading = col.querySelector('h2');
    if (heading) cellContent.push(heading);
    // Extract paragraph
    const paragraph = col.querySelector('p');
    if (paragraph) cellContent.push(paragraph);
    // Extract button (as link)
    const button = col.querySelector('a');
    if (button) cellContent.push(button);
    // Extract image (reference the element, do not clone)
    const image = col.querySelector('img');
    if (image) cellContent.push(image);
    // If no content found, fallback to the column itself
    if (cellContent.length === 0) cellContent.push(col);
    return cellContent;
  });

  // Step 3: Build table rows
  const headerRow = ['Columns (columns59)'];
  const rows = [headerRow, columnCells];

  // Step 4: Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
