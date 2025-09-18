/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column (form & heading) and the image column
  let formCol = null;
  let imageCol = null;

  // Use less specific selectors to ensure we capture all relevant content
  const containers = Array.from(element.querySelectorAll(':scope > div'));
  for (const div of containers) {
    // Find the column with heading and form
    if (!formCol && div.querySelector('form')) {
      formCol = div;
    }
    // Find the column with images
    if (!imageCol && div.querySelector('img')) {
      imageCol = div;
    }
  }

  // Defensive fallback: use first two containers if not found
  if (!formCol && containers.length > 0) formCol = containers[0];
  if (!imageCol && containers.length > 1) imageCol = containers[1];

  // --- Column 1: Collect all visible content (heading + form) ---
  let col1Content = [];
  if (formCol) {
    // Get all heading elements (h1, h2, etc.)
    const headings = formCol.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => col1Content.push(h.cloneNode(true)));
    // Get the form
    const form = formCol.querySelector('form');
    if (form) {
      // Clone the form so we can manipulate it safely
      const formClone = form.cloneNode(true);
      // Convert all iframes (and any non-img elements with src) to links
      formClone.querySelectorAll('[src]:not(img)').forEach((el) => {
        const link = document.createElement('a');
        link.href = el.src;
        link.textContent = el.src;
        el.replaceWith(link);
      });
      col1Content.push(formClone);
    }
  }

  // --- Column 2: Collect all visible images ---
  let col2Content = [];
  if (imageCol) {
    const images = Array.from(imageCol.querySelectorAll('img'));
    images.forEach(img => {
      col2Content.push(img.cloneNode(true));
    });
  }

  // Ensure all text content from the source html is included
  // If there is additional text outside headings and form, include it
  if (formCol) {
    Array.from(formCol.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        col1Content.unshift(document.createTextNode(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE &&
                 !['FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.tagName) &&
                 node.textContent.trim()) {
        col1Content.unshift(node.cloneNode(true));
      }
    });
  }

  const headerRow = ['Columns (columns34)'];
  const columnsRow = [col1Content, col2Content];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
