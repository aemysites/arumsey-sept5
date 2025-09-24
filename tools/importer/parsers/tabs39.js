/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse tab heading blocks
  if (!element.classList.contains('e-n-tabs-heading')) return;

  // Header row as required
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // Get all tab buttons
  const tabButtons = Array.from(element.querySelectorAll('button.e-n-tab-title'));

  // Only add rows for tabs that have a non-empty label
  tabButtons.forEach((btn) => {
    const labelSpan = btn.querySelector('.e-n-tab-title-text');
    let tabLabel = '';
    if (labelSpan) {
      tabLabel = labelSpan.textContent.trim();
    } else {
      tabLabel = btn.textContent.trim();
    }
    if (tabLabel) {
      // Only push the label as a single-column row (no empty content columns)
      rows.push([tabLabel]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
