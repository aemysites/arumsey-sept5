/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract label and value from a <p> or <li> element
  function extractLabelValue(node) {
    if (!node) return ['', ''];
    // Try to split by <strong> or by colon
    let label = '';
    let value = '';
    // If the node contains a <strong>
    const strong = node.querySelector('strong');
    if (strong) {
      label = strong.textContent.trim().replace(/[:：]$/, '');
      value = node.textContent.replace(strong.textContent, '').trim();
      value = value.replace(/^[:：]?\s*/, ''); // Remove leading colon/space
    } else {
      // Try to split by colon
      const txt = node.textContent;
      const parts = txt.split(/[:：]/);
      if (parts.length > 1) {
        label = parts[0].trim();
        value = parts.slice(1).join(':').trim();
      } else {
        label = '';
        value = txt.trim();
      }
    }
    return [label, value];
  }

  // Find the deepest content container
  let contentDiv = element;
  // Defensive: find the first .elementor-widget-container inside
  const widgetContainer = element.querySelector('.elementor-widget-container');
  if (widgetContainer) {
    contentDiv = widgetContainer;
  }

  // Get all direct children
  const children = Array.from(contentDiv.childNodes).filter(
    (node) => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
  );

  // Prepare header row
  const headerRow = ['Table (striped, bordered, tableStripedBordered42)'];

  // We'll build rows as [label, value]
  const rows = [];

  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.nodeType === 1 && node.tagName === 'P') {
      // Check if next sibling is a UL (for grouped items)
      const next = children[i + 1];
      if (next && next.nodeType === 1 && next.tagName === 'UL') {
        // This <p> is a label for the list
        const label = node.textContent.replace(/[:：]$/, '').trim();
        // Each <li> is a value
        const lis = Array.from(next.querySelectorAll('li'));
        lis.forEach((li) => {
          // Try to split label/value in li
          const [liLabel, liValue] = extractLabelValue(li);
          if (liLabel) {
            rows.push([liLabel, liValue]);
          } else {
            rows.push([label, li.textContent.trim()]);
          }
        });
        i += 2;
        continue;
      }
      // Otherwise, regular <p>
      const [label, value] = extractLabelValue(node);
      if (label || value) {
        rows.push([label, value]);
      }
      i++;
      continue;
    }
    // If it's a <ul> not preceded by a <p>
    if (node.nodeType === 1 && node.tagName === 'UL') {
      const lis = Array.from(node.querySelectorAll('li'));
      lis.forEach((li) => {
        const [liLabel, liValue] = extractLabelValue(li);
        if (liLabel) {
          rows.push([liLabel, liValue]);
        } else {
          rows.push(['', li.textContent.trim()]);
        }
      });
      i++;
      continue;
    }
    // If it's a text node (e.g., note)
    if (node.nodeType === 3) {
      const txt = node.textContent.trim();
      if (txt) {
        rows.push(['', txt]);
      }
      i++;
      continue;
    }
    i++;
  }

  // Build the table data
  const tableData = [headerRow];
  // Add a header row for the columns
  tableData.push(['Label', 'Value']);
  // Add all rows
  rows.forEach(([label, value]) => {
    tableData.push([label, value]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
