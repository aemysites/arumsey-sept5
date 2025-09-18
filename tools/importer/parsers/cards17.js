/* global WebImporter */
export default function parse(element, { document }) {
  // Find all cards
  const cards = element.querySelectorAll('[data-elementor-type="loop-item"]');

  // Table header: block name and variant
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Find the main image inside card
    let imgCell = '';
    const imgWidget = card.querySelector('.card-imoveis-item .elementor-widget-theme-post-featured-image img');
    if (imgWidget) {
      imgCell = imgWidget;
    }

    // --- TEXT CELL ---
    // Find the colored box with all text info
    let textCell = '';
    const dataBox = card.querySelector('.card-imoveis-dados');
    if (dataBox) {
      // Use the actual element, not a clone
      textCell = dataBox;
    }

    // Only add row if both image and text are present
    if (imgCell && textCell) {
      rows.push([imgCell, textCell]);
    }
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
