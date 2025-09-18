/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner container
  const inner = element.querySelector('.e-con-inner');
  if (!inner) {
    // Defensive: fallback to element itself
    return;
  }

  // Find the two main child containers
  const childContainers = inner.querySelectorAll(':scope > .e-con.e-child');

  // Defensive: must have at least text and image blocks
  let heading = null;
  let paragraph = null;
  let image = null;

  childContainers.forEach((container) => {
    // Heading block
    const h2 = container.querySelector('h2');
    if (h2 && !heading) heading = h2;
    // Paragraph block
    const p = container.querySelector('p');
    if (p && !paragraph) paragraph = p;
    // Image block
    const img = container.querySelector('img');
    if (img && !image) image = img;
  });

  // Compose table rows
  const headerRow = ['Hero (hero10)'];
  const imageRow = [image ? image : ''];

  // Compose content cell: heading (as heading), paragraph (as paragraph)
  let contentCell = '';
  if (heading || paragraph) {
    const contentDiv = document.createElement('div');
    if (heading) contentDiv.appendChild(heading);
    if (paragraph) contentDiv.appendChild(paragraph);
    contentCell = contentDiv;
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    [contentCell],
  ], document);

  element.replaceWith(table);
}
