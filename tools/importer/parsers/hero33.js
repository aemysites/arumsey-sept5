/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero33)'];

  // --- Row 2: Background image (optional, must always be present as a row) ---
  let imageEl = element.querySelector('img');
  const imageRow = [imageEl ? imageEl : ''];

  // --- Row 3: Title, subheading, CTA ---
  let titleEl = null;
  let textEl = null;
  const children = Array.from(element.querySelectorAll(':scope > div'));
  children.forEach((child) => {
    // Heading widget
    const headingWidget = child.querySelector('.elementor-widget-heading');
    if (headingWidget && !titleEl) {
      titleEl = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
      if (titleEl) titleEl = titleEl.cloneNode(true);
    }
    // Text widget
    const textWidget = child.querySelector('.elementor-widget-text-editor');
    if (textWidget && !textEl) {
      const p = textWidget.querySelector('p');
      if (p) {
        // Clean up: remove all span tags, keep only textContent
        const cleanP = document.createElement('p');
        cleanP.textContent = p.textContent.trim();
        textEl = cleanP;
      }
    }
  });
  // Compose cell: array of elements (filter out nulls)
  const contentRow = [[titleEl, textEl].filter(Boolean)];

  // Build table: always 3 rows
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(table);
}
