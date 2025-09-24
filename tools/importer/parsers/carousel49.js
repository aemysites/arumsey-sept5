/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract carousel slides
  function getSlides(carouselWrapper) {
    const slides = [];
    if (!carouselWrapper) return slides;
    // Select all unique slides (ignore duplicates)
    const slideEls = Array.from(carouselWrapper.querySelectorAll(':scope > div.swiper-slide'));
    // To avoid duplicates, collect only the first occurrence of each src
    const seenSrcs = new Set();
    slideEls.forEach((slide) => {
      const link = slide.querySelector('a[href]');
      const img = slide.querySelector('img');
      if (!img || !img.src || seenSrcs.has(img.src)) return;
      seenSrcs.add(img.src);
      // Title and description
      let title = link?.getAttribute('data-elementor-lightbox-title') || '';
      let desc = link?.getAttribute('data-elementor-lightbox-description') || '';
      // Compose cell content
      let textCell = null;
      if (title || desc) {
        const frag = document.createDocumentFragment();
        if (title) {
          const h3 = document.createElement('h3');
          h3.textContent = title;
          frag.appendChild(h3);
        }
        if (desc) {
          const p = document.createElement('p');
          p.textContent = desc;
          frag.appendChild(p);
        }
        textCell = frag;
      }
      slides.push([
        img,
        textCell || ''
      ]);
    });
    return slides;
  }

  // Find the carousel wrapper
  const carouselWidget = element.querySelector('.elementor-widget-media-carousel .elementor-main-swiper');
  const carouselSlides = getSlides(carouselWidget?.querySelector('.swiper-wrapper'));

  // Defensive: If no slides found, do not replace
  if (!carouselSlides.length) return;

  // Build table rows
  const headerRow = ['Carousel (carousel49)'];
  const tableRows = [headerRow, ...carouselSlides];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
