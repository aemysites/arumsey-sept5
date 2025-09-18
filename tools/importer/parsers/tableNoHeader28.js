/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost container with the <p> elements
  let paragraphs = [];
  const widgetContainer = element.querySelector('.elementor-widget-container');
  if (widgetContainer) {
    paragraphs = Array.from(widgetContainer.querySelectorAll('p'));
  } else {
    paragraphs = Array.from(element.querySelectorAll('p'));
  }

  // Table header row as per block guidelines
  const headerRow = ['Table (no header, tableNoHeader28)'];

  // Each <p> becomes a row with a single cell containing the referenced paragraph element
  const dataRows = paragraphs.map(p => [p]);

  // Only create table if there's at least one data row
  if (dataRows.length === 0) return;

  // Build the table cells array
  const cells = [headerRow, ...dataRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
