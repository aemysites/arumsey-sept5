/* global WebImporter */
export default function parse(element, { document }) {
  if (!element.classList.contains('e-n-tabs-heading')) return;

  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // Find all tab buttons
  const tabButtons = Array.from(element.querySelectorAll('button.e-n-tab-title'));

  tabButtons.forEach((btn) => {
    const labelSpan = btn.querySelector('.e-n-tab-title-text');
    const tabLabel = labelSpan ? labelSpan.textContent.trim() : '';

    // Find tab content by aria-controls
    let tabContent = '';
    const contentId = btn.getAttribute('aria-controls');
    if (contentId) {
      const contentEl = document.getElementById(contentId);
      if (contentEl) {
        // Use the entire tab content element (not just its text)
        tabContent = contentEl.innerHTML.trim();
      }
    }
    // Always add two columns per row, even if tabContent is empty
    rows.push([tabLabel, tabContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
