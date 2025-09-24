/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero64)'];

  // --- BACKGROUND IMAGE ROW ---
  let bgImg = '';
  const bgAttr = element.getAttribute('data-hlx-background-image');
  if (bgAttr) {
    const match = bgAttr.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      bgImg = img;
    }
  } else {
    const imgEl = element.querySelector('img[src*="personalizacao-secao-video-bg.svg"]');
    if (imgEl) {
      bgImg = imgEl.cloneNode(true);
    }
  }
  const bgImgRow = [bgImg ? bgImg : ''];

  // --- CONTENT ROW ---
  const inner = element.querySelector('.e-con-inner');
  let contentEls = [];
  if (inner) {
    // Heading (h2)
    const heading = inner.querySelector('.elementor-widget-heading h2');
    if (heading) contentEls.push(heading.cloneNode(true));

    // All paragraphs (subheading, extra text)
    const textWidgets = inner.querySelectorAll('.elementor-widget-text-editor p');
    textWidgets.forEach(p => contentEls.push(p.cloneNode(true)));

    // Button (CTA)
    const button = inner.querySelector('.elementor-widget-button a');
    if (button) contentEls.push(button.cloneNode(true));
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // --- BUILD TABLE ---
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
