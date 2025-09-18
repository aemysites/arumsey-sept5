/* global WebImporter */
export default function parse(element, { document }) {
  // Get all column containers (each column is a child e-con-boxed container)
  const columnContainers = Array.from(element.querySelectorAll(':scope > .e-con-inner > .elementor-element'));

  // Defensive fallback: if e-con-inner is missing, get direct children
  const columns = columnContainers.length > 0 ? columnContainers : Array.from(element.children);

  // Only include columns with actual content (image or heading)
  const cells = columns
    .map(col => {
      const inner = col.querySelector(':scope > .e-con-inner') || col;
      const imgWidget = inner.querySelector('.elementor-widget-image img');
      const headingWidget = inner.querySelector('.elementor-widget-heading .elementor-widget-container');
      if (!imgWidget && !headingWidget) return null; // skip empty columns
      const fragment = document.createDocumentFragment();
      if (imgWidget) fragment.appendChild(imgWidget);
      if (headingWidget) {
        headingWidget.querySelectorAll('strong').forEach(strong => {
          if (!strong.textContent.trim()) strong.remove();
        });
        fragment.appendChild(headingWidget);
      }
      return fragment;
    })
    .filter(cell => cell); // remove nulls (empty columns)

  const tableRows = [
    ['Columns (columns63)'],
    cells
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
