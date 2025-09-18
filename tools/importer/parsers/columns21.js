/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two column containers
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // --- Left column ---
  const leftCol = columns[0];
  let leftColCells = [];
  const leftInner = leftCol.querySelector('.e-con-inner');
  if (leftInner) {
    Array.from(leftInner.children).forEach(child => {
      leftColCells.push(child.cloneNode(true));
    });
  }

  // --- Right column ---
  const rightCol = columns[1];
  let rightColCells = [];
  const rightInner = rightCol.querySelector('.e-con-inner');
  if (rightInner) {
    Array.from(rightInner.children).forEach(child => {
      rightColCells.push(child.cloneNode(true));
    });
  }

  // Build columns: each cell should contain one logical block of content
  // For left: icon list and address paragraph are separate blocks
  // For right: each child is a block (usually just one)
  const contentRow = [
    ...leftColCells,
    ...rightColCells
  ];

  // Remove any empty cells
  const filteredRow = contentRow.filter(cell => cell.textContent.trim());
  if (filteredRow.length === 0) return;

  const headerRow = ['Columns (columns21)'];
  const rows = [headerRow, filteredRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
