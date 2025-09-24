/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  // --- LEFT COLUMN CONTENT ---
  // Find heading (h5)
  let heading = null;
  for (const d of topDivs) {
    const h = d.querySelector('h5');
    if (h) {
      heading = h;
      break;
    }
  }

  // Find intro paragraph
  let intro = null;
  for (const d of topDivs) {
    const p = d.querySelector('p');
    if (p && !intro) {
      intro = p;
      break;
    }
  }

  // Find all label/value pairs (Metragem, Tipologia, Nº de vagas)
  // Each is in a nested structure: label in one div, value in the next sibling div
  const specs = [];
  // Find all containers that may contain these pairs
  const specContainers = element.querySelectorAll('[data-element_type="container"]');
  for (const container of specContainers) {
    // Find label
    const labelDiv = container.querySelector('.elementor-widget-text-editor');
    if (labelDiv) {
      const labelP = labelDiv.querySelector('p');
      if (labelP && /Metragem|Tipologia|Nº de vagas/i.test(labelP.textContent)) {
        // Try to find value in the next sibling container
        let valueDiv = container.nextElementSibling;
        if (valueDiv) {
          const valueP = valueDiv.querySelector('p');
          if (valueP) {
            specs.push([labelP, valueP]);
          }
        }
      }
    }
  }

  // Find button (link)
  let button = null;
  for (const d of topDivs) {
    const a = d.querySelector('a.elementor-button');
    if (a) {
      button = a;
      break;
    }
  }

  // Compose left column
  const leftColumn = [];
  if (heading) leftColumn.push(heading);
  if (intro) leftColumn.push(intro);
  specs.forEach(([label, value]) => {
    leftColumn.push(label, value);
  });
  if (button) leftColumn.push(button);

  // --- RIGHT COLUMN CONTENT ---
  // Find carousel images (from .elementor-widget-media-carousel)
  let carouselDiv = null;
  for (const d of topDivs) {
    if (d.querySelector('.elementor-widget-media-carousel')) {
      carouselDiv = d.querySelector('.elementor-widget-media-carousel');
      break;
    }
  }
  let images = [];
  if (carouselDiv) {
    // Find all images inside swiper-slide
    const slides = carouselDiv.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
      // Only use slides that have an <img>
      const img = slide.querySelector('img');
      if (img) {
        images.push(img);
      }
    });
    // If none found, try fallback: images in .elementor-carousel-image
    if (images.length === 0) {
      const fallbackImgs = carouselDiv.querySelectorAll('.elementor-carousel-image img');
      images = Array.from(fallbackImgs);
    }
  }

  // Compose right column
  const rightColumn = images.length ? images : [];

  // --- TABLE CONSTRUCTION ---
  const headerRow = ['Columns (columns50)'];
  const contentRow = [leftColumn, rightColumn];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace element
  element.replaceWith(table);
}
