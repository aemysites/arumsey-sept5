/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the first image (background/decorative)
  const img = element.querySelector('img');

  // Extract the main content container
  const inner = element.querySelector('.e-con-inner');

  // Initialize content variables
  let heading = null;
  let paragraphs = [];
  let button = null;

  if (inner) {
    // Find heading (first h1-h6)
    const headingEl = inner.querySelector('h1, h2, h3, h4, h5, h6');
    if (headingEl) heading = headingEl;

    // Find all paragraphs
    const pEls = inner.querySelectorAll('p');
    if (pEls.length) paragraphs = Array.from(pEls);

    // Find button (first <a> inside .elementor-button)
    const btnEl = inner.querySelector('.elementor-button-link');
    if (btnEl) button = btnEl;
  }

  // Compose the content cell for row 3
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (paragraphs.length) contentCell.push(...paragraphs);
  if (button) contentCell.push(button);

  // Build the table rows
  const headerRow = ['Hero (hero45)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
