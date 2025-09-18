/* global WebImporter */
export default function parse(element, { document }) {
  // Only process tab heading blocks
  if (!element.classList.contains('e-n-tabs-heading')) return;

  // Always use the required header row
  const headerRow = ['Tabs (tabs39)'];

  // Get all tab buttons (each represents a tab)
  const tabButtons = Array.from(element.querySelectorAll('button.e-n-tab-title'));

  // Each tab row must have two columns: label and content (content is mandatory, but not present in source, so use placeholder)
  const rows = tabButtons.map((btn) => {
    const labelSpan = btn.querySelector('.e-n-tab-title-text');
    const label = labelSpan ? labelSpan.textContent.trim() : btn.textContent.trim();
    // Since there is no content in the provided HTML, use a non-breaking space to avoid an empty column
    return [label, '\u00A0'];
  });

  // Compose the table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
