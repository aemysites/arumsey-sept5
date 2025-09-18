/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row: get the first child <img> only
  const bgImg = Array.from(element.children).find(child => child.tagName === 'IMG');
  const bgRow = [bgImg ? bgImg : ''];

  // 3. Content row: extract heading, all paragraphs, all lists, and all CTAs (buttons/links)
  // Find the innermost content container
  let contentContainer = element;
  let foundDeeper = true;
  while (foundDeeper) {
    const onlyDiv = Array.from(contentContainer.children).filter(c => c.tagName === 'DIV');
    if (onlyDiv.length === 1) {
      contentContainer = onlyDiv[0];
    } else {
      foundDeeper = false;
    }
  }

  // Collect relevant content in order of appearance
  const contentEls = [];
  // Headings
  const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) contentEls.push(heading.cloneNode(true));
  // Paragraphs
  contentContainer.querySelectorAll('p').forEach(p => {
    if (p.textContent.trim()) contentEls.push(p.cloneNode(true));
  });
  // Icon lists (ul)
  contentContainer.querySelectorAll('ul').forEach(ul => {
    if (ul.textContent.trim()) contentEls.push(ul.cloneNode(true));
  });
  // Buttons/CTAs
  contentContainer.querySelectorAll('a.elementor-button, .elementor-button-wrapper a, a.elementor-button-link').forEach(a => {
    contentEls.push(a.cloneNode(true));
  });

  // Remove duplicates (e.g., if a button is inside a ul or div)
  const seen = new Set();
  const filteredContent = contentEls.filter(el => {
    const html = el.outerHTML;
    if (seen.has(html)) return false;
    seen.add(html);
    return true;
  });

  // Compose content cell
  const contentRow = [filteredContent.length === 1 ? filteredContent[0] : filteredContent];

  // Compose table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
