/* global WebImporter */
export default function parse(element, { document }) {
  // Find all cards
  const cardNodes = Array.from(element.querySelectorAll('[data-elementor-type="loop-item"]'));

  // Table header row
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  cardNodes.forEach(card => {
    // IMAGE CELL
    let imgCell = null;
    const imgWrap = card.querySelector('.elementor-widget-theme-post-featured-image, .elementor-widget-image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgCell = img;
    }

    // TEXT CELL
    const textCellContent = [];

    // Promo heading (above image)
    const promoHeading = card.querySelector('.img-promo h2');
    if (promoHeading) {
      const heading = document.createElement('h3');
      heading.textContent = promoHeading.textContent;
      textCellContent.push(heading);
    }

    // Card info container
    const infoBox = card.querySelector('.card-imoveis-dados');
    if (infoBox) {
      // Get all text content inside infoBox, including nested elements
      // This ensures we capture all visible text, not just selected fields
      // Use textContent instead of innerText for compatibility
      const infoText = infoBox.textContent ? infoBox.textContent.trim() : '';
      if (infoText) {
        const desc = document.createElement('div');
        desc.textContent = infoText;
        textCellContent.push(desc);
      }
    }

    rows.push([
      imgCell,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
