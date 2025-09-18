/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Find the grid container holding all cards
  // Defensive: find the first .elementor-loop-container inside the block
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;

  // Each card is a direct child with [data-elementor-type="loop-item"]
  const cardEls = Array.from(grid.querySelectorAll('[data-elementor-type="loop-item"]'));

  cardEls.forEach(card => {
    // Find the image element (mandatory)
    // Defensive: look for .card-imoveis-item img inside the card
    let img = card.querySelector('.card-imoveis-item img');
    if (!img) {
      // fallback: any img inside the card
      img = card.querySelector('img');
    }

    // Find the text content container
    // Defensive: look for .card-imoveis-dados inside the card
    let textContainer = card.querySelector('.card-imoveis-dados');
    if (!textContainer) {
      // fallback: any element with a background color (style)
      textContainer = Array.from(card.querySelectorAll('[style]')).find(el => el.style.backgroundColor);
    }

    // Build the row: [image, text content]
    // Use the actual elements, not clones
    const row = [img, textContainer];
    rows.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
