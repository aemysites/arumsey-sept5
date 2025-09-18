/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row must match the target block name exactly
  const headerRow = ['Hero (hero14)'];

  // 2. Find the background image (first <img> descendant)
  let backgroundImg = element.querySelector('img');

  // 3. Find the content container (the div with heading and paragraph)
  //    In this HTML, it's the first child div after the <img>
  let contentDiv = null;
  const directChildren = Array.from(element.children);
  for (const child of directChildren) {
    if (child.tagName === 'DIV' && child.querySelector('h1, h2, h3, h4, h5, h6')) {
      contentDiv = child;
      break;
    }
  }
  // Fallback: if not found, use the first <div> after <img>
  if (!contentDiv) {
    contentDiv = directChildren.find(el => el.tagName === 'DIV');
  }

  // 4. Extract heading(s) and paragraph(s) from contentDiv
  let contentCell = [];
  if (contentDiv) {
    // Only reference existing elements, do not clone
    const headings = Array.from(contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
    contentCell = [...headings, ...paragraphs];
    // If nothing found, use the whole contentDiv for fallback
    if (contentCell.length === 0) contentCell = [contentDiv];
  } else {
    // Fallback: use all headings and paragraphs in the block
    const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const paragraphs = Array.from(element.querySelectorAll('p'));
    contentCell = [...headings, ...paragraphs];
    if (contentCell.length === 0) contentCell = [element];
  }

  // 5. Build table rows: header, image, content
  const rows = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [contentCell]
  ];

  // 6. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 7. Replace the original element with the new block table
  element.replaceWith(table);
}
