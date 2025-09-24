/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate children of the element (should be 3 columns for this block)
  const children = Array.from(element.children);

  // If there are no children, do not modify the DOM
  if (children.length === 0) return;

  // Each column cell should contain the full content of the child div
  const columnsRow = children.map((col) => {
    // If the column is not empty, clone its contents into a fragment
    const fragment = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => fragment.appendChild(node.cloneNode(true)));
    // If fragment is empty, fallback to textContent
    if (!fragment.childNodes.length && col.textContent.trim()) {
      fragment.appendChild(document.createTextNode(col.textContent.trim()));
    }
    return fragment.childNodes.length ? fragment : '';
  });

  // Header row must match target block name exactly
  const headerRow = ['Columns (columns23)'];

  // Compose table rows
  const rows = [headerRow, columnsRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block table
  element.replaceWith(block);
}
