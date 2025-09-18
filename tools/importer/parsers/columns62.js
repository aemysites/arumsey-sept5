/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Left column: gather heading, intro, specs, button
  const leftColumnContent = [];

  // Heading
  const heading = element.querySelector('.elementor-widget-heading');
  if (heading) {
    const headingContainer = heading.querySelector('.elementor-widget-container');
    if (headingContainer) leftColumnContent.push(headingContainer);
  }

  // Intro paragraph
  const intro = element.querySelector('.elementor-widget-text-editor');
  if (intro) {
    const introContainer = intro.querySelector('.elementor-widget-container');
    if (introContainer) leftColumnContent.push(introContainer);
  }

  // Three specs: Metragem, Tipologia, Nº de vagas
  // Each spec is a pair of containers: label and value
  function getSpec(labelSelector, valueSelector) {
    const labelWidget = element.querySelector(labelSelector);
    const valueWidget = element.querySelector(valueSelector);
    const label = labelWidget && labelWidget.querySelector('.elementor-widget-container');
    const value = valueWidget && valueWidget.querySelector('.elementor-widget-container');
    if (label && value) {
      // Wrap in a div for alignment
      const specDiv = document.createElement('div');
      specDiv.appendChild(label);
      specDiv.appendChild(value);
      return specDiv;
    }
    return null;
  }

  // Metragem
  const metragem = getSpec('[data-id="1b0c4f71"]', '[data-id="67d840cf"]');
  if (metragem) leftColumnContent.push(metragem);

  // Tipologia
  const tipologia = getSpec('[data-id="546b6d63"]', '[data-id="71cfaffe"]');
  if (tipologia) leftColumnContent.push(tipologia);

  // Nº de vagas
  const vagas = getSpec('[data-id="4641fdbd"]', '[data-id="5a2d8285"]');
  if (vagas) leftColumnContent.push(vagas);

  // Button
  const buttonWidget = element.querySelector('.elementor-widget-button');
  if (buttonWidget) {
    const buttonContainer = buttonWidget.querySelector('.elementor-widget-container');
    if (buttonContainer) leftColumnContent.push(buttonContainer);
  }

  // Right column: carousel or image
  let rightColumnContent = [];
  const carouselWidget = element.querySelector('.elementor-widget-media-carousel');
  if (carouselWidget) {
    // Try to get the first image from the carousel
    const imgLink = carouselWidget.querySelector('.swiper-slide a');
    if (imgLink) {
      // Try to find an actual <img> inside, otherwise use a link to the image
      const bgUrl = imgLink.getAttribute('href');
      if (bgUrl) {
        const img = document.createElement('img');
        img.src = bgUrl;
        img.alt = imgLink.getAttribute('data-elementor-lightbox-title') || '';
        rightColumnContent.push(img);
      } else {
        rightColumnContent.push(imgLink);
      }
    }
  }

  // Table rows
  const headerRow = ['Columns (columns62)'];
  const contentRow = [leftColumnContent, rightColumnContent];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
