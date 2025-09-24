/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Extract background image (the main photo, not SVG overlays) ---
  // The main background image is the first <img> inside the root element
  const backgroundImg = element.querySelector('img[src*="sensia-maringa-loja-conceito-featured"]');

  // --- 2. Find overlay content container (the green overlay with text) ---
  const overlayContainer = element.querySelector('.elementor-element-7bcb8bab');
  const contentContainer = overlayContainer || element;

  // --- 3. Extract heading ---
  let heading = null;
  const headingWidget = contentContainer.querySelector('.elementor-widget-heading');
  if (headingWidget) {
    heading = headingWidget.querySelector('h2');
  }

  // --- 4. Extract address and subheading paragraphs ---
  let addressParagraphs = [];
  const addressWidget = contentContainer.querySelector('.elementor-widget-text-editor');
  if (addressWidget) {
    addressParagraphs = Array.from(addressWidget.querySelectorAll('p'));
  }

  // --- 5. Extract icon list for "Endereço" ---
  let iconListUl = null;
  const iconListWidget = contentContainer.querySelector('.elementor-widget-icon-list');
  if (iconListWidget) {
    iconListUl = iconListWidget.querySelector('ul');
  }

  // --- 6. Extract Google Maps and Waze links ---
  let mapsLinks = [];
  const iconListWidgets = contentContainer.querySelectorAll('.elementor-widget-icon-list');
  if (iconListWidgets.length > 1) {
    // Second icon-list widget contains the links
    const linksUl = iconListWidgets[1].querySelector('ul');
    if (linksUl) {
      mapsLinks = Array.from(linksUl.children);
    }
  }

  // --- 7. Extract CTA button ---
  let ctaButton = null;
  const buttonWidget = contentContainer.querySelector('.elementor-widget-button');
  if (buttonWidget) {
    ctaButton = buttonWidget.querySelector('a');
  }

  // --- 8. Compose content for the third row (preserve semantic HTML) ---
  const thirdRowContent = [];
  if (heading) thirdRowContent.push(heading);
  if (iconListUl) thirdRowContent.push(iconListUl);
  if (addressParagraphs.length) thirdRowContent.push(...addressParagraphs);
  if (mapsLinks.length) thirdRowContent.push(...mapsLinks);
  if (ctaButton) thirdRowContent.push(ctaButton);

  // --- 9. Table rows (block name must be exact) ---
  const headerRow = ['Hero (hero53)'];
  const backgroundRow = [backgroundImg ? backgroundImg : ''];
  const contentRow = [thirdRowContent.length ? thirdRowContent : ''];

  // --- 10. Create table ---
  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // --- 11. Replace element ---
  element.replaceWith(block);
}
