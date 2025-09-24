/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero47)'];

  // 2. Background image row (none in this HTML, so leave cell empty)
  const backgroundImageRow = [''];

  // 3. Content row: Title, subheading, CTA (all content)
  // Instead of only grabbing h2, grab all visible content blocks inside the main container
  const contentCell = [];
  // Find the main heading (h2)
  const headingWidget = element.querySelector('.elementor-widget-heading');
  if (headingWidget) {
    const title = headingWidget.querySelector('h2');
    if (title) contentCell.push(title.cloneNode(true));
  }

  // Find the form (call-to-action)
  const formWidget = element.querySelector('.elementor-widget-formidable');
  if (formWidget) {
    // Collect all visible form fields and labels as text for context
    const fields = formWidget.querySelectorAll('.frm_form_field, .frm_submit');
    fields.forEach(field => {
      // Only add visible fields (skip display:none)
      if (field.offsetParent !== null) {
        // For checkboxes with privacy link, include the whole label
        const label = field.querySelector('label');
        if (label) {
          contentCell.push(label.cloneNode(true));
        }
        // For selects and inputs, add their placeholder as text
        const input = field.querySelector('input, select, textarea');
        if (input && input.placeholder) {
          const p = document.createElement('div');
          p.textContent = input.placeholder;
          contentCell.push(p);
        }
        // For submit button
        const btn = field.querySelector('button[type="submit"]');
        if (btn) {
          contentCell.push(btn.cloneNode(true));
        }
      }
    });
  }

  // 3rd row: content
  const contentRow = [contentCell];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundImageRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
