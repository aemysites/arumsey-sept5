/* global WebImporter */
export default function parse(element, { document }) {
  // Find the right column containing the heading
  const rightCol = Array.from(element.children).find(el => el.querySelector('.elementor-widget-heading'));

  let headingContent = '';
  if (rightCol) {
    const headingWidget = rightCol.querySelector('.elementor-widget-heading .elementor-widget-container');
    if (headingWidget && headingWidget.firstElementChild) {
      headingContent = headingWidget.firstElementChild.cloneNode(true);
    }
  }

  // Compose table: header row (one column), content row (one column)
  const headerRow = ['Columns (columns35)'];
  const contentRow = [headingContent || ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
