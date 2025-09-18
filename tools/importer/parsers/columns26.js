/* global WebImporter */
export default function parse(element, { document }) {
  // Find all top-level column containers (each e-child with children)
  const columns = [];
  const topLevelContainers = Array.from(element.children).filter(child => child.classList.contains('e-child'));

  topLevelContainers.forEach(colContainer => {
    // Each column has nested containers; gather all heading and text content in order
    const cell = document.createElement('div');
    // Find all headings (number and content)
    const headings = colContainer.querySelectorAll('.elementor-widget-heading .elementor-heading-title');
    headings.forEach(h => cell.appendChild(h.cloneNode(true)));
    // Find all text content paragraphs
    const textEditors = colContainer.querySelectorAll('.elementor-widget-text-editor p');
    textEditors.forEach(p => cell.appendChild(p.cloneNode(true)));
    columns.push(cell);
  });

  // Table header row must match block name exactly
  const headerRow = ['Columns (columns26)'];
  // Table body: one row with all columns
  const tableRows = [headerRow, columns];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
