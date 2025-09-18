/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide info from a swiper-slide element
  function extractSlide(slide) {
    // Find image (mandatory)
    let img = null;
    const imgDiv = slide.querySelector('.elementor-carousel-image');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    if (!img) {
      img = slide.querySelector('img');
    }
    // Find text content (optional)
    let textCell = null;
    const a = slide.querySelector('a');
    let titleText = '';
    let descText = '';
    if (a) {
      // Use lightbox attributes if present
      titleText = a.getAttribute('data-elementor-lightbox-title') || '';
      descText = a.getAttribute('data-elementor-lightbox-description') || '';
    }
    // Fallback: use visible text from the slide if attributes are missing
    if (!titleText || !descText) {
      // Try to find visible text in the slide
      const possibleText = Array.from(slide.querySelectorAll('div, span, p')).map(el => el.textContent.trim()).filter(Boolean);
      // If not already set, use first as title, rest as description
      if (!titleText && possibleText.length) {
        titleText = possibleText[0];
      }
      if (!descText && possibleText.length > 1) {
        descText = possibleText.slice(1).join(' ');
      }
    }
    // Compose cell
    const cellContent = [];
    if (titleText) {
      const h3 = document.createElement('h3');
      h3.textContent = titleText;
      cellContent.push(h3);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      cellContent.push(p);
    }
    textCell = cellContent.length ? cellContent : '';
    return [img, textCell];
  }

  // Find carousel slides
  const slides = [];
  // Find the carousel container
  const carouselWidget = element.querySelector('.elementor-skin-carousel');
  if (carouselWidget) {
    const swiperWrapper = carouselWidget.querySelector('.swiper-wrapper');
    if (swiperWrapper) {
      // Get unique slides (ignore duplicates)
      const slideEls = Array.from(swiperWrapper.children).filter(
        (el) => el.classList.contains('swiper-slide') && !el.classList.contains('swiper-slide-duplicate')
      );
      slideEls.forEach((slide) => {
        const [img, textCell] = extractSlide(slide);
        if (img) {
          slides.push([img, textCell]);
        }
      });
    }
  }

  // Build table rows
  const headerRow = ['Carousel (carousel49)'];
  const tableRows = [headerRow];
  slides.forEach((row) => {
    tableRows.push(row);
  });

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
