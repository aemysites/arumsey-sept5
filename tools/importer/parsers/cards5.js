/* global WebImporter */
export default function parse(element, { document }) {
  // Find all cards in the grid
  const cards = Array.from(
    element.querySelectorAll('.elementor-loop-container > [data-elementor-type="loop-item"]')
  );

  // Table header row as specified
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    let imageCell = null;
    const img = card.querySelector('.card-imoveis-item img, .elementor-widget-theme-post-featured-image img');
    if (img) {
      imageCell = img;
    }

    // --- TEXT CELL ---
    // Instead of cherry-picking, collect all relevant text content from the card-imoveis-dados area
    const textCellParts = [];
    const infoContainer = card.querySelector('.card-imoveis-dados');
    if (infoContainer) {
      // Get all children except for script/style
      Array.from(infoContainer.children).forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          textCellParts.push(child);
        }
      });
    }
    // Add promo heading if present
    const promoHeading = card.querySelector('.img-promo h2');
    if (promoHeading) {
      textCellParts.unshift(promoHeading);
    }

    // Compose row: [image, text]
    rows.push([
      imageCell,
      textCellParts.filter(Boolean)
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
