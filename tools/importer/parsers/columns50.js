/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct children divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Find the carousel container (has .elementor-skin-carousel)
  let carouselDivIdx = -1;
  topDivs.forEach((div, idx) => {
    if (div.querySelector('.elementor-skin-carousel')) carouselDivIdx = idx;
  });
  if (carouselDivIdx === -1) carouselDivIdx = topDivs.length - 1; // fallback

  // Find the button div (has .elementor-widget-button)
  let buttonDivIdx = -1;
  topDivs.forEach((div, idx) => {
    if (div.querySelector('.elementor-widget-button')) buttonDivIdx = idx;
  });

  // Compose left column content: all content up to and including the button
  const leftColumnContent = [];
  for (let i = 0; i < topDivs.length; i++) {
    if (i === carouselDivIdx) break;
    leftColumnContent.push(topDivs[i]);
    if (i === buttonDivIdx) break;
  }

  // Right column: carousel/images
  const rightColumnDiv = topDivs[carouselDivIdx];
  const rightColumnContent = rightColumnDiv ? [rightColumnDiv] : [];

  // Table construction
  const headerRow = ['Columns (columns50)'];
  const secondRow = [leftColumnContent, rightColumnContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow,
  ], document);

  element.replaceWith(table);
}
