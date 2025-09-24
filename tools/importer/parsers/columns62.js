/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all direct children of the main block element
  const directChildren = Array.from(element.querySelectorAll(':scope > div'));

  // --- COLUMN 1: Gather left column content ---
  let heading = null;
  let intro = null;
  let button = null;
  // For the three info rows (Metragem, Tipologia, Nº de vagas)
  const infoLabels = [];
  const infoValues = [];

  // Traverse children to find relevant elements
  directChildren.forEach((child) => {
    // Heading
    if (child.querySelector('.elementor-heading-title')) {
      heading = child.querySelector('.elementor-heading-title');
    }
    // Intro paragraph
    if (child.querySelector('.elementor-widget-text-editor p') && !intro) {
      // Only use the first paragraph as intro
      intro = child.querySelector('.elementor-widget-text-editor p');
    }
    // Button
    if (child.querySelector('.elementor-button')) {
      button = child.querySelector('.elementor-button');
    }
  });

  // Now get info rows (labels and values)
  // Find all bold/strong paragraphs that look like labels
  const infoPs = Array.from(element.querySelectorAll('.elementor-widget-text-editor p'));
  for (let i = 0; i < infoPs.length; i++) {
    const p = infoPs[i];
    if (p.querySelector('b, strong') && p.textContent.trim().endsWith(':')) {
      // Label found, value should be next paragraph
      const valueP = infoPs[i + 1];
      if (valueP) {
        infoLabels.push(p);
        infoValues.push(valueP);
      }
    }
  }

  // Compose left column cell (flattened, no nested table)
  const leftColumnContent = [];
  if (heading) leftColumnContent.push(heading);
  if (intro) leftColumnContent.push(intro);
  // Add info rows as flat elements
  for (let i = 0; i < infoLabels.length; i++) {
    // Wrap label and value in a div for separation
    const rowDiv = document.createElement('div');
    rowDiv.appendChild(infoLabels[i].cloneNode(true));
    rowDiv.appendChild(infoValues[i].cloneNode(true));
    leftColumnContent.push(rowDiv);
  }
  if (button) leftColumnContent.push(button);

  // --- COLUMN 2: Gather right column content ---
  // Find carousel or image
  let rightColumnContent = [];
  let carousel = null;
  directChildren.forEach((child) => {
    if (child.querySelector('.elementor-widget-media-carousel')) {
      carousel = child.querySelector('.elementor-widget-media-carousel');
    }
  });
  if (carousel) {
    // Try to extract image from carousel
    const imgDiv = carousel.querySelector('.elementor-carousel-image');
    let img = null;
    if (imgDiv && imgDiv.dataset.background) {
      img = document.createElement('img');
      img.src = imgDiv.dataset.background;
      img.alt = imgDiv.getAttribute('aria-label') || '';
      rightColumnContent.push(img);
    }
  }

  // --- Compose table rows ---
  const headerRow = ['Columns (columns62)'];
  const contentRow = [leftColumnContent, rightColumnContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
