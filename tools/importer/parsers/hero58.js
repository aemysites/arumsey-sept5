/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image
  function findBackgroundImage(el) {
    let bgUrl = '';
    if (el.hasAttribute('style')) {
      const style = el.getAttribute('style');
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (match) {
        bgUrl = match[1];
      }
    }
    if (!bgUrl) {
      const img = el.querySelector('img');
      if (img && img.src) {
        return img;
      }
    }
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      return img;
    }
    return null;
  }

  // Find background image from top-level element or its children
  let bgImg = findBackgroundImage(element);
  if (!bgImg) {
    const imgs = element.querySelectorAll('img');
    if (imgs.length > 0) {
      bgImg = imgs[0];
    }
  }

  // Find the main heading and content
  let heading = null;
  let contentElements = [];
  const children = Array.from(element.querySelectorAll(':scope > div'));
  for (const child of children) {
    const headingWidget = child.querySelector('.elementor-widget-heading .elementor-widget-container h1, .elementor-widget-heading .elementor-widget-container h2, .elementor-widget-heading .elementor-widget-container h3, .elementor-widget-heading .elementor-widget-container h4, .elementor-widget-heading .elementor-widget-container h5, .elementor-widget-heading .elementor-widget-container h6');
    if (headingWidget && !heading) {
      heading = headingWidget;
    }
    const textWidget = child.querySelector('.elementor-widget-text-editor .elementor-widget-container');
    if (textWidget) {
      contentElements.push(textWidget);
    }
  }
  if (!heading) {
    heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Compose content cell: heading + content
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }
  if (contentElements.length > 0) {
    contentCell.push(...contentElements);
  }

  // Always create 3 rows: header, image (optional/empty), content
  const headerRow = ['Hero (hero58)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
