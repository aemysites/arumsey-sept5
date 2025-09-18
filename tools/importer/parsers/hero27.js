/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children
  const children = Array.from(element.querySelectorAll(':scope > .e-con-inner, :scope > div'));

  // Find heading, paragraph, and buttons
  let headingEl, paragraphEl, buttonEl;
  children.forEach((child) => {
    // Heading
    if (!headingEl) {
      headingEl = child.querySelector('h1, h2, h3, h4, h5, h6');
    }
    // Paragraph
    if (!paragraphEl) {
      paragraphEl = child.querySelector('p');
    }
    // Button (first visible)
    if (!buttonEl) {
      const btn = child.querySelector('a[href]:not([href="#"])');
      if (btn) buttonEl = btn;
    }
  });

  // Compose content cell
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (paragraphEl) contentCell.push(paragraphEl);
  if (buttonEl) contentCell.push(buttonEl);

  // Table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = ['']; // No image in source HTML
  const contentRow = [contentCell];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
