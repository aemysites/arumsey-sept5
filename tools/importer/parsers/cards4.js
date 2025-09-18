/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: exactly one column
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each card is a direct child container under the main boxed container
  // Find all direct children with e-con-full (each is a card)
  const cardContainers = element.querySelectorAll(':scope > div > div > div.e-con-full');

  cardContainers.forEach((card) => {
    // Find image widget (first image in card)
    const imageWidget = card.querySelector('.elementor-widget-image');
    let imageEl = null;
    if (imageWidget) {
      imageEl = imageWidget.querySelector('img');
    }

    // Find text widget (first text in card)
    const textWidget = card.querySelector('.elementor-widget-text-editor');
    let textEl = null;
    if (textWidget) {
      // Use the full widget container for semantic fidelity
      textEl = textWidget.querySelector('.elementor-widget-container');
    }

    // Only add row if both image and text exist
    if (imageEl && textEl) {
      rows.push([imageEl, textEl]);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
