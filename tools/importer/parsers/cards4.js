/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct card containers
  const cardContainers = Array.from(element.querySelectorAll(':scope > div > div > div.e-con-full.e-child'));

  // Header row as per block spec
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardContainers.forEach((card) => {
    // Find image: first .elementor-widget-image img in this card
    const img = card.querySelector('.elementor-widget-image img');
    // Find text: first .elementor-widget-text-editor .elementor-widget-container in this card
    const text = card.querySelector('.elementor-widget-text-editor .elementor-widget-container');

    // Only add row if both image and text exist
    if (img && text) {
      rows.push([img, text]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
