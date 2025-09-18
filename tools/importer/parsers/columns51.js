/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns (left and right)
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  const columns = Array.from(inner.children);
  if (columns.length < 2) return;

  // Left column: heading
  const leftCol = columns[0];
  const headingWidget = leftCol.querySelector('.elementor-widget-heading .elementor-widget-container h2');
  // Keep all formatting (strong, br)
  let headingContent = headingWidget ? headingWidget.cloneNode(true) : document.createElement('div');

  // Right column: paragraphs
  const rightCol = columns[1];
  const textWidget = rightCol.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  let rightContent = document.createElement('div');
  if (textWidget) {
    // Copy all paragraphs (preserving line breaks)
    Array.from(textWidget.querySelectorAll('p')).forEach(p => {
      rightContent.appendChild(p.cloneNode(true));
    });
    // Copy any other non-empty child (ignore empty divs)
    Array.from(textWidget.children).forEach(child => {
      if (child.tagName !== 'P' && child.textContent.trim()) {
        rightContent.appendChild(child.cloneNode(true));
      }
    });
  }

  // Table header row
  const headerRow = ['Columns (columns51)'];
  // Table body row: left and right columns
  const bodyRow = [ [headingContent], [rightContent] ];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow.map(cellArr => cellArr[0]) // flatten
  ], document);

  // Replace original element with table
  element.replaceWith(table);
}
