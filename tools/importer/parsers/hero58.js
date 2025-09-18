/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image (first <img> child or data-hlx-background-image)
  let bgImgEl = element.querySelector('img');
  if (!bgImgEl) {
    const bgUrl = element.getAttribute('data-hlx-background-image');
    if (bgUrl) {
      const m = bgUrl.match(/url\(["']?([^"')]+)["']?\)/);
      if (m && m[1]) {
        bgImgEl = document.createElement('img');
        bgImgEl.src = m[1];
      }
    }
  }

  // Find the card with the main heading and supporting text
  let contentCell = document.createElement('div');
  let card = element.querySelector('.elementor-element-7b185018');
  if (card) {
    // Only include heading(s) and first paragraph for hero block
    const heading = card.querySelector('h2, h3, h4, h5, h6');
    if (heading) contentCell.appendChild(heading.cloneNode(true));
    const firstP = card.querySelector('p');
    if (firstP) contentCell.appendChild(firstP.cloneNode(true));
  }

  const headerRow = ['Hero (hero58)'];
  const imageRow = [bgImgEl || ''];
  const contentRow = [contentCell.innerHTML ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
