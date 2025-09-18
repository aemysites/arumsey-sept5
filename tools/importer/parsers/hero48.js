/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER ROW
  const headerRow = ['Hero (hero48)'];

  // 2. BACKGROUND IMAGE ROW
  // Find the first <img> direct child (background image)
  const bgImg = Array.from(element.children).find(el => el.tagName === 'IMG');
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. CONTENT ROW - STRICTLY ONLY HEADING + PARAGRAPHS (NO ACCORDION, NO DIVIDER)
  // Find all headings and paragraphs NOT inside <details> or divider widgets
  const contentEls = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6, p'));
  const filteredEls = contentEls.filter(el => {
    // Exclude if inside <details> or divider
    let parent = el.parentElement;
    while (parent && parent !== element) {
      if (parent.tagName === 'DETAILS') return false;
      if (parent.classList.contains('elementor-widget-divider')) return false;
      parent = parent.parentElement;
    }
    return true;
  });
  let contentCell = '';
  if (filteredEls.length) {
    const frag = document.createElement('div');
    filteredEls.forEach(el => frag.appendChild(el.cloneNode(true)));
    contentCell = frag;
  }
  const contentRow = [contentCell];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
