/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a slide
  function extractImage(slide) {
    const img = slide.querySelector('img');
    if (img) return img;
    const bgDiv = slide.querySelector('[data-background], [data-hlx-background-image]');
    if (bgDiv) {
      let url = bgDiv.getAttribute('data-background');
      if (!url) {
        const bg = bgDiv.getAttribute('data-hlx-background-image');
        if (bg) {
          const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) url = match[1];
        }
      }
      if (url) {
        const image = document.createElement('img');
        image.src = url;
        return image;
      }
    }
    return null;
  }

  // Helper to extract text content from a slide
  function extractText(slide) {
    // Try to get title and description from link attributes
    const link = slide.querySelector('a');
    const frag = document.createDocumentFragment();
    if (link) {
      const title = link.getAttribute('data-elementor-lightbox-title');
      const desc = link.getAttribute('data-elementor-lightbox-description');
      if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title;
        frag.appendChild(h2);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        frag.appendChild(p);
      }
    }
    // Fallback: try to get visible text from slide
    // Get all text nodes that are visible
    const textNodes = [];
    slide.querySelectorAll('*').forEach((node) => {
      // Skip script/style
      if (['SCRIPT', 'STYLE'].includes(node.tagName)) return;
      // Only get nodes with visible text
      if (node.childNodes.length) {
        node.childNodes.forEach((child) => {
          if (child.nodeType === 3 && child.textContent.trim()) {
            textNodes.push(child.textContent.trim());
          }
        });
      }
    });
    // If we didn't get any text from attributes, use visible text
    if (!frag.childNodes.length && textNodes.length) {
      const p = document.createElement('p');
      p.textContent = textNodes.join(' ');
      frag.appendChild(p);
    }
    return frag.childNodes.length ? frag : null;
  }

  // Find the slides wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.children).filter(
    (el) => el.classList.contains('swiper-slide')
  );

  // Table header
  const headerRow = ['Carousel (carousel13)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    const image = extractImage(slide);
    if (!image) return;
    const text = extractText(slide);
    rows.push([image, text ? Array.from(text.childNodes) : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
