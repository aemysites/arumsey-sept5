/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all card elements
  function getCardElements(container) {
    // Find the main grid container
    const grid = container.querySelector('.elementor-loop-container');
    if (!grid) return [];
    // Each card is a direct child with data-elementor-type="loop-item"
    return Array.from(grid.querySelectorAll('[data-elementor-type="loop-item"]'));
  }

  // Helper to extract image element from a card
  function getCardImage(card) {
    // Find the first <img> inside the card
    const img = card.querySelector('img');
    return img || '';
  }

  // Helper to extract promo/heading if present
  function getPromoHeading(card) {
    // Promo heading is inside .img-promo .elementor-heading-title
    const promo = card.querySelector('.img-promo .elementor-heading-title');
    if (promo) {
      // Return the existing heading element
      return promo;
    }
    return '';
  }

  // Helper to extract the card's main content block (title, meta, description, etc.)
  function getCardContent(card) {
    // The main content is inside .card-imoveis-dados
    const dados = card.querySelector('.card-imoveis-dados');
    if (!dados) return '';
    // Use the entire .card-imoveis-dados as the content cell
    return dados;
  }

  // Build the table rows
  const rows = [];
  // Always use the block name as header
  rows.push(['Cards (cards29)']);

  // Find all card elements
  const cards = getCardElements(element);
  cards.forEach(card => {
    // Image cell
    const img = getCardImage(card);
    // Text cell: promo heading (if any) + card content
    const promo = getPromoHeading(card);
    const content = getCardContent(card);
    let textCell;
    if (promo && content) {
      // Both promo and content
      textCell = [promo, content];
    } else if (content) {
      textCell = content;
    } else if (promo) {
      textCell = promo;
    } else {
      textCell = '';
    }
    rows.push([
      img,
      textCell
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
