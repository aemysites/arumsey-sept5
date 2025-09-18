/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image URL from background-image style
  function getImageUrlFromStyle(style) {
    const match = style.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : null;
  }

  // Find the carousel slides container
  const carouselContainer = element.querySelector('.elementor-skin-carousel .elementor-swiper .swiper-wrapper');
  if (!carouselContainer) return;

  // Get all unique slides (avoid duplicates)
  const slideNodes = Array.from(carouselContainer.children)
    .filter(slide => slide.classList.contains('swiper-slide') && !slide.classList.contains('swiper-slide-duplicate'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel49)']);

  // For each slide, create a row: [image, text]
  slideNodes.forEach(slide => {
    // Find the anchor
    const anchor = slide.querySelector('a');
    let imgEl = null;
    if (anchor) {
      // Find the image div
      const imgDiv = anchor.querySelector('.elementor-carousel-image');
      if (imgDiv) {
        let imgUrl = '';
        // Try style first
        if (imgDiv.hasAttribute('style')) {
          imgUrl = getImageUrlFromStyle(imgDiv.getAttribute('style'));
        }
        // Fallback to data-background
        if (!imgUrl && imgDiv.hasAttribute('data-background')) {
          imgUrl = imgDiv.getAttribute('data-background');
        }
        if (imgUrl) {
          imgEl = document.createElement('img');
          imgEl.src = imgUrl;
          imgEl.alt = anchor.getAttribute('data-elementor-lightbox-title') || imgDiv.getAttribute('aria-label') || '';
        }
      }
    }
    // Text content (title and description)
    let textContent = null;
    if (anchor) {
      // Use all text content from anchor attributes
      const title = anchor.getAttribute('data-elementor-lightbox-title');
      const desc = anchor.getAttribute('data-elementor-lightbox-description');
      // Some carousels may have text inside the anchor, so also check for visible text
      let visibleText = '';
      // Look for a label under the image (sometimes present)
      const label = anchor.querySelector('.elementor-carousel-image + span, .elementor-carousel-image + div');
      if (label && label.textContent.trim()) {
        visibleText = label.textContent.trim();
      }
      if (title || desc || visibleText) {
        const wrapper = document.createElement('div');
        if (title) {
          const h3 = document.createElement('h3');
          h3.textContent = title;
          wrapper.appendChild(h3);
        }
        if (desc) {
          const p = document.createElement('p');
          p.textContent = desc;
          wrapper.appendChild(p);
        }
        if (visibleText && (!title || visibleText !== title)) {
          const p = document.createElement('p');
          p.textContent = visibleText;
          wrapper.appendChild(p);
        }
        textContent = wrapper;
      }
    }
    // Always require image in first cell, text in second cell (may be empty)
    rows.push([
      imgEl || '',
      textContent || ''
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
