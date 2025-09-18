/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two column containers (left and right)
  const inner = element.querySelector(':scope > .e-con-inner');
  if (!inner) return;
  const columns = Array.from(inner.children);
  if (columns.length < 2) return; // Defensive: must have at least two columns

  // LEFT COLUMN
  const leftCol = columns[0];
  // Instead of targeting only .e-con-inner, collect all content
  let leftCell = [];
  // Get all widgets inside leftCol
  const leftWidgets = leftCol.querySelectorAll('.elementor-widget');
  leftWidgets.forEach(widget => {
    const container = widget.querySelector('.elementor-widget-container');
    if (container) {
      // If it's an icon list, include the whole list element
      const iconList = container.querySelector('.elementor-icon-list-items');
      if (iconList) {
        leftCell.push(iconList.cloneNode(true));
        return;
      }
      // If it's a paragraph, include the paragraph
      const p = container.querySelector('p');
      if (p) {
        leftCell.push(p.cloneNode(true));
        return;
      }
    }
  });

  // RIGHT COLUMN
  const rightCol = columns[1];
  let rightCell = [];
  // Get all widgets inside rightCol
  const rightWidgets = rightCol.querySelectorAll('.elementor-widget');
  rightWidgets.forEach(widget => {
    const container = widget.querySelector('.elementor-widget-container');
    if (container) {
      // If it's a list, include the whole ul
      const ul = container.querySelector('ul');
      if (ul) {
        rightCell.push(ul.cloneNode(true));
        return;
      }
    }
  });

  // Build the "Columns (columns21)" table
  const headerRow = ['Columns (columns21)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
