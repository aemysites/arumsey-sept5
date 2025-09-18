/* global WebImporter */
export default function parse(element, { document }) {
  // Always output a columns block with the correct header and one empty cell per column, even if all columns are empty
  if (!element.previousElementSibling || !element.previousElementSibling.classList.contains('elementor-element')) {
    // Gather all consecutive .elementor-element siblings
    const columns = [];
    let el = element;
    while (el && el.classList && el.classList.contains('elementor-element')) {
      columns.push(el);
      el = el.nextElementSibling;
    }
    const headerRow = ['Columns (columns23)'];
    // For each column, extract its .e-con-inner content as a cell (empty string if no content)
    const contentRow = columns.map(col => {
      const inner = col.querySelector('.e-con-inner');
      if (inner && inner.childNodes.length > 0) {
        const frag = document.createDocumentFragment();
        Array.from(inner.childNodes).forEach(node => frag.appendChild(node.cloneNode(true)));
        return frag;
      }
      return '';
    });
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      contentRow,
    ], document);
    columns[0].replaceWith(table);
    // Remove the rest
    for (let i = 1; i < columns.length; i++) {
      columns[i].remove();
    }
  } else {
    // Not the first in the sequence; handled above
    element.remove();
  }
}
