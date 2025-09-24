/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct card containers (each card is a flex child)
  const cardContainers = element.querySelectorAll(':scope > div > div > div');

  // Table header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardContainers.forEach((card) => {
    // Find image (icon) in card
    const imgWidget = card.querySelector('.elementor-widget-image .elementor-widget-container img');
    // Find text in card
    const textWidget = card.querySelector('.elementor-widget-text-editor .elementor-widget-container');

    // Defensive: only add row if both image and text exist
    if (imgWidget && textWidget) {
      rows.push([imgWidget, textWidget]);
    }
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
