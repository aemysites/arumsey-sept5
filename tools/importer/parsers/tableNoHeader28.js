/* global WebImporter */
export default function parse(element, { document }) {
  // Table block name header
  const headerRow = ['Table (no header, tableNoHeader28)'];

  // Defensive: Find all immediate <p> children inside the widget container
  // The structure is: element > ... > .elementor-widget-container > <p>
  const widgetContainer = element.querySelector('.elementor-widget-container');
  let dataRows = [];
  if (widgetContainer) {
    const paragraphs = Array.from(widgetContainer.querySelectorAll('p'));
    // Each <p> becomes a single cell row
    dataRows = paragraphs.map(p => [p]);
  }

  // Compose table cells
  const cells = [headerRow, ...dataRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
