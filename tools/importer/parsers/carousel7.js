/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create an <img> from background-image style
  function createImgFromBg(div, altText) {
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (match) {
      const img = document.createElement('img');
      img.src = match[1];
      if (altText) img.alt = altText;
      return img;
    }
    // Also support data-background attribute (for lazy images)
    const dataBg = div.getAttribute('data-background');
    if (dataBg) {
      const img = document.createElement('img');
      img.src = dataBg;
      if (altText) img.alt = altText;
      return img;
    }
    return null;
  }

  // Find carousel slides
  let carouselSlides = [];
  const carouselWidget = element.querySelector('.elementor-skin-carousel, .elementor-widget-media-carousel');
  if (carouselWidget) {
    const swiper = carouselWidget.querySelector('.swiper-wrapper');
    if (swiper) {
      // Only use unique slides (not duplicates)
      const slides = Array.from(swiper.children).filter(slide => slide.classList.contains('swiper-slide') && !slide.classList.contains('swiper-slide-duplicate'));
      carouselSlides = slides.length ? slides : Array.from(swiper.children).filter(slide => slide.classList.contains('swiper-slide'));
    }
  }

  // Table header
  const headerRow = ['Carousel (carousel7)'];
  const rows = [headerRow];

  // For each slide, extract image and text
  carouselSlides.forEach(slide => {
    // Find the image
    let img = null;
    let alt = '';
    const a = slide.querySelector('a');
    if (a) {
      // Find the inner div with background-image or data-background
      const bgDiv = a.querySelector('.elementor-carousel-image');
      if (bgDiv) {
        alt = bgDiv.getAttribute('aria-label') || a.getAttribute('data-elementor-lightbox-title') || '';
        img = createImgFromBg(bgDiv, alt);
      }
    }
    if (!img) return;

    // Text content (title and description)
    let textCell = null;
    // Try to get title and description from link attributes
    const title = a ? a.getAttribute('data-elementor-lightbox-title') : '';
    const desc = a ? a.getAttribute('data-elementor-lightbox-description') : '';

    // If no title/desc, try to get visible text from slide
    let fallbackText = '';
    if (!title && !desc) {
      // Sometimes the text is rendered in the slide itself
      const possibleText = slide.textContent.trim();
      if (possibleText) fallbackText = possibleText;
    }

    if (title || desc || fallbackText) {
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
      if (fallbackText && !(title || desc)) {
        const p = document.createElement('p');
        p.textContent = fallbackText;
        frag.appendChild(p);
      }
      textCell = frag;
    }
    rows.push([img, textCell || '']);
  });

  // Defensive: If no slides found, fallback to nothing
  if (rows.length === 1) return;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
