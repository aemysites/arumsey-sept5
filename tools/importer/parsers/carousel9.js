/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel widget
  const carouselWidget = element.querySelector('[data-widget_type="media-carousel.default"]');
  if (!carouselWidget) return;
  const swiperWrapper = carouselWidget.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Only non-duplicate slides
  const slides = Array.from(swiperWrapper.children).filter(slide => {
    return slide.classList.contains('swiper-slide') && !slide.classList.contains('swiper-slide-duplicate');
  });

  // Compose left column content (all text and button, in order)
  const leftColEls = [];
  // Get heading (if any)
  const headingEl = element.querySelector('h5');
  if (headingEl) leftColEls.push(headingEl.cloneNode(true));
  // Get all text-editor paragraphs (in DOM order)
  element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container').forEach(container => {
    Array.from(container.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        leftColEls.push(node.cloneNode(true));
      }
    });
  });
  // Get button (if any)
  const buttonEl = element.querySelector('.elementor-widget-button a');
  if (buttonEl) leftColEls.push(buttonEl.cloneNode(true));

  // Table header
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  slides.forEach(slide => {
    let imgUrl = '';
    let imgAlt = '';
    const link = slide.querySelector('a');
    if (link) {
      const imgDiv = link.querySelector('.elementor-carousel-image');
      if (imgDiv) {
        imgUrl = imgDiv.style.backgroundImage
          ? imgDiv.style.backgroundImage.replace(/url\(["']?(.*?)["']?\)/, '$1')
          : imgDiv.getAttribute('data-background');
        imgAlt = imgDiv.getAttribute('aria-label') || '';
      }
    }
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.alt = imgAlt || 'Slide image';
      imgEl.loading = 'lazy';
    }
    rows.push([
      imgEl,
      leftColEls.length > 0 ? leftColEls.map(el => el.cloneNode(true)) : ''
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
