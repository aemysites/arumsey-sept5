/* global WebImporter */
export default function parse(element, { document }) {
  // Find the heading (Filtrar por MÊS)
  const heading = element.querySelector('h2');
  // Find all filter buttons (Maio, Novembro, etc.)
  const buttons = Array.from(element.querySelectorAll('button'));

  // Build left cell: heading (keep any bold/inline tags)
  let leftCell = '';
  if (heading) {
    leftCell = heading.cloneNode(true);
  }

  // Build right cell: all filter buttons, space separated
  let rightCell = '';
  if (buttons.length > 0) {
    // Wrap buttons in a div for layout
    const div = document.createElement('div');
    buttons.forEach(btn => div.appendChild(btn.cloneNode(true)));
    rightCell = div;
  }

  const headerRow = ['Columns (columns37)'];
  const dataRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([headerRow, dataRow], document);
  element.replaceWith(table);
}
