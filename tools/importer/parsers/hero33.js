/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero33)'];

  // 2. Background image row (always present, empty if no image)
  let backgroundImageCell = '';
  const img = element.querySelector('img');
  if (img) {
    backgroundImageCell = img;
  } else {
    // Check for inline style background-image
    const bgDiv = Array.from(element.querySelectorAll('div')).find(div => {
      const style = div.getAttribute('style') || '';
      return /background-image\s*:\s*url\(/.test(style);
    });
    if (bgDiv) backgroundImageCell = bgDiv;
  }

  // 3. Content row: Title (Heading), Subheading (optional), CTA (optional)
  let contentCell = [];
  const children = element.querySelectorAll(':scope > div');
  if (children.length > 1) {
    const contentDiv = children[1];
    // Clean heading
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentCell.push(heading.cloneNode(true));
    // Clean paragraph
    const paragraph = contentDiv.querySelector('p');
    if (paragraph) {
      // Remove all spans from paragraph
      const cleanPara = paragraph.cloneNode(true);
      Array.from(cleanPara.querySelectorAll('span')).forEach(span => {
        span.replaceWith(document.createTextNode(span.textContent));
      });
      contentCell.push(cleanPara);
    }
    // CTA (link)
    const cta = contentDiv.querySelector('a');
    if (cta) contentCell.push(cta.cloneNode(true));
  }

  // Always include three rows: header, background image (may be empty), content
  const rows = [
    headerRow,
    [backgroundImageCell],
    [contentCell],
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
