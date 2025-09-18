/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Hero (hero14)'];

  // Find the inner content container (the first child div)
  const innerContainer = element.querySelector(':scope > div');

  // Defensive: if no inner container, fallback to the element itself
  const contentRoot = innerContainer || element;

  // Get all direct children of the content root
  const contentChildren = Array.from(contentRoot.children);

  // We'll collect all heading and paragraph content for the 3rd row
  const contentElements = [];

  contentChildren.forEach((child) => {
    // Heading widget
    if (child.classList.contains('elementor-widget-heading')) {
      const heading = child.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) contentElements.push(heading);
    }
    // Text widget
    if (child.classList.contains('elementor-widget-text-editor')) {
      const text = child.querySelector('p, div');
      if (text) contentElements.push(text);
    }
  });

  // Row 2: Background image (optional, none in this HTML)
  const backgroundRow = [''];

  // Row 3: Title, subheading, CTA (all in one cell)
  const contentRow = [contentElements];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
