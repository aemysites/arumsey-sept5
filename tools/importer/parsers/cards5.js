/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a loop-item element
  function extractCard(loopItem) {
    // Image: find the first img inside card-imoveis-item
    let img = null;
    const imgContainer = loopItem.querySelector('.card-imoveis-item img');
    if (imgContainer) {
      img = imgContainer.cloneNode(true);
    }
    // Text content cell
    const textCellContent = document.createElement('div');
    // Promo heading (optional, always present in sample)
    const promoHeading = loopItem.querySelector('.img-promo h2');
    if (promoHeading) {
      const heading = document.createElement('strong');
      heading.textContent = promoHeading.textContent;
      textCellContent.appendChild(heading);
      textCellContent.appendChild(document.createElement('br'));
    }
    // Card info block (background color)
    const cardInfo = loopItem.querySelector('.card-imoveis-dados');
    if (cardInfo) {
      // Status (Em obras)
      const status = cardInfo.querySelector('.status-da-obra-card-imoveis .elementor-post-info__item');
      if (status) {
        const statusDiv = document.createElement('div');
        statusDiv.textContent = status.textContent.trim();
        textCellContent.appendChild(statusDiv);
      }
      // Title (Sensia Urban / Sensia Patamares)
      const titleLink = cardInfo.querySelector('.elementor-post-info__item--type-custom');
      if (titleLink) {
        const titleDiv = document.createElement('div');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.textContent = titleLink.textContent.trim();
        textCellContent.appendChild(titleDiv);
      }
      // Location (Stiep | Salvador | BA, etc)
      // Only pick the first location (the one under the title)
      const locations = cardInfo.querySelectorAll('.elementor-post-info__item--type-terms');
      if (locations.length > 0) {
        const locationDiv = document.createElement('div');
        locationDiv.textContent = locations[0].textContent.trim();
        textCellContent.appendChild(locationDiv);
      }
      // Divider (optional, visual)
      // Features (2 quartos, área, lazer premium)
      // Only get the features from the last .elementor-icon-list-items.elementor-post-info
      const featuresLists = cardInfo.querySelectorAll('.elementor-icon-list-items.elementor-post-info');
      if (featuresLists.length > 0) {
        const featuresList = featuresLists[featuresLists.length - 1];
        featuresList.querySelectorAll('li').forEach((li) => {
          const txt = li.querySelector('.elementor-post-info__item');
          if (txt && !txt.classList.contains('elementor-post-info__item--type-custom') && !txt.textContent.includes('|')) {
            const featureDiv = document.createElement('div');
            featureDiv.textContent = txt.textContent.trim();
            textCellContent.appendChild(featureDiv);
          }
        });
      }
    }
    // Add fallback: if textCellContent is empty, try to get all text from cardInfo
    if (!textCellContent.textContent.trim() && cardInfo) {
      textCellContent.textContent = cardInfo.textContent.trim();
    }
    return [img, textCellContent.childNodes.length ? textCellContent : ''];
  }

  // Find all cards
  const cards = [];
  const loopItems = element.querySelectorAll('[data-elementor-type="loop-item"]');
  loopItems.forEach((loopItem) => {
    cards.push(extractCard(loopItem));
  });

  // Table header
  const headerRow = ['Cards (cards5)'];
  const tableRows = [headerRow];
  // Add each card row
  cards.forEach(([img, textContent]) => {
    tableRows.push([img, textContent]);
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
