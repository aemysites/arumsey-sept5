/* global WebImporter */
export default function parse(element, { document }) {
  // Table (no header, tableNoHeader28)
  // Get the text editor container (the only child div)
  const textWidget = element.querySelector('.elementor-widget-container');
  if (!textWidget) return;

  // Get all direct <p> children (each is a row: label + value)
  const ps = Array.from(textWidget.querySelectorAll('p'));

  // Each row will have two columns: label and value
  const rows = ps.map((p) => {
    // Defensive: try to split by <strong> for label
    const strong = p.querySelector('strong');
    let label = '';
    let value = '';
    if (strong) {
      label = strong.textContent.replace(/[:\s\u00A0]+$/, ''); // Remove trailing colon/space
      // Remove the <strong> from the <p> to get the value
      const clone = p.cloneNode(true);
      const strongClone = clone.querySelector('strong');
      if (strongClone) strongClone.remove();
      value = clone.textContent.trim();
      // Remove any leading colon or whitespace
      value = value.replace(/^[:\s\u00A0]+/, '');
    } else {
      // Fallback: try to split by colon
      const parts = p.textContent.split(':');
      if (parts.length > 1) {
        label = parts[0].trim();
        value = parts.slice(1).join(':').trim();
      } else {
        label = p.textContent.trim();
        value = '';
      }
    }
    return [label, value];
  });

  const headerRow = ['Table (no header, tableNoHeader28)'];
  const tableRows = rows.map(([label, value]) => [label, value]);
  const cells = [headerRow, ...tableRows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
