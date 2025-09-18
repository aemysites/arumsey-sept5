/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract label and value from a <p> with <strong>Label:</strong> Value
  function extractLabelValue(p) {
    const strong = p.querySelector('strong');
    if (strong) {
      const label = strong.textContent.replace(/[:：\s]+$/, '').trim();
      // Remove the <strong> from the paragraph to get the value
      const clone = p.cloneNode(true);
      const strongClone = clone.querySelector('strong');
      if (strongClone) strongClone.remove();
      let value = clone.textContent.trim();
      // Remove leading colon and whitespace
      value = value.replace(/^[:：\s]+/, '');
      return [label, value];
    }
    return null;
  }

  // Find the main content container
  let contentDiv = element;
  // Defensive: descend to first .e-con-inner if present
  const inner = element.querySelector('.e-con-inner');
  if (inner) contentDiv = inner;

  // Find the text container
  let textContainer = contentDiv.querySelector('.elementor-widget-container');
  if (!textContainer) textContainer = contentDiv;

  // Gather all <p> and <ul> in order
  const nodes = Array.from(textContainer.childNodes).filter(n => n.nodeType === 1 && (n.tagName === 'P' || n.tagName === 'UL'));

  // Will hold [label, value] pairs for the table
  const rows = [];
  let lastLabel = null;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.tagName === 'P') {
      // Try to extract label/value
      const pair = extractLabelValue(node);
      if (pair) {
        lastLabel = pair[0];
        // Check if the next node is a UL (for tipologia lists)
        if (nodes[i+1] && nodes[i+1].tagName === 'UL') {
          // Compose value as the UL
          rows.push([lastLabel, nodes[i+1]]);
          i++; // skip the UL in next iteration
        } else {
          rows.push(pair);
        }
      } else {
        // If it's a <p> without <strong>, treat as a value for previous label (for notes)
        if (lastLabel && rows.length > 0) {
          // Append this <p> as additional value
          let prev = rows[rows.length-1][1];
          if (typeof prev === 'string') {
            prev = document.createElement('div');
            prev.textContent = rows[rows.length-1][1];
          }
          // Add this <p> as another paragraph
          prev.appendChild(node);
          rows[rows.length-1][1] = prev;
        } else {
          // Otherwise, skip (should not happen)
        }
      }
    } else if (node.tagName === 'UL') {
      // If a UL follows a label, it was handled above
      // Otherwise, skip
    }
  }

  // Table header row
  const headerRow = ['Table (striped, bordered, tableStripedBordered42)'];
  // Table column header row
  const columnHeaderRow = ['Label', 'Value'];

  // Compose the table data
  const tableData = [headerRow, columnHeaderRow];
  rows.forEach(([label, value]) => {
    tableData.push([label, value]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
