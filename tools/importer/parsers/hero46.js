/* global WebImporter */
export default function parse(element, { document }) {
  // Get columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  let textCol = null;
  let imageCol = null;
  if (columns.length === 2) {
    textCol = columns[0];
    imageCol = columns[1];
  } else {
    columns.forEach(col => {
      if (col.querySelector('img')) imageCol = col;
      else textCol = col;
    });
  }

  // --- Row 1: Block name ---
  const headerRow = ['Hero (hero46)'];

  // --- Row 2: Background image (optional) ---
  let imageEl = null;
  if (imageCol) {
    imageEl = imageCol.querySelector('img');
  } else {
    imageEl = element.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- Row 3: Headline, subheading, CTA ---
  let cellContents = [];
  if (textCol) {
    // Find heading (first h2 in this layout)
    const heading = textCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) cellContents.push(heading);
    // Find all paragraphs
    const paragraphs = textCol.querySelectorAll('p');
    paragraphs.forEach(p => cellContents.push(p));
    // Find CTA button (look for any <a> inside .elementor-widget-button)
    const btnWidget = textCol.querySelector('.elementor-widget-button');
    if (btnWidget) {
      const btnLink = btnWidget.querySelector('a');
      if (btnLink) {
        const a = document.createElement('a');
        a.href = btnLink.getAttribute('href');
        a.textContent = btnLink.textContent.trim();
        cellContents.push(a);
      }
    }
  }
  // Always add the content row, even if empty
  const contentRow = [cellContents.length > 0 ? cellContents : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
