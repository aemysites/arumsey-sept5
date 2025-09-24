/* global WebImporter */
export default function parse(element, { document }) {
  // Find logo image (not background image)
  const logoImg = element.querySelector('img');
  let subtitle = null;
  const logoTextWidget = element.querySelector('.elementor-element-270b4532 .elementor-widget-container');
  if (logoTextWidget) {
    subtitle = logoTextWidget.querySelector('p');
  }

  // Find heading and paragraph
  let heading = null;
  let paragraph = null;
  const headingWidget = element.querySelector('.elementor-element-41cfebff .elementor-widget-container');
  if (headingWidget) {
    heading = headingWidget.querySelector('h2');
  }
  const paraWidget = element.querySelector('.elementor-element-2ff5e804 .elementor-widget-container');
  if (paraWidget) {
    paragraph = paraWidget.querySelector('p');
  }

  // Table rows
  const headerRow = ['Hero (hero56)'];
  // Place logo image in background image row if present, otherwise empty
  const imageRow = [logoImg ? logoImg : ''];
  // Only text content in content row
  const contentCell = [];
  if (subtitle) contentCell.push(subtitle);
  if (heading) contentCell.push(heading);
  if (paragraph) contentCell.push(paragraph);
  const contentRow = [contentCell];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
