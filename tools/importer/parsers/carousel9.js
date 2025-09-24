/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container (the one with .elementor-skin-carousel)
  const carouselWidget = Array.from(element.querySelectorAll('[class*="elementor-skin-carousel"]')).find(
    el => el.querySelector('.swiper-wrapper')
  );
  if (!carouselWidget) return;

  // Find the swiper-wrapper
  const swiperWrapper = carouselWidget.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all unique slides (ignore duplicates)
  const slideImgs = [];
  const seenSrcs = new Set();
  Array.from(swiperWrapper.children).forEach(slide => {
    if (!slide.classList.contains('swiper-slide')) return;
    const img = slide.querySelector('img');
    if (!img || !img.src || seenSrcs.has(img.src)) return;
    seenSrcs.add(img.src);
    slideImgs.push(img);
  });

  // Get left column content (textual info)
  // Instead of targeting only heading and text-editor widgets, grab all direct children except carousel
  const leftContentNodes = [];
  Array.from(element.children).forEach(child => {
    if (child.contains(carouselWidget)) return;
    // Find all widget containers inside this child
    const widgetContainers = child.querySelectorAll('.elementor-widget-container');
    widgetContainers.forEach(container => {
      // Only add if it contains text or links
      if (container.textContent && container.textContent.trim()) {
        leftContentNodes.push(container.cloneNode(true));
      }
    });
    // Also add buttons
    const buttonLinks = child.querySelectorAll('a');
    buttonLinks.forEach(link => {
      if (link.textContent && link.textContent.trim()) {
        leftContentNodes.push(link.cloneNode(true));
      }
    });
  });

  // Table header
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  // All slide rows must have 2 columns: [image, left content] for first, [image, ''] for others
  slideImgs.forEach((img, idx) => {
    if (idx === 0 && leftContentNodes.length > 0) {
      rows.push([img, leftContentNodes]);
    } else {
      rows.push([img, '']);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
