/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child containers (columns)
  function getColumns(el) {
    // Try to find .e-con-inner > direct children, else fallback to direct children
    const inner = el.querySelector('.e-con-inner');
    if (inner) {
      return Array.from(inner.children).filter(child => child.nodeType === 1);
    }
    return Array.from(el.children).filter(child => child.nodeType === 1);
  }

  // Get the columns for this block
  const columns = getColumns(element);

  // Defensive: skip if no columns found
  if (!columns.length) return;

  // Compose the table rows
  const headerRow = ['Columns (columns15)'];
  // Each column is a cell in the second row
  const contentRow = columns;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
