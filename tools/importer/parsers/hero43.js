/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero43)'];

  // Find background image (if any)
  let bgImg = '';
  // Try to find an image in the first container
  const firstImg = element.querySelector('img');
  if (firstImg) {
    // Use the image element directly
    bgImg = firstImg;
  }

  // Compose content cell: heading (h2) + paragraphs (p)
  const contentEls = [];
  // Find heading
  const h2 = element.querySelector('h2');
  if (h2) contentEls.push(h2);
  // Find all paragraphs
  const ps = element.querySelectorAll('p');
  ps.forEach(p => contentEls.push(p));

  // Build table rows
  const bgRow = [bgImg ? [bgImg] : ''];
  const contentRow = [contentEls];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
