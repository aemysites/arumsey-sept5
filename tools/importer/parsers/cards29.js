/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards root container
  const cardsRoot = element.querySelector('.elementor-loop-container');
  if (!cardsRoot) return;
  const cardEls = Array.from(cardsRoot.children).filter(el => el.classList.contains('e-loop-item'));

  // Table header must match block name exactly
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  cardEls.forEach(card => {
    // --- Image extraction ---
    let imgEl = null;
    const imgContainer = card.querySelector('.card-imoveis-item');
    if (imgContainer) {
      const imgWidget = imgContainer.querySelector('.elementor-widget-image');
      if (imgWidget) {
        const img = imgWidget.querySelector('img');
        if (img) imgEl = img;
      }
    }

    // --- Promo Banner (optional, above card) ---
    let promoBanner = null;
    const promoContainer = card.querySelector('.img-promo');
    if (promoContainer) {
      const headingWidget = promoContainer.querySelector('.elementor-widget-heading');
      if (headingWidget) {
        const h2 = headingWidget.querySelector('h2');
        if (h2) promoBanner = h2;
      }
    }

    // --- Card Info (title, subtitle, location, features) ---
    let infoContent = [];
    const infoContainer = card.querySelector('.card-imoveis-dados');
    if (infoContainer) {
      const inner = infoContainer.querySelector('.e-con-inner');
      if (inner) {
        // Only include info rows, skip divider widgets
        Array.from(inner.children).forEach(row => {
          if (!row.classList.contains('elementor-widget-divider')) {
            infoContent.push(row);
          }
        });
      }
    }

    // Compose text cell: promoBanner (if present) + infoContent
    const textCell = [];
    if (promoBanner) textCell.push(promoBanner);
    textCell.push(...infoContent);

    // Compose row: [image, text]
    rows.push([
      imgEl ? imgEl : '',
      textCell
    ]);
  });

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
