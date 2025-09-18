/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero8)'];

  // Row 2: Background Image (optional, always present as a row)
  let backgroundImg = element.querySelector('img');
  const imageRow = [backgroundImg ? backgroundImg : ''];

  // Row 3: Title, Subheading, CTA (headline and summary only)
  const contentElements = [];

  // Get the main heading (FICHA TÉCNICA)
  const headingWidget = element.querySelector('[data-widget_type="heading.default"]');
  if (headingWidget) {
    const heading = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentElements.push(heading.cloneNode(true));
  }

  // Get only the first text-editor widget after the heading (for subheading/summary)
  const textEditorWidgets = element.querySelectorAll('[data-widget_type="text-editor.default"]');
  for (const widget of textEditorWidgets) {
    const firstParagraph = widget.querySelector('p');
    if (firstParagraph && firstParagraph.textContent.trim().length > 0) {
      contentElements.push(firstParagraph.cloneNode(true));
      break;
    }
  }

  // Always output 3 rows: header, image (may be empty), content
  const cells = [headerRow, imageRow, [contentElements.length ? contentElements : '']];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
