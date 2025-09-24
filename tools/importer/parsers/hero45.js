/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero45)'];

  // 2. Background image row (row 2)
  // The image is the first child of the root element
  const img = element.querySelector('img');
  const bgImageRow = [img ? img : ''];

  // 3. Content row (row 3)
  // Find the content container
  let contentCell = [];
  // Find the heading (h2)
  const heading = element.querySelector('h2');
  if (heading) contentCell.push(heading);
  // Find the paragraphs (inside the text editor widget)
  const textWidget = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textWidget) {
    // Push all paragraphs
    const paragraphs = Array.from(textWidget.querySelectorAll('p'));
    contentCell.push(...paragraphs);
  }
  // Find the button (link)
  const button = element.querySelector('.elementor-widget-button a');
  if (button) contentCell.push(button);

  // Defensive: If nothing found, leave cell empty
  if (contentCell.length === 0) contentCell = [''];

  // Compose the table
  const tableCells = [
    headerRow,
    bgImageRow,
    [contentCell],
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  // Replace the original element
  element.replaceWith(block);
}
