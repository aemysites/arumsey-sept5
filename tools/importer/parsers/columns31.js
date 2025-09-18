/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child containers (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const leftInner = columns[0].querySelector('.e-con-inner') || columns[0];
  // Collect all widgets in left column
  const leftCellContent = [];
  Array.from(leftInner.children).forEach(widget => {
    // Clone all direct children of each widget container
    Array.from(widget.children).forEach(child => {
      if (child.textContent.trim() || child.querySelector('*')) {
        leftCellContent.push(child.cloneNode(true));
      }
    });
  });

  // --- RIGHT COLUMN ---
  const rightInner = columns[1].querySelector('.e-con-inner') || columns[1];
  // Collect all widgets in right column
  const rightCellContent = [];
  Array.from(rightInner.children).forEach(widget => {
    Array.from(widget.children).forEach(child => {
      if (child.textContent.trim() || child.querySelector('*')) {
        rightCellContent.push(child.cloneNode(true));
      }
    });
  });

  // Only include columns with actual content
  const contentRow = [];
  if (leftCellContent.length) contentRow.push(leftCellContent);
  if (rightCellContent.length) contentRow.push(rightCellContent);
  if (contentRow.length < 1) return;

  // Table header
  const headerRow = ['Columns (columns31)'];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
