/* global WebImporter */
export default function parse(element, { document }) {
  // Find the heading (title)
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');

  // Find all subheadings and paragraphs under the heading
  let contentNodes = [];
  if (heading) {
    contentNodes.push(heading.cloneNode(true));
    // Find all siblings after heading that are h3-h6, p, or button/a
    let next = heading.parentElement;
    if (next) {
      // Get all elements after heading in the widget container
      const widgetContainer = next.closest('.elementor-widget-container');
      if (widgetContainer) {
        let parent = widgetContainer.parentElement;
        if (parent) {
          // Find all form fields, labels, buttons, etc.
          const form = parent.querySelector('form');
          if (form) {
            // Collect all visible labels, inputs (as text), buttons, and privacy text
            const labels = form.querySelectorAll('label');
            labels.forEach(label => {
              // Only visible labels
              if (label.offsetParent !== null && label.textContent.trim()) {
                contentNodes.push(document.createElement('p'));
                contentNodes[contentNodes.length-1].textContent = label.textContent.trim();
              }
            });
            // Find the submit button
            const button = form.querySelector('button');
            if (button) {
              contentNodes.push(button.cloneNode(true));
            }
            // Find the privacy text (checkbox label)
            const privacyLabel = form.querySelector('label[for^="field_form-home-aceite-termos"]');
            if (privacyLabel && privacyLabel.textContent.trim()) {
              contentNodes.push(document.createElement('p'));
              contentNodes[contentNodes.length-1].textContent = privacyLabel.textContent.trim();
            }
            // Also, add the checkbox label with link if present
            const checkboxLabel = form.querySelector('#frm_checkbox_592-0 label');
            if (checkboxLabel) {
              contentNodes.push(checkboxLabel.cloneNode(true));
            }
          }
        }
      }
    }
  }

  // Compose rows
  const headerRow = ['Hero (hero55)'];
  const imageRow = ['']; // No background image in this HTML
  const contentRow = [contentNodes.length ? contentNodes : ''];
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
