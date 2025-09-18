/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find background image
  function findBackgroundImage(el) {
    let bgUrl = null;
    if (el.hasAttribute('style')) {
      const style = el.getAttribute('style');
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (match) bgUrl = match[1];
    }
    if (!bgUrl && el.dataset && el.dataset.settings) {
      try {
        const settings = JSON.parse(el.dataset.settings.replace(/&quot;/g, '"'));
        if (settings.background_image && settings.background_image.url) {
          bgUrl = settings.background_image.url;
        }
      } catch (e) {}
    }
    if (!bgUrl) {
      const img = el.querySelector('img');
      if (img && img.src) bgUrl = img.src;
    }
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      img.alt = '';
      return img;
    }
    return '';
  }

  // Helper: Compose content cell (more flexible, less specific selectors)
  function composeContentCell(el) {
    const content = [];
    // Headings (all levels)
    el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => content.push(h));
    // Paragraphs and text blocks
    el.querySelectorAll('p').forEach(p => {
      if (!content.includes(p)) content.push(p);
    });
    // Icon lists (address, links)
    el.querySelectorAll('.elementor-widget-icon-list').forEach(list => {
      if (!content.includes(list)) content.push(list);
    });
    // Buttons
    el.querySelectorAll('.elementor-widget-button').forEach(btn => {
      if (!content.includes(btn)) content.push(btn);
    });
    // If nothing found, fallback to all children
    if (content.length === 0) {
      Array.from(el.children).forEach(child => content.push(child));
    }
    return content;
  }

  const headerRow = ['Hero (hero19)'];
  const bgImg = findBackgroundImage(element);
  // Always output 3 rows: header, bg image (empty if none), content
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [composeContentCell(element)];
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
