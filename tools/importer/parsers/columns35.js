/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns35)'];

  // Defensive: get all direct children of the block
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // Find the main image (left column)
  let leftImg = null;
  for (const child of children) {
    if (child.tagName === 'IMG') {
      leftImg = child;
      break;
    }
  }

  // Find the right column content (heading)
  let rightContent = null;
  for (const child of children) {
    // Find the heading container
    if (
      child.classList.contains('elementor-element-46aa54bd') ||
      child.querySelector('.elementor-widget-heading')
    ) {
      // Find the actual heading
      const headingWidget = child.querySelector('.elementor-widget-heading');
      if (headingWidget) {
        const headingContainer = headingWidget.querySelector('.elementor-widget-container');
        if (headingContainer) {
          rightContent = headingContainer;
        }
      }
    }
  }

  // Defensive fallback: if not found, use the first h2 inside the block
  if (!rightContent) {
    const h2 = element.querySelector('h2');
    if (h2) rightContent = h2;
  }

  // Build the columns row
  const columnsRow = [leftImg, rightContent].map((el) => el || document.createElement('div'));

  // Table structure
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
