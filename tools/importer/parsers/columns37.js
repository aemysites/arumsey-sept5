/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must always be the block name
  const headerRow = ['Columns (columns37)'];

  // Get all immediate children of the block
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the heading (Filtrar por MÊS)
  let headingContent = '';
  for (const child of children) {
    const h2 = child.querySelector('h2');
    if (h2) {
      // Include the entire heading container, not just the h2
      const headingContainer = h2.closest('.elementor-widget-container') || h2;
      headingContent = headingContainer.cloneNode(true);
      break;
    }
  }

  // Find the filter buttons (Maio, Novembro)
  let filterContent = '';
  for (const child of children) {
    const search = child.querySelector('search');
    if (search) {
      // Include the whole search block with all buttons
      filterContent = search.cloneNode(true);
      break;
    }
  }

  // Compose the columns row with full blocks of content
  const columnsRow = [
    headingContent || '',
    filterContent || ''
  ];

  // Compose the table
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
