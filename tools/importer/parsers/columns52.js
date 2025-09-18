/* global WebImporter */
export default function parse(element, { document }) {
  // Find all visible containers (desktop, tablet, mobile)
  const containers = Array.from(element.querySelectorAll('.e-con-inner > .elementor-element'));
  let contentContainer = containers.find(c => !c.className.match(/hidden/));
  if (!contentContainer) contentContainer = containers[0] || element;

  // Find all columns with actual content (each .e-child is a column)
  const columns = Array.from(contentContainer.querySelectorAll('.e-con.e-child'));

  // For each column, collect all widget containers (heading, text, button) in order
  const columnCells = columns.map(col => {
    const cellWrapper = document.createElement('div');
    // Get all widgets inside this column
    const widgets = col.querySelectorAll('.elementor-widget-container');
    widgets.forEach(widget => {
      // Clone all content inside widget (not just heading/para/button)
      Array.from(widget.childNodes).forEach(node => {
        cellWrapper.appendChild(node.cloneNode(true));
      });
    });
    // Only return columns with some content
    if (cellWrapper.childNodes.length) return cellWrapper;
    return null;
  }).filter(cell => cell);

  // Fallback: if no columns found, use the whole element
  if (!columnCells.length) {
    const wrapper = document.createElement('div');
    wrapper.appendChild(element.cloneNode(true));
    columnCells.push(wrapper);
  }

  // If only one column, try to split by major widgets (heading+para+button)
  if (columnCells.length === 1) {
    const widgets = contentContainer.querySelectorAll('.elementor-widget-container');
    if (widgets.length > 1) {
      columnCells.length = 0;
      widgets.forEach(widget => {
        const wrapper = document.createElement('div');
        Array.from(widget.childNodes).forEach(node => {
          wrapper.appendChild(node.cloneNode(true));
        });
        if (wrapper.childNodes.length) columnCells.push(wrapper);
      });
    }
  }

  const headerRow = ['Columns (columns52)'];
  const tableRows = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
