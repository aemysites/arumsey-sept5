/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the grid
  function getCards() {
    const grid = element.querySelector('.elementor-loop-container.elementor-grid');
    if (!grid) return [];
    return Array.from(grid.querySelectorAll(':scope > [data-elementor-type="loop-item"]'));
  }

  // Helper to extract image (first image in card)
  function getCardImage(card) {
    const img = card.querySelector('img');
    return img ? img.cloneNode(true) : null;
  }

  // Helper to extract promo banner ("Promoção Outlet de Pronto")
  function getPromoBanner(card) {
    const promo = card.querySelector('.img-promo .elementor-heading-title');
    if (promo) {
      const div = document.createElement('div');
      div.appendChild(promo.cloneNode(true));
      return div;
    }
    return null;
  }

  // Helper to extract all text content from the colored box
  function getCardText(card) {
    const dataBox = card.querySelector('.card-imoveis-dados');
    if (!dataBox) return null;
    const inner = dataBox.querySelector('.e-con-inner') || dataBox;
    // Instead of picking specific widgets, grab all text content inside the colored box
    // Remove any icons/images, keep only text and links
    const textDiv = document.createElement('div');
    // Clone all children except images/icons
    Array.from(inner.childNodes).forEach((node) => {
      // If node is an element, filter out images/icons
      if (node.nodeType === 1) {
        // Remove all <img> and <svg> recursively
        const clone = node.cloneNode(true);
        clone.querySelectorAll('img, svg').forEach((el) => el.remove());
        // Remove empty elements
        if (clone.textContent.trim()) {
          textDiv.appendChild(clone);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Text node
        textDiv.appendChild(document.createTextNode(node.textContent));
      }
    });
    // If nothing meaningful, fallback to innerText
    if (!textDiv.textContent.trim()) {
      textDiv.textContent = inner.textContent.trim();
    }
    if (textDiv.textContent.trim()) return textDiv;
    return null;
  }

  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];
  const cards = getCards();
  cards.forEach((card) => {
    const img = getCardImage(card);
    const promo = getPromoBanner(card);
    const text = getCardText(card);
    let imgCell;
    if (promo && img) {
      const imgDiv = document.createElement('div');
      imgDiv.appendChild(promo);
      imgDiv.appendChild(img);
      imgCell = imgDiv;
    } else if (img) {
      imgCell = img;
    } else if (promo) {
      imgCell = promo;
    } else {
      imgCell = document.createElement('div');
    }
    if (imgCell && text) {
      rows.push([imgCell, text]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
