/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero33)'];

  // --- BACKGROUND IMAGE ROW ---
  // Find image in any child (background image is optional)
  let imageEl = null;
  for (const child of children) {
    // Look for <img> in descendants
    imageEl = child.querySelector('img');
    if (imageEl) break;
  }
  // If no image found, leave cell empty
  const imageRow = [imageEl ? imageEl : ''];

  // --- CONTENT ROW ---
  // Find heading and paragraph content
  let headingEl = null;
  let paragraphEl = null;
  for (const child of children) {
    // Heading (h1, h2, etc)
    if (!headingEl) {
      headingEl = child.querySelector('h1, h2, h3, h4, h5, h6');
    }
    // Paragraph
    if (!paragraphEl) {
      paragraphEl = child.querySelector('p');
    }
  }
  // Compose content cell
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (paragraphEl) contentCell.push(paragraphEl);
  const contentRow = [contentCell.length ? contentCell : ''];

  // --- TABLE ASSEMBLY ---
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
