/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slides from the carousel
  function getSlides(carouselWrapper) {
    const slides = [];
    // Only get unique slides (not duplicates)
    const seenSrcs = new Set();
    const slideEls = carouselWrapper.querySelectorAll('.swiper-slide');
    slideEls.forEach((slide) => {
      // Find image
      const img = slide.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('src');
      if (seenSrcs.has(src)) return; // skip duplicates
      seenSrcs.add(src);
      // Find title (from link attributes)
      const link = slide.querySelector('a');
      let titleText = '';
      if (link && link.getAttribute('data-elementor-lightbox-title')) {
        titleText = link.getAttribute('data-elementor-lightbox-title');
      }
      // Find description (from link attributes)
      let descText = '';
      if (link && link.getAttribute('data-elementor-lightbox-description')) {
        descText = link.getAttribute('data-elementor-lightbox-description');
      }
      // Try to get visible text under the icon (from the slide itself)
      let visibleText = '';
      // Sometimes the visible label is rendered as text node after the image
      // Try to find it as the last child of the link
      if (link) {
        // Get all text nodes inside link, after the image
        link.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            visibleText = node.textContent.trim();
          }
        });
        // If not found, try to get from aria-label of the image wrapper
        if (!visibleText) {
          const imgWrapper = slide.querySelector('.elementor-carousel-image');
          if (imgWrapper && imgWrapper.getAttribute('aria-label')) {
            visibleText = imgWrapper.getAttribute('aria-label');
          }
        }
      }
      // Prefer visibleText if present
      slides.push({ img, titleText: visibleText || titleText, descText });
    });
    return slides;
  }

  // Find carousel wrapper
  const carouselWidget = element.querySelector('.elementor-widget-media-carousel');
  let carouselWrapper;
  if (carouselWidget) {
    carouselWrapper = carouselWidget.querySelector('.swiper-wrapper');
  }
  if (!carouselWrapper) return;

  // Build table rows
  const headerRow = ['Carousel (carousel7)'];
  const rows = [headerRow];

  const slides = getSlides(carouselWrapper);
  slides.forEach(({ img, titleText, descText }) => {
    // First cell: image only
    const imageCell = img;
    // Second cell: text content (title as heading, description as paragraph)
    const textCellContent = [];
    if (titleText) {
      const h3 = document.createElement('h3');
      h3.textContent = titleText;
      textCellContent.push(h3);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      textCellContent.push(p);
    }
    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
