/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main containers inside .e-con-inner
  const inner = element.querySelector('.e-con-inner');
  const mainContainers = inner ? inner.querySelectorAll(':scope > div') : element.querySelectorAll(':scope > div');

  // --- Row 2: Background image (should be only background image if present) ---
  // There is no background image <img> in the HTML, so leave empty
  const backgroundRow = [''];

  // --- Row 3: Content (logo, tagline, heading, paragraph) ---
  // Only non-background content goes here
  const contentEls = [];

  // Left column: logo and tagline
  if (mainContainers[0]) {
    // Tagline (first <p> in left column)
    const tagline = mainContainers[0].querySelector('p');
    if (tagline && tagline.textContent.trim()) contentEls.push(tagline);
  }

  // Right column: heading and paragraph
  if (mainContainers[1]) {
    const heading = mainContainers[1].querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentEls.push(heading);
    // Paragraph (first <p> in right column)
    const para = mainContainers[1].querySelector('p');
    if (para && para.textContent.trim()) contentEls.push(para);
  }

  // Compose the table rows
  const headerRow = ['Hero (hero56)'];
  const contentRow = [contentEls];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
