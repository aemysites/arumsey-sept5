/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Hero (hero45)'];

  // 2. Background image row (none in this HTML)
  // The source HTML does not contain an <img> or background image element, so leave this cell empty
  const bgRow = [''];

  // 3. Content row: Title, Subheading, CTA
  // The content is inside the second inner container
  const inner = element.querySelector('.e-con-inner');
  let contentContainer = null;
  if (inner) {
    // Find the container with the heading and text
    contentContainer = Array.from(inner.children).find(child =>
      child.querySelector('.elementor-widget-heading')
    );
  }

  let contentElements = [];
  if (contentContainer) {
    // Heading
    const headingWidget = contentContainer.querySelector('.elementor-widget-heading .elementor-heading-title');
    if (headingWidget) contentElements.push(headingWidget);

    // Paragraphs
    const textWidget = contentContainer.querySelector('.elementor-widget-text-editor .elementor-widget-container');
    if (textWidget) {
      // Add all paragraphs
      contentElements.push(...textWidget.querySelectorAll('p'));
    }

    // Button (CTA)
    const buttonWidget = contentContainer.querySelector('.elementor-widget-button .elementor-button');
    if (buttonWidget) contentElements.push(buttonWidget);
  }

  // Defensive: if nothing found, fallback to all text content
  if (contentElements.length === 0) {
    contentElements = [element.textContent.trim()];
  }

  const contentRow = [contentElements];

  // Compose table
  const rows = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
