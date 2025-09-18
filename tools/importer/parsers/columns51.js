/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns: left (heading) and right (text)
  const inner = element.querySelector(':scope > .e-con-inner');
  let leftCol = null;
  let rightCol = null;
  if (inner) {
    const cons = Array.from(inner.children).filter(e => e.classList.contains('e-con'));
    if (cons.length >= 2) {
      [leftCol, rightCol] = cons;
    }
  }
  // Fallback: if structure is different
  if (!leftCol || !rightCol) {
    const cons = Array.from(element.querySelectorAll(':scope > .e-con-inner > .e-con'));
    if (cons.length >= 2) {
      [leftCol, rightCol] = cons;
    } else {
      // fallback: treat all children as one column
      leftCol = element;
      rightCol = null;
    }
  }

  // Helper: extract all content from a node, preserving semantic structure
  function extractContent(node) {
    // If it's a widget-container, use its children
    if (node.classList && node.classList.contains('elementor-widget-container')) {
      return Array.from(node.childNodes);
    }
    // If it's a container with widgets, concatenate them
    const widgets = node.querySelectorAll(':scope > .elementor-widget > .elementor-widget-container');
    if (widgets.length) {
      const arr = [];
      widgets.forEach(w => arr.push(...Array.from(w.childNodes)));
      return arr;
    }
    // Otherwise, just use its children
    return Array.from(node.childNodes);
  }

  // Left column: heading block
  let leftContent = [];
  if (leftCol) {
    leftContent = extractContent(leftCol).filter(n => {
      // Remove empty text nodes and empty divs
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      if (n.nodeType === Node.ELEMENT_NODE) return n.textContent.trim().length > 0;
      return false;
    });
  }

  // Right column: text block
  let rightContent = [];
  if (rightCol) {
    rightContent = extractContent(rightCol).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      if (n.nodeType === Node.ELEMENT_NODE) return n.textContent.trim().length > 0;
      return false;
    });
  }

  // Table header row
  const headerRow = ['Columns (columns51)'];

  // Table body row: two columns
  const row = [
    leftContent.length === 1 ? leftContent[0] : leftContent,
    rightContent.length === 1 ? rightContent[0] : rightContent,
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([headerRow, row], document);

  // Replace the original element
  element.replaceWith(table);
}
