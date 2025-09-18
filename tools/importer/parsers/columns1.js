/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner container holding the columns
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;

  // Find all direct children that are columns (flex containers)
  const columns = Array.from(inner.children);
  if (columns.length < 2) return;

  // --- Column 1: Image ---
  // Use less specific selector to find the first image in the first column
  let imgCell = null;
  const img = columns[0].querySelector('img');
  if (img) {
    imgCell = img;
  }

  // --- Column 2: Content ---
  // Collect all content from the second column, not just specific widgets
  const contentCol = columns[1];
  const contentCell = document.createElement('div');

  // Append all heading elements
  contentCol.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    contentCell.appendChild(h);
  });
  // Append all paragraphs
  contentCol.querySelectorAll('p').forEach(p => {
    contentCell.appendChild(p);
  });
  // Append all buttons/links
  contentCol.querySelectorAll('a').forEach(a => {
    contentCell.appendChild(a);
  });

  // --- Build the Columns Table ---
  const headerRow = ['Columns (columns1)'];
  // Only add columns that have content (no empty columns)
  const row = [];
  if (imgCell) row.push(imgCell);
  if (contentCell.childNodes.length > 0) row.push(contentCell);
  if (row.length < 2) return; // Only use columns block if there are at least 2 columns

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  element.replaceWith(table);
}
