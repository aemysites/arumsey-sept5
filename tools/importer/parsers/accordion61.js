/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion widget container
  const accordionWidget = element.querySelector('.elementor-widget-n-accordion .e-n-accordion');
  if (!accordionWidget) return;

  // Header row as required
  const headerRow = ['Accordion (accordion61)'];
  const rows = [headerRow];

  // Find all accordion items (details elements)
  const detailsList = accordionWidget.querySelectorAll('details');
  detailsList.forEach((details) => {
    // Title cell: get all visible text from summary (excluding icons)
    let titleCell = '';
    const summary = details.querySelector('summary');
    if (summary) {
      const summaryClone = summary.cloneNode(true);
      // Remove icon markup
      Array.from(summaryClone.querySelectorAll('.e-n-accordion-item-title-icon')).forEach(icon => icon.remove());
      titleCell = summaryClone.textContent.trim();
    }
    // Content cell: get all content inside details except summary
    let contentCell = '';
    // Get all nodes after summary
    const children = Array.from(details.childNodes);
    const summaryIdx = children.indexOf(summary);
    let contentNodes = [];
    if (summaryIdx !== -1) {
      contentNodes = children.slice(summaryIdx + 1);
    } else {
      // fallback: all except summary
      contentNodes = children.filter(node => node !== summary);
    }
    if (contentNodes.length) {
      const wrapper = document.createElement('div');
      contentNodes.forEach(node => {
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
          wrapper.appendChild(node.cloneNode(true));
        }
      });
      contentCell = wrapper;
    }
    // Add row if either cell has content (allow empty title, but not both empty)
    if (titleCell || contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Replace the original element with the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
