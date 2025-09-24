/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card data from a loop-item
  function extractCard(cardEl) {
    // Find the image (first .card-imoveis-item img)
    let img = cardEl.querySelector('.card-imoveis-item img');
    if (!img) {
      // fallback: any img inside card
      img = cardEl.querySelector('img');
    }
    // If the image is wrapped in a link, use the link as well
    let imgLink = img && img.closest('a');
    let imageContent = imgLink ? imgLink : img;

    // Find the promo heading (if present)
    let promoHeading = cardEl.querySelector('.img-promo h2, .img-promo .elementor-heading-title');
    // Find the colored box with the main info
    let dataBox = cardEl.querySelector('.card-imoveis-dados .e-con-inner');
    // Defensive: fallback to .card-imoveis-dados if .e-con-inner missing
    if (!dataBox) {
      dataBox = cardEl.querySelector('.card-imoveis-dados');
    }
    // Compose the text cell contents
    const textCell = [];
    if (promoHeading) textCell.push(promoHeading);
    if (dataBox) textCell.push(dataBox);
    // Defensive: if no dataBox, fallback to all text content in cardEl
    if (!dataBox && cardEl) {
      // Try to find all .elementor-widget-post-info in cardEl
      const infos = cardEl.querySelectorAll('.elementor-widget-post-info');
      infos.forEach(info => textCell.push(info));
    }
    return [imageContent, textCell];
  }

  // Find all cards
  const cards = Array.from(element.querySelectorAll('[data-elementor-type="loop-item"]'));

  const rows = [];
  // Header row
  const headerRow = ['Cards (cards57)'];
  rows.push(headerRow);

  // For each card, extract image and text content
  cards.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
