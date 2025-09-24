/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract label and value from <p> tags
  function extractLabelValue(p) {
    // Try to split by <strong> and remaining text
    const strong = p.querySelector('strong');
    if (strong) {
      const label = strong.textContent.replace(/[:\s]+$/, '');
      // Remove strong from p
      const value = p.textContent.replace(strong.textContent, '').replace(/^[:\s]+/, '');
      return [label, value];
    }
    // If no strong, try splitting by ':'
    const txt = p.textContent;
    const idx = txt.indexOf(':');
    if (idx !== -1) {
      const label = txt.slice(0, idx).trim();
      const value = txt.slice(idx + 1).trim();
      return [label, value];
    }
    return [txt.trim(), ''];
  }

  // Find the innermost content container
  let inner = element;
  // Defensive: find the first .e-con-inner
  const innerDiv = element.querySelector('.e-con-inner');
  if (innerDiv) inner = innerDiv;

  // Find all paragraphs and lists
  const ps = Array.from(inner.querySelectorAll('p'));
  const uls = Array.from(inner.querySelectorAll('ul'));

  // Build rows for the table
  const rows = [];

  // Header row (block name)
  const headerRow = ['Table (striped, bordered, tableStripedBordered42)'];
  rows.push(headerRow);

  // We'll collect label/value pairs
  // If a <p> is immediately followed by a <ul>, treat as a grouped label/value
  let i = 0;
  while (i < ps.length) {
    const p = ps[i];
    const [label, value] = extractLabelValue(p);
    // Check if next sibling is a <ul>
    let ul = null;
    if (i + 1 < ps.length && ps[i + 1].previousElementSibling === p && ps[i + 1].tagName === 'UL') {
      ul = ps[i + 1];
    } else {
      // Sometimes the <ul> is not in ps, but in inner.children
      const nextSibling = p.nextElementSibling;
      if (nextSibling && nextSibling.tagName === 'UL') {
        ul = nextSibling;
      }
    }
    if (ul) {
      // Group label with list
      const cellLabel = document.createElement('strong');
      cellLabel.textContent = label;
      rows.push([
        cellLabel,
        ul
      ]);
      // Skip the <ul> in ps (if present)
      // Find index of ul in ps
      const ulIdx = ps.indexOf(ul);
      if (ulIdx !== -1) {
        i = ulIdx + 1;
      } else {
        i++;
      }
      continue;
    }
    // If value is not empty, normal label/value row
    if (value) {
      rows.push([
        label,
        value
      ]);
    } else {
      // If label only, put in first column, leave second blank
      rows.push([
        label,
        ''
      ]);
    }
    i++;
  }

  // Defensive: also check for any <ul> not already included
  for (const ul of uls) {
    // If not already in rows
    if (!rows.some(row => row.includes(ul))) {
      rows.push(['', ul]);
    }
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
