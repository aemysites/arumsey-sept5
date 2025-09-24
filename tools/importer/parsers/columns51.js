/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns: left (heading), right (text)
  let leftCol, rightCol;
  const inner = element.querySelector('.e-con-inner');
  if (inner) {
    const children = Array.from(inner.children).filter(el => el.classList.contains('e-child'));
    if (children.length >= 2) {
      leftCol = children[0];
      rightCol = children[1];
    }
  }
  // Fallback if not found
  if (!leftCol || !rightCol) {
    const children = Array.from(element.children).filter(el => el.classList.contains('e-child'));
    if (children.length >= 2) {
      leftCol = children[0];
      rightCol = children[1];
    }
  }

  // Extract heading block (left column)
  let headingBlock = null;
  if (leftCol) {
    const headingContainer = leftCol.querySelector('.elementor-widget-container') || leftCol;
    const heading = headingContainer.querySelector('h2');
    headingBlock = heading ? heading : headingContainer;
  }

  // Extract text block (right column)
  let textBlock = null;
  if (rightCol) {
    const textContainer = rightCol.querySelector('.elementor-widget-container') || rightCol;
    // Collect all paragraphs and preserve their order
    const paragraphs = Array.from(textContainer.querySelectorAll('p'));
    if (paragraphs.length) {
      textBlock = document.createElement('div');
      paragraphs.forEach(p => textBlock.appendChild(p));
    } else {
      textBlock = textContainer;
    }
  }

  // Table header row
  const headerRow = ['Columns (columns51)'];
  // Table content row: leftCol (heading), rightCol (text)
  const contentRow = [headingBlock, textBlock];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
