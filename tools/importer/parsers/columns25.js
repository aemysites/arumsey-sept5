/* global WebImporter */
export default function parse(element, { document }) {
  // Always use correct header row
  const headerRow = ['Columns (columns25)'];

  // Find all nav menu widgets (not just first two containers)
  const navWidgets = Array.from(element.querySelectorAll('.elementor-widget-nav-menu'));
  if (navWidgets.length === 0) return;

  // For each nav menu, extract the main nav content as a fragment (to preserve structure)
  const columnsRow = navWidgets.map((navWidget) => {
    const widgetContainer = navWidget.querySelector('.elementor-widget-container');
    let navMain = widgetContainer && widgetContainer.querySelector('.elementor-nav-menu--main');
    if (navMain) {
      // Clone the navMain to avoid moving it out of the DOM
      return navMain.cloneNode(true);
    }
    // fallback: include all text content if navMain missing
    if (widgetContainer && widgetContainer.textContent.trim().length > 0) {
      const span = document.createElement('span');
      span.textContent = widgetContainer.textContent.trim();
      return span;
    }
    if (navWidget.textContent.trim().length > 0) {
      const span = document.createElement('span');
      span.textContent = navWidget.textContent.trim();
      return span;
    }
    return null;
  });

  // Remove empty columns
  const filteredColumns = columnsRow.filter(cell => {
    if (!cell) return false;
    if (cell instanceof Element) return cell.textContent.trim().length > 0;
    return false;
  });
  if (filteredColumns.length === 0) return;

  const tableCells = [headerRow, filteredColumns];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
