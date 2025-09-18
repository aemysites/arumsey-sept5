/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero22)'];

  // 2. Background image row: always include a row (empty if not found)
  let bgImg = '';
  let maxArea = 0;
  let bgImgEl = null;
  const imgs = Array.from(element.querySelectorAll('img'));
  imgs.forEach(img => {
    // Ignore SVG icons (by file extension or small size)
    if (img.src && !img.src.match(/icon|svg/i)) {
      let area = 0;
      if (img.naturalWidth && img.naturalHeight) {
        area = img.naturalWidth * img.naturalHeight;
      } else if (img.width && img.height) {
        area = img.width * img.height;
      }
      if (area > maxArea) {
        maxArea = area;
        bgImgEl = img;
      }
    }
  });
  if (bgImgEl) {
    bgImg = bgImgEl.cloneNode(true);
    // Remove bgImg from DOM so it doesn't appear in content cell
    bgImgEl.remove();
  } else {
    bgImg = '';
  }

  // 3. Content row: collect all content except background image
  const contentCell = document.createElement('div');

  // Collect the main heading
  const heading = element.querySelector('h2');
  if (heading) contentCell.appendChild(heading.cloneNode(true));

  // Collect all text-editor widgets (paragraphs, instructions)
  const textBlocks = element.querySelectorAll('.elementor-widget-text-editor');
  textBlocks.forEach(tb => {
    // Only add if not already present (avoid duplicate heading)
    const p = tb.querySelector('p');
    if (p && (!heading || p.textContent.trim() !== heading.textContent.trim())) {
      contentCell.appendChild(p.cloneNode(true));
    }
  });

  // Collect instruction icon+text pairs (skip if icon is the background image)
  const iconRows = element.querySelectorAll('.e-con-inner > .e-con-full');
  iconRows.forEach(row => {
    const img = row.querySelector('img');
    const txt = row.querySelector('.elementor-widget-text-editor p');
    // Only add if icon is not the background image
    if ((img && (!bgImgEl || img !== bgImgEl)) || txt) {
      const iconWrap = document.createElement('div');
      if (img && (!bgImgEl || img !== bgImgEl)) iconWrap.appendChild(img.cloneNode(true));
      if (txt) iconWrap.appendChild(txt.cloneNode(true));
      contentCell.appendChild(iconWrap);
    }
  });

  // Collect all CTA buttons
  const btns = element.querySelectorAll('.elementor-widget-button a');
  btns.forEach(btn => {
    contentCell.appendChild(btn.cloneNode(true));
  });

  // Compose the table rows: always 3 rows (header, bgImg, content)
  const rows = [headerRow, [bgImg], [contentCell]];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
