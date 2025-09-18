/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Background image row (always present, even if empty)
  const imageRow = [''];

  // 3. Content row: Title, Subheading, CTA
  // Find the main content elements
  const inner = element.querySelector('.e-con-inner') || element;
  const children = Array.from(inner.children);

  // Find heading
  let headingEl = null;
  let paragraphEl = null;
  let ctaEl = null;

  children.forEach((child) => {
    // Heading
    if (
      child.classList.contains('elementor-widget-heading') &&
      child.querySelector('h3')
    ) {
      headingEl = child.querySelector('h3');
    }
    // Paragraph
    if (
      child.classList.contains('elementor-widget-text-editor') &&
      child.querySelector('p')
    ) {
      paragraphEl = child.querySelector('p');
    }
    // Button/CTA
    if (child.classList.contains('e-con-full')) {
      // Look for button inside this container
      const button = child.querySelector('.elementor-button-link[href]:not([href="#"])');
      if (button) {
        ctaEl = button;
      }
    }
  });

  // Compose content cell: always an array, even if only one element
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (paragraphEl) contentCell.push(paragraphEl);
  if (ctaEl) contentCell.push(ctaEl);

  // If nothing found, fallback to all content
  if (contentCell.length === 0) {
    contentCell.push(element);
  }

  // Each row must be an array (even if only one cell)
  const cells = [
    headerRow,      // [ 'Hero (hero27)' ]
    imageRow,       // [ '' ]
    [contentCell],  // [ [ ...elements ] ]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
