/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Hero (hero48)'];

  // Row 2: Background image (get from the first img in the element, if present)
  let backgroundImage = '';
  const img = element.querySelector('img');
  if (img && img.src) {
    backgroundImage = img.src;
  }
  const backgroundImageRow = [backgroundImage];

  // Row 3: Title (heading), subheading, CTA (if present)
  // Find the main heading (usually h2)
  const headingContainer = element.querySelector('.elementor-element-a322ba1') || element;
  const heading = headingContainer.querySelector('h2, h1, h3, h4, h5, h6');

  // Collect all consecutive <p> after heading for subheading/body
  let contentRowNodes = [];
  if (heading) {
    contentRowNodes.push(heading.cloneNode(true));
    let next = heading.nextElementSibling;
    // Only add consecutive <p> after heading (subheading/body)
    while (next && next.tagName === 'P') {
      contentRowNodes.push(next.cloneNode(true));
      next = next.nextElementSibling;
    }
  } else {
    // If no heading, include all <p> in container
    const paragraphs = headingContainer.querySelectorAll('p');
    paragraphs.forEach(p => contentRowNodes.push(p.cloneNode(true)));
  }

  // Find CTA (first <a> in headingContainer)
  const cta = headingContainer.querySelector('a');
  if (cta) {
    contentRowNodes.push(cta.cloneNode(true));
  }

  // If still empty, fallback to empty string
  const contentRow = [contentRowNodes.length > 0 ? contentRowNodes : ''];

  // Compose the table rows (always 3 rows: header, background image, content)
  const rows = [headerRow];
  rows.push(backgroundImageRow);
  rows.push(contentRow);

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
