/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the background image (first <img> direct child)
  const img = element.querySelector(':scope > img');

  // 2. Extract the main heading (first heading inside .elementor-widget-heading)
  let heading = null;
  const headingWidget = element.querySelector('.elementor-widget-heading .elementor-widget-container');
  if (headingWidget) {
    heading = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // 3. Extract the subheading (first <p> inside .elementor-widget-text-editor that is NOT just a label like 'Itens de lazer:')
  let subheading = null;
  const textEditor = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textEditor) {
    // Find all <p> and use the first one that is not a label
    const ps = Array.from(textEditor.querySelectorAll('p'));
    for (const p of ps) {
      const text = p.textContent.trim();
      if (text && !text.endsWith(':')) {
        subheading = p;
        break;
      }
    }
  }

  // 4. Compose content cell for row 3 (only heading and subheading, no technical/accordion details or labels)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);

  // 5. Table structure per block spec
  const headerRow = ['Hero (hero6)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
