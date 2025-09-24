/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children only
  const children = Array.from(element.children);

  // 1. Header row
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row (row 2)
  // Look for <img> direct child of the root element
  const bgImg = children.find((el) => el.tagName === 'IMG');
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content row (row 3)
  // Find the content container (should be the first <div> child)
  const contentDiv = children.find((el) => el.tagName === 'DIV');
  let contentCell = '';
  if (contentDiv) {
    // Find heading and paragraph inside contentDiv
    // Heading: look for h1/h2/h3 in any depth
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    // Paragraph: look for <p>
    const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
    // Compose cell content
    const cellContent = [];
    if (heading) cellContent.push(heading);
    paragraphs.forEach(p => cellContent.push(p));
    contentCell = cellContent.length ? cellContent : '';
  }
  const contentRow = [contentCell];

  // Compose table
  const tableCells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
