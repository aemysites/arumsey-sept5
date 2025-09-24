/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find background image from style or child img
  function findBackgroundImage(el) {
    let bgUrl = '';
    if (el.hasAttribute('data-hlx-background-image')) {
      const attr = el.getAttribute('data-hlx-background-image');
      const match = attr.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) bgUrl = match[1];
    }
    if (!bgUrl && el.hasAttribute('style')) {
      const style = el.getAttribute('style');
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (match) bgUrl = match[1];
    }
    if (!bgUrl) {
      const img = el.querySelector('img');
      if (img) return img.cloneNode(true);
    }
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      return img;
    }
    return null;
  }

  // Find background image from top-level element or children
  let bgImg = null;
  bgImg = findBackgroundImage(element);
  if (!bgImg) {
    const containers = element.querySelectorAll(':scope > div');
    for (const c of containers) {
      bgImg = findBackgroundImage(c);
      if (bgImg) break;
    }
  }

  // Find heading and all text content for hero block only (not technical details)
  let contentCell = [];
  // Heading
  const headingWidget = element.querySelector('.elementor-widget-heading .elementor-widget-container h2');
  if (headingWidget) {
    contentCell.push(headingWidget.cloneNode(true));
  }
  // Include ALL .elementor-widget-text-editor .elementor-widget-container children (not just first)
  const textWidgets = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
  textWidgets.forEach((widget) => {
    Array.from(widget.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        contentCell.push(node.cloneNode(true));
      }
    });
  });
  // Do NOT include accordion/specification content in hero block

  // Table rows
  const headerRow = ['Hero (hero48)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell.length ? contentCell : ''];
  const cells = [headerRow, imageRow, contentRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
