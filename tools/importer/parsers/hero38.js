/* global WebImporter */
export default function parse(element, { document }) {
  // Get the background image (desktop preferred)
  function getHeroImage() {
    // Try to find the desktop image first
    let img = element.querySelector('img');
    if (img) return img.cloneNode(true);
    return '';
  }

  // Get all text content that visually appears in the hero area
  function getHeroTextCell() {
    // Find all headings and paragraphs in the hero area
    // We'll look for h1, h2, h3, strong, b, p, and any CTA links
    const cell = document.createElement('div');

    // Headings
    const h1 = element.querySelector('h1');
    if (h1) cell.appendChild(h1.cloneNode(true));

    // Subheadings (h2, h3, strong, b)
    const subheadings = element.querySelectorAll('h2, h3, strong, b');
    subheadings.forEach(sub => {
      // Avoid duplicating h1
      if (!h1 || sub !== h1) cell.appendChild(sub.cloneNode(true));
    });

    // Paragraphs
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach(p => {
      cell.appendChild(p.cloneNode(true));
    });

    // CTA links (look for visually prominent links/buttons)
    const ctaLink = Array.from(element.querySelectorAll('a')).find(a => {
      const txt = a.textContent.trim().toLowerCase();
      return txt.includes('clique') || txt.includes('conheça') || txt.includes('saiba') || txt.includes('whatsapp');
    });
    if (ctaLink) cell.appendChild(ctaLink.cloneNode(true));

    return cell.childNodes.length ? cell : '';
  }

  const headerRow = ['Hero (hero38)'];
  const imageRow = [getHeroImage()];
  const textRow = [getHeroTextCell()];

  const cells = [headerRow, imageRow, textRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
