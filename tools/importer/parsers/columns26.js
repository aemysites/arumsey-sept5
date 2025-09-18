/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract content from a column block
  function extractColumnContent(columnDiv) {
    // Get all headings in this column
    const headings = columnDiv.querySelectorAll('.elementor-heading-title');
    // Get all text editor paragraphs
    const paragraphs = Array.from(columnDiv.querySelectorAll('.elementor-widget-text-editor p'));
    // Compose the column cell
    const cellContent = [];
    headings.forEach(h => cellContent.push(h));
    paragraphs.forEach(p => cellContent.push(p));
    return cellContent.length ? cellContent : null;
  }

  // Find all top-level column containers with a heading
  const topLevelColumns = Array.from(element.children).filter(child => child.querySelector('.elementor-heading-title'));
  // Only keep columns that have heading and/or text
  const columnCells = topLevelColumns.map(col => extractColumnContent(col)).filter(cellArr => cellArr && cellArr.length > 0);

  if (!columnCells.length) return;

  // Table header row
  const headerRow = ['Columns (columns26)'];
  // Table content row: one cell per column, no empty columns
  const contentRow = columnCells;

  // Build the table
  const cells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
