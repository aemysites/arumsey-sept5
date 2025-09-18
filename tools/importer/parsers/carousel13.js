/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create an <img> element from a background image URL
  function createImgFromBg(url, alt = '') {
    const img = document.createElement('img');
    img.src = url;
    if (alt) img.alt = alt;
    return img;
  }

  // Find the swiper-wrapper containing the slides
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all direct child slides (ignore duplicates)
  const slides = Array.from(swiperWrapper.children)
    .filter(slide => slide.classList.contains('swiper-slide') && !slide.classList.contains('swiper-slide-duplicate'));

  // Table header row
  const headerRow = ['Carousel (carousel13)'];
  const rows = [headerRow];

  slides.forEach(slide => {
    // IMAGE CELL
    let imgEl = null;
    let altText = '';
    // If there's a link, get image from background-image or data-background
    const link = slide.querySelector('a');
    let imgUrl = '';
    if (link) {
      // Try to find the image div inside the link
      const imgDiv = link.querySelector('.elementor-carousel-image');
      if (imgDiv) {
        // Try style background-image first
        const bgImg = imgDiv.style.backgroundImage;
        if (bgImg && bgImg.startsWith('url(')) {
          imgUrl = bgImg.replace(/url\(["']?(.*?)["']?\)/, '$1');
        } else if (imgDiv.dataset.background) {
          imgUrl = imgDiv.dataset.background;
        }
        altText = imgDiv.getAttribute('aria-label') || link.getAttribute('data-elementor-lightbox-title') || '';
      }
    } else {
      // No link, look for image div directly
      const imgDiv = slide.querySelector('.elementor-carousel-image');
      if (imgDiv) {
        if (imgDiv.style.backgroundImage && imgDiv.style.backgroundImage.startsWith('url(')) {
          imgUrl = imgDiv.style.backgroundImage.replace(/url\(["']?(.*?)["']?\)/, '$1');
        } else if (imgDiv.dataset.background) {
          imgUrl = imgDiv.dataset.background;
        }
        altText = imgDiv.getAttribute('aria-label') || '';
      }
    }
    if (imgUrl) {
      imgEl = createImgFromBg(imgUrl, altText);
    }

    // TEXT CELL
    let textCell = null;
    // Try to get all text content from the slide, not just link attributes
    // 1. Try link attributes (title/desc)
    const textFragments = [];
    if (link) {
      const title = link.getAttribute('data-elementor-lightbox-title');
      const desc = link.getAttribute('data-elementor-lightbox-description');
      if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title;
        textFragments.push(h2);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        textFragments.push(p);
      }
    }
    // 2. Also include any visible text nodes or elements inside the slide (outside the link)
    // This ensures we don't miss any text content
    Array.from(slide.childNodes).forEach(node => {
      // Ignore the link node (already handled)
      if (node === link) return;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textFragments.push(document.createTextNode(node.textContent.trim()));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // If it's a visible element and not just decoration, add it
        if (node.textContent.trim()) {
          // Use a clone to preserve formatting
          textFragments.push(node.cloneNode(true));
        }
      }
    });
    // If any text fragments, use them as the cell
    if (textFragments.length) {
      textCell = textFragments;
    }
    // Always ensure two columns per row
    rows.push([imgEl, textCell || '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
