/* global WebImporter */
export default function parse(element, { document }) {
  // Find all cards
  const cardSelector = '[data-elementor-type="loop-item"]';
  const cards = Array.from(element.querySelectorAll(cardSelector));

  // Table header row
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Find the image inside the card
    let imageCell = null;
    const imgContainer = card.querySelector('.card-imoveis-item img');
    if (imgContainer) {
      imageCell = imgContainer;
    } else {
      // fallback: find any image inside the card
      imageCell = card.querySelector('img');
    }

    // --- TEXT CELL ---
    // Find the text block (colored background)
    let textCell = null;
    const dados = card.querySelector('.card-imoveis-dados');
    if (dados) {
      // Use the inner content of the colored box as the text cell
      textCell = dados;
    } else {
      // fallback: use all text content in the card
      textCell = document.createElement('div');
      textCell.innerHTML = card.textContent;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
