/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card elements
  const cards = Array.from(
    element.querySelectorAll('.elementor-loop-container > [data-elementor-type="loop-item"]')
  );

  // Table header must match block name exactly
  const headerRow = ['Cards (cards57)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    let imageCell = null;
    // Find the image inside the card
    const imgLink = card.querySelector('.card-imoveis-item .elementor-widget-image a');
    if (imgLink && imgLink.querySelector('img')) {
      imageCell = imgLink.querySelector('img');
    } else {
      // fallback: find first img in card
      imageCell = card.querySelector('img');
    }

    // --- TEXT CELL ---
    const textCellContent = [];

    // 1. Promo Banner (if present)
    const promoHeading = card.querySelector('.img-promo .elementor-widget-heading h2');
    if (promoHeading) {
      textCellContent.push(promoHeading);
    }

    // 2. Status (e.g., Lançamento, Em obras, Obra em fase final)
    const status = card.querySelector('.status-da-obra-card-imoveis .elementor-post-info .elementor-icon-list-text');
    if (status) {
      const statusDiv = document.createElement('div');
      statusDiv.style.fontWeight = 'bold';
      statusDiv.textContent = status.textContent.trim();
      textCellContent.push(statusDiv);
    }

    // 3. Title (Sensia Gran Bosque, Sensia Paris, etc.)
    const titleLink = card.querySelector('.elementor-element-5ad0fa88 .elementor-post-info a');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.elementor-icon-list-text');
      if (titleSpan) {
        const titleDiv = document.createElement('div');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.textContent = titleSpan.textContent.trim();
        textCellContent.push(titleDiv);
      }
    }

    // 4. Location
    const location = card.querySelector('.elementor-element-43e621b1 .elementor-post-info .elementor-icon-list-text');
    if (location) {
      const locationDiv = document.createElement('div');
      locationDiv.textContent = location.textContent.trim();
      textCellContent.push(locationDiv);
    }

    // 5. Divider (optional)
    const divider = card.querySelector('.elementor-widget-divider');
    if (divider) {
      textCellContent.push(divider);
    }

    // 6. Features (list)
    const featuresList = card.querySelector('.elementor-element-409f6f96 .elementor-post-info');
    if (featuresList) {
      textCellContent.push(featuresList);
    }

    // Compose the row
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
