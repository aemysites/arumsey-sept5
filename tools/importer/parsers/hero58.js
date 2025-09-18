/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero58)'];

  // --- BACKGROUND IMAGE ROW ---
  let backgroundImg = '';
  let bgUrl = '';
  // Try to find background image from inline style
  if (element.style && element.style.backgroundImage) {
    const match = element.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) bgUrl = match[1];
  }
  // If not found, look for descendant img
  if (!bgUrl) {
    const img = element.querySelector('img');
    if (img) backgroundImg = img.cloneNode(true);
  } else {
    const imgEl = document.createElement('img');
    imgEl.src = bgUrl;
    imgEl.alt = '';
    backgroundImg = imgEl;
  }

  // --- CONTENT ROW ---
  // Find the main heading (h2 or h1) and all following paragraphs, lists, and links in the same widget container
  let title = '';
  let subheading = '';
  let cta = '';
  let contentCell = [];

  // Find the first heading (h1 or h2)
  let heading = element.querySelector('h1, h2');
  if (heading) {
    title = heading.cloneNode(true);
    // Find the widget container for the heading
    const widgetContainer = heading.closest('.elementor-widget-container');
    if (widgetContainer) {
      let foundHeading = false;
      widgetContainer.childNodes.forEach(node => {
        if (node === heading) {
          foundHeading = true;
        } else if (foundHeading && node.nodeType === Node.ELEMENT_NODE) {
          if (!subheading && (node.tagName === 'P' || node.tagName.match(/^H[3-6]$/))) {
            subheading = node.cloneNode(true);
          } else if (!cta && node.tagName === 'A') {
            cta = node.cloneNode(true);
          }
        }
      });
    }
  }
  // Compose content cell
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // Fallback: If nothing found, get all text content from first .elementor-widget-container
  if (contentCell.length === 0) {
    const firstWidget = element.querySelector('.elementor-widget-container');
    if (firstWidget) {
      firstWidget.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,ul,ol').forEach(node => {
        contentCell.push(node.cloneNode(true));
      });
    }
  }

  // Always output 3 rows: header, background image (optional), content
  const rows = [headerRow];
  rows.push([backgroundImg || '']);
  rows.push([contentCell.length ? contentCell : '']);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
