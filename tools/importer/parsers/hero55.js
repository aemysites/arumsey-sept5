/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create header row
  const headerRow = ['Hero (hero55)'];

  // 2. Background image row (none in this case)
  const backgroundImageRow = [''];

  // 3. Compose content row: extract all visible text content from heading and form
  let contentCell = [];
  const headingWidget = element.querySelector('.elementor-widget-heading h2');
  if (headingWidget) {
    contentCell.push(headingWidget.cloneNode(true));
  }
  const formWidget = element.querySelector('.elementor-widget-formidable form');
  if (formWidget) {
    // Get all visible labels
    const labels = formWidget.querySelectorAll('label');
    labels.forEach(label => {
      if (label.offsetParent !== null && label.textContent.trim()) {
        contentCell.push(label.cloneNode(true));
      }
    });
    // Get all visible input placeholders
    const inputs = formWidget.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (input.offsetParent !== null && input.placeholder && input.placeholder.trim()) {
        const span = document.createElement('span');
        span.textContent = input.placeholder;
        contentCell.push(span);
      }
    });
    // Get the submit button and convert to a link (CTA should be text with a link)
    const submitBtn = formWidget.querySelector('button[type="submit"]');
    if (submitBtn) {
      const ctaLink = document.createElement('a');
      ctaLink.href = '#';
      ctaLink.textContent = submitBtn.textContent;
      contentCell.push(ctaLink);
    }
  }
  const contentRow = [contentCell];

  // 4. Build the table with 3 rows (header, background image, content)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundImageRow,
    contentRow,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
