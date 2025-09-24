/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct children containers (the columns)
  let columns = [];
  // Try to find .e-con-inner > .e-con (Elementor layout)
  const inner = element.querySelector(':scope > .e-con-inner');
  if (inner) {
    columns = Array.from(inner.children).filter(c => c.classList.contains('e-con'));
  } else {
    // fallback: just use direct children
    columns = Array.from(element.children).filter(c => c.classList.contains('e-con'));
  }
  // Defensive: if still empty, try all children
  if (columns.length === 0) columns = Array.from(element.children);

  // For each column, find the main content block (usually the deepest child with widgets)
  const getColumnContent = (col) => {
    // If the column has only one child, drill down
    let node = col;
    while (node.children.length === 1 && node.firstElementChild) {
      node = node.firstElementChild;
    }
    // If node contains multiple widgets, return as is
    return node;
  };

  // Build the columns row: always 4 columns for this block
  const cells = [];
  for (let i = 0; i < 4; i++) {
    if (columns[i]) {
      cells.push(getColumnContent(columns[i]));
    } else {
      cells.push('');
    }
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns15)'];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cells,
  ], document);

  element.replaceWith(table);
}
