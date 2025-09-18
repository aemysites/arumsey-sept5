/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero6)'];

  // --- BACKGROUND IMAGE ROW ---
  const bgImg = element.querySelector('img');
  const imageRow = [bgImg ? bgImg : ''];

  // --- CONTENT ROW ---
  // Only include heading and the first paragraph as subheading (if present)
  let contentCell = document.createElement('div');

  // Get heading
  const heading = element.querySelector('.elementor-widget-heading .elementor-widget-container h2');
  if (heading) {
    contentCell.appendChild(heading.cloneNode(true));
  }

  // Get first paragraph from the main green box (subheading)
  const textEditor = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textEditor) {
    const firstP = textEditor.querySelector('p');
    if (firstP) {
      contentCell.appendChild(firstP.cloneNode(true));
    }
  }

  // --- BUILD TABLE ---
  const cells = [
    headerRow,
    imageRow,
    [contentCell],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
