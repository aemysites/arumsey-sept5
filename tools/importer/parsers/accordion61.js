/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion widget
  const accordionWidget = Array.from(element.querySelectorAll('[data-widget_type]'))
    .find(el => el.getAttribute('data-widget_type') && el.getAttribute('data-widget_type').includes('accordion'));
  if (!accordionWidget) return;

  // Find heading and intro content above the accordion
  let headerText = '';
  let introContent = null;
  const widgetEls = Array.from(element.querySelectorAll(':scope > div'));
  for (let i = 0; i < widgetEls.length; i++) {
    const widget = widgetEls[i];
    if (
      widget.getAttribute('data-widget_type') &&
      widget.getAttribute('data-widget_type').includes('heading')
    ) {
      const h2 = widget.querySelector('h2');
      if (h2 && h2.textContent.trim()) {
        headerText = h2.textContent.trim();
      }
    }
    if (
      widget.getAttribute('data-widget_type') &&
      widget.getAttribute('data-widget_type').includes('text-editor')
    ) {
      if (widget.querySelector('.elementor-widget-container')) {
        introContent = widget.querySelector('.elementor-widget-container');
      }
    }
  }

  // Build table rows
  const rows = [];
  const headerRow = ['Accordion (accordion61)'];
  rows.push(headerRow);

  // Only add intro row if BOTH title and content are non-empty
  if (headerText && introContent) {
    rows.push([
      headerText,
      introContent
    ]);
  }

  // Each <details> is an accordion item
  const detailsList = Array.from(accordionWidget.querySelectorAll('details'));
  detailsList.forEach(details => {
    // Title: get summary > ... > h4 or fallback to summary text
    let titleText = '';
    const summary = details.querySelector('summary');
    if (summary) {
      const h4 = summary.querySelector('h4');
      if (h4 && h4.textContent.trim()) {
        titleText = h4.textContent.trim();
      } else {
        // Fallback: get summary text without icons
        const summaryClone = summary.cloneNode(true);
        Array.from(summaryClone.querySelectorAll('.e-n-accordion-item-title-icon')).forEach(icon => icon.remove());
        titleText = summaryClone.textContent.trim();
      }
    }
    // Content: everything inside details except summary
    const contentEls = [];
    Array.from(details.children).forEach(child => {
      if (child !== summary && child.textContent.trim()) {
        contentEls.push(child);
      }
    });
    // Only add row if BOTH title and content are non-empty
    if (titleText && contentEls.length > 0) {
      rows.push([
        titleText,
        contentEls.length === 1 ? contentEls[0] : contentEls
      ]);
    }
  });

  // Remove any rows that have an empty title or empty content (avoid empty/unnecessary rows)
  for (let i = rows.length - 1; i > 0; i--) {
    const row = rows[i];
    if (
      !row[0] || (typeof row[0] === 'string' && !row[0].trim()) ||
      !row[1] || (typeof row[1] === 'string' && !row[1].trim()) || (Array.isArray(row[1]) && row[1].length === 0)
    ) {
      rows.splice(i, 1);
    }
  }

  // If there are no accordion items (i.e., only header row), do not output a table
  if (rows.length <= 1) return;

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
