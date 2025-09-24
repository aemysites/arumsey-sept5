/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero38)'];

  // --- BACKGROUND IMAGE ROW ---
  let bgImg = null;
  const imgs = element.querySelectorAll('img');
  if (imgs.length) {
    bgImg = Array.from(imgs).reduce((best, img) => {
      const w = parseInt(img.getAttribute('width') || '0', 10);
      return (!best || w > parseInt(best.getAttribute('width') || '0', 10)) ? img : best;
    }, null);
  }
  const imageRow = [bgImg ? bgImg : ''];

  // --- CONTENT ROW ---
  let heroArea = null;
  if (bgImg) {
    heroArea = bgImg.closest('div');
  } else {
    heroArea = element;
  }

  const contentCell = [];
  // Find all heading elements (h1, h2, h3, h4, h5, h6) inside heroArea
  const headingEls = heroArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headingEls.forEach(el => {
    contentCell.push(el);
  });
  // Find all paragraphs in heroArea (excluding breadcrumbs)
  const paraEls = heroArea.querySelectorAll('p');
  paraEls.forEach(el => {
    if (el.textContent.trim() && !(el.querySelector('a') && el.textContent.includes('>'))) {
      contentCell.push(el);
    }
  });
  // Find CTA links (button-like text) in heroArea
  const links = heroArea.querySelectorAll('a');
  for (const link of links) {
    if (link.textContent && /clique aqui|conheça as condições|saiba mais|comprar|contato/i.test(link.textContent)) {
      contentCell.push(link);
    }
  }

  // Only add the third row if there is actual content
  const cells = [
    headerRow,
    imageRow
  ];
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  // If less than 3 rows, pad with empty row to ensure 3 rows
  while (cells.length < 3) {
    cells.push(['']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
