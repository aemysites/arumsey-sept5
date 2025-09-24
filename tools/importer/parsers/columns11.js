/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main parent container
  const parent = element.querySelector('.elementor-element.e-parent');
  // Get all visible child columns (e-child)
  const childCols = parent ? Array.from(parent.querySelectorAll('.e-child')) : [];

  // For each column, extract all widget content (heading, text, button, etc.)
  const columns = childCols.map(col => {
    const frag = document.createDocumentFragment();
    // Get all elementor-widget-container elements in this column
    const containers = col.querySelectorAll('.elementor-widget-container');
    containers.forEach(container => {
      Array.from(container.childNodes).forEach(node => frag.appendChild(node.cloneNode(true)));
    });
    // Also check for images directly in the column (not inside a widget)
    const imgs = col.querySelectorAll('img');
    imgs.forEach(img => {
      // Only add if not already included
      if (!Array.from(frag.childNodes).some(n => n.tagName === 'IMG' && n.src === img.src)) {
        frag.appendChild(img.cloneNode(true));
      }
    });
    // Return fragment if it has content, otherwise null
    return frag.childNodes.length ? frag : null;
  }).filter(cell => cell && (cell.childNodes.length));

  // If no columns found, fallback to all content in a single cell
  let row;
  if (columns.length) {
    row = columns;
  } else {
    // fallback: try to extract all text content from the parent
    const fallbackCell = document.createElement('div');
    fallbackCell.textContent = parent ? parent.textContent.trim() : element.textContent.trim();
    row = [fallbackCell];
  }
  // Table header
  const headerRow = ['Columns (columns11)'];
  const rows = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
