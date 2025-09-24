/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all content from a column container
  function extractColumnContent(container) {
    const fragment = document.createDocumentFragment();
    if (!container) return fragment;
    // Get all direct widgets inside this column
    const widgets = container.querySelectorAll('.elementor-widget');
    widgets.forEach(widget => {
      // Clone the widget container's content
      const widgetContent = widget.querySelector('.elementor-widget-container');
      if (widgetContent) {
        Array.from(widgetContent.childNodes).forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
      }
    });
    return fragment;
  }

  // Find all direct children that are columns (e-child)
  const columns = Array.from(element.children).filter(child =>
    child.classList.contains('e-child')
  );

  // Only use columns that have at least one widget inside
  const validColumns = columns.filter(col => col.querySelector('.elementor-widget'));

  // If no valid columns, fallback to all children
  const usedColumns = validColumns.length > 0 ? validColumns : columns;

  // Build the second row: one cell per column
  const secondRow = usedColumns.map(col => extractColumnContent(col));

  // Compose table
  const headerRow = ['Columns (columns59)'];
  const table = WebImporter.DOMUtils.createTable([headerRow, secondRow], document);
  element.replaceWith(table);
}
