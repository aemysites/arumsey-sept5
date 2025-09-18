/* global WebImporter */
export default function parse(element, { document }) {
  // Get all column containers (each represents a column)
  const columnContainers = Array.from(element.querySelectorAll(':scope > .e-con-inner > .elementor-element'));

  // Defensive fallback: If not found, try alternative structure
  const columns = columnContainers.length ? columnContainers : Array.from(element.children);

  // For each column, extract image and heading (preserve semantic HTML)
  const columnCells = columns.map(col => {
    // Find image
    const imgWidget = col.querySelector('.elementor-widget-image');
    let imgEl = null;
    if (imgWidget) {
      imgEl = imgWidget.querySelector('img');
    }

    // Find heading
    const headingWidget = col.querySelector('.elementor-widget-heading');
    let headingEl = null;
    if (headingWidget) {
      headingEl = headingWidget.querySelector('h2');
    }

    // Compose cell content
    const cellContents = [];
    if (imgEl) cellContents.push(imgEl);
    if (headingEl) cellContents.push(headingEl);

    // Only return cell if it has meaningful content
    if (cellContents.length > 0) {
      return cellContents;
    }
    // Otherwise, skip this column (do not include empty columns)
    return null;
  }).filter(cell => cell !== null);

  // Table structure: header row, then one row with all columns
  const headerRow = ['Columns (columns63)'];
  const tableRows = [headerRow, columnCells];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
