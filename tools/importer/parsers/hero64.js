/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner content container
  const innerDiv = element.querySelector('.e-con-inner');

  // --- Background Image (row 2) ---
  // Use the decorative SVG image as the background image
  let bgImg = element.querySelector('img[src*="personalizacao-secao-video-bg.svg"]');

  // --- Content (row 3) ---
  const contentCell = [];

  // 1. Heading (h2)
  const heading = innerDiv && innerDiv.querySelector('h2');
  if (heading) contentCell.push(heading);

  // 2. First paragraph (subheading)
  const textEditors = innerDiv ? innerDiv.querySelectorAll('.elementor-widget-text-editor p') : [];
  if (textEditors[0]) contentCell.push(textEditors[0]);

  // 3. Second paragraph (below video)
  if (textEditors[1]) contentCell.push(textEditors[1]);

  // 4. Button (call-to-action)
  const button = innerDiv && innerDiv.querySelector('a.elementor-button');
  if (button) contentCell.push(button);

  // 5. Disclaimer (last paragraph)
  if (textEditors[2]) contentCell.push(textEditors[2]);

  // --- Table Construction ---
  const headerRow = ['Hero (hero64)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
