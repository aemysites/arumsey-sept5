/* global WebImporter */
export default function parse(element, { document }) {
  // Find the heading text (Filtrar por MÊS)
  const headingEl = element.querySelector('.elementor-widget-heading .elementor-heading-title');
  // Find the filter buttons (Maio, Novembro)
  const filterButtons = Array.from(element.querySelectorAll('search.e-filter button.e-filter-item'));

  // Compose heading cell (preserve <b> if present)
  let headingCell = '';
  if (headingEl) {
    headingCell = headingEl.cloneNode(true);
  }

  // Compose filter cell (all buttons, separated by space)
  let filterCell = '';
  if (filterButtons.length > 0) {
    const frag = document.createElement('div');
    filterButtons.forEach(btn => {
      frag.appendChild(btn.cloneNode(true));
      frag.appendChild(document.createTextNode(' '));
    });
    filterCell = frag;
  }

  // Only include non-empty columns
  const contentRow = [];
  if (headingCell && (headingCell.textContent||'').trim()) contentRow.push(headingCell);
  if (filterCell && (filterCell.textContent||'').trim()) contentRow.push(filterCell);
  if (contentRow.length === 0) return;

  const headerRow = ['Columns (columns37)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
