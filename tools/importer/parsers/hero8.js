/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first image for background
  const bgImg = element.querySelector('img');

  // Find the main heading (h2)
  const heading = element.querySelector('.elementor-widget-heading .elementor-widget-container h2');

  // Find subheading and paragraph (from the text editor)
  const textEditor = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  let subheading = null;
  let paragraph = null;
  if (textEditor) {
    // Find first <p> as subheading, second <p> as paragraph (if present)
    const ps = textEditor.querySelectorAll('p');
    if (ps.length > 0) subheading = ps[0].cloneNode(true);
    if (ps.length > 1) paragraph = ps[1].cloneNode(true);
  }

  // Compose the content cell: heading, subheading, paragraph
  const contentCell = [];
  if (heading) contentCell.push(heading.cloneNode(true));
  if (subheading) contentCell.push(subheading);
  if (paragraph) contentCell.push(paragraph);

  // Table rows
  const headerRow = ['Hero (hero8)'];
  const bgRow = [bgImg ? bgImg.cloneNode(true) : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
