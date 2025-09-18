/* global WebImporter */
export default function parse(element, { document }) {
  // Get all card elements
  const cards = Array.from(
    element.querySelectorAll('[data-elementor-type="loop-item"]')
  );

  // Table header as required by block spec
  const headerRow = ['Cards (cards57)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    let imgCell = null;
    const imgWrap = card.querySelector('.elementor-widget-theme-post-featured-image a');
    if (imgWrap && imgWrap.querySelector('img')) {
      imgCell = imgWrap.querySelector('img').cloneNode(true);
    } else {
      const img = card.querySelector('img');
      if (img) imgCell = img.cloneNode(true);
    }

    // --- TEXT CELL ---
    const textCell = document.createElement('div');

    // Promo badge (optional)
    const promo = card.querySelector('.img-promo .elementor-heading-title');
    if (promo) {
      const promoClone = promo.cloneNode(true);
      textCell.appendChild(promoClone);
    }

    // Status (e.g. "LANÇAMENTO", "EM OBRAS", "OBRA EM FASE FINAL")
    const status = card.querySelector('.status-da-obra-card-imoveis .elementor-post-info__terms-list-item');
    if (status) {
      const statusEl = document.createElement('div');
      statusEl.style.fontWeight = 'bold';
      statusEl.textContent = status.textContent.trim();
      textCell.appendChild(statusEl);
    }

    // Title (e.g. "Sensia Gran Bosque")
    const titleLink = card.querySelector('.elementor-icon-list-item a');
    if (titleLink) {
      const h3 = document.createElement('h3');
      const a = titleLink.cloneNode(true);
      // Remove icon span from link
      const icon = a.querySelector('.elementor-icon-list-icon');
      if (icon) icon.remove();
      h3.appendChild(a);
      textCell.appendChild(h3);
    }

    // Location (e.g. "Betânia | Belo Horizonte | MG")
    // Only add location if it's not the status (avoid duplicate)
    // Find all .elementor-post-info__item--type-terms .elementor-post-info__terms-list-item
    // and pick the one that contains a |
    const locations = card.querySelectorAll('.elementor-post-info__item--type-terms .elementor-post-info__terms-list-item');
    let locationText = '';
    locations.forEach(loc => {
      if (loc.textContent.includes('|')) {
        locationText = loc.textContent.trim();
      }
    });
    if (locationText) {
      const locDiv = document.createElement('div');
      locDiv.textContent = locationText;
      textCell.appendChild(locDiv);
    }

    // Features list (e.g. quartos, área, lazer)
    // Only get the features from the lower widget (not the status/title/location)
    // The last .elementor-widget-post-info is the features list
    const featuresWidgets = Array.from(card.querySelectorAll('.elementor-widget-post-info'));
    if (featuresWidgets.length > 1) {
      const featuresWidget = featuresWidgets[featuresWidgets.length - 1];
      const featuresList = featuresWidget.querySelectorAll('ul.elementor-post-info > li');
      if (featuresList.length) {
        const ul = document.createElement('ul');
        featuresList.forEach(li => {
          // Remove icons for clarity, keep only text
          const liClone = li.cloneNode(true);
          const icon = liClone.querySelector('.elementor-icon-list-icon');
          if (icon) icon.remove();
          ul.appendChild(liClone);
        });
        textCell.appendChild(ul);
      }
    }

    rows.push([
      imgCell,
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
