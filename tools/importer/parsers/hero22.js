/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero22)'];

  // Background image: get first <img> in the block
  const bgImg = element.querySelector('img');
  const bgImgRow = [bgImg ? bgImg : ''];

  // Compose content cell for row 3: headline, subheading, CTA, and all relevant text
  const contentCell = [];

  // Headline (h1-h6)
  const headingEl = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (headingEl) contentCell.push(headingEl.cloneNode(true));

  // All paragraphs (including instructions and usage text)
  const paragraphs = Array.from(element.querySelectorAll('p'));
  paragraphs.forEach(p => {
    // Avoid duplicate if already included as subheading
    if (!contentCell.some(el => el.textContent === p.textContent)) {
      contentCell.push(p.cloneNode(true));
    }
  });

  // Any additional usage instructions in <div> or <span> (for flexibility)
  const extraText = Array.from(element.querySelectorAll('div, span'))
    .filter(el => el.childElementCount === 0 && el.textContent.trim().length > 0);
  extraText.forEach(el => {
    if (!contentCell.some(e => e.textContent === el.textContent)) {
      contentCell.push(document.createTextNode(el.textContent));
    }
  });

  // CTA buttons (a.elementor-button, or any <a> with href)
  const ctas = element.querySelectorAll('a[href]');
  ctas.forEach(a => {
    if (!contentCell.includes(a)) {
      contentCell.push(a.cloneNode(true));
    }
  });

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    [contentCell],
  ], document);

  element.replaceWith(table);
}
