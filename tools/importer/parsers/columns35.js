/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children (not descendants)
  const children = Array.from(element.children);

  // Find the image (left column)
  const img = children.find((child) => child.tagName === 'IMG');

  // Find the right column container (contains heading)
  const rightCol = children.find((child) =>
    child.classList.contains('elementor-element-46aa54bd')
  );

  let headingContent = null;
  if (rightCol) {
    // Find the heading widget inside rightCol
    const headingWidget = Array.from(rightCol.children).find((c) =>
      c.classList.contains('elementor-widget-heading')
    );
    if (headingWidget) {
      // The actual heading is inside .elementor-widget-container
      const container = headingWidget.querySelector('.elementor-widget-container');
      if (container) {
        headingContent = container;
      }
    }
  }

  // Defensive: fallback if not found
  const leftCell = img || '';
  const rightCell = headingContent || '';

  // Build table rows
  const headerRow = ['Columns (columns35)'];
  const contentRow = [leftCell, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
