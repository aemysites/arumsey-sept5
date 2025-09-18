/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main containers for columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Find the left column (with heading and form) and right column (with images)
  let leftCol = null;
  let rightCol = null;
  for (const col of columns) {
    if (!leftCol && (col.querySelector('form') || col.querySelector('h1, h2'))) leftCol = col;
    if (!rightCol && col.querySelector('img') && !col.querySelector('form')) rightCol = col;
  }
  if (!leftCol && columns.length) leftCol = columns[0];
  if (!rightCol && columns.length > 1) rightCol = columns[columns.length - 1];

  // LEFT COLUMN: gather all relevant content (headings, paragraphs, form)
  let leftContent = [];
  if (leftCol) {
    // Collect all headings (h1, h2, h3), paragraphs, and the form
    const blocks = Array.from(leftCol.querySelectorAll('h1, h2, h3, p'));
    leftContent.push(...blocks);
    const form = leftCol.querySelector('form');
    if (form) leftContent.push(form);
  }

  // RIGHT COLUMN: all images in the right column
  let rightContent = [];
  if (rightCol) {
    const imgs = Array.from(rightCol.querySelectorAll('img'));
    rightContent = imgs;
  }

  // Compose table rows
  const headerRow = ['Columns (columns34)'];
  const columnsRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);
  element.replaceWith(table);
}
