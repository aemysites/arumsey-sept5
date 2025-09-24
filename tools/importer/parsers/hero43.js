/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. HEADER ROW ---
  const headerRow = ['Hero (hero43)'];

  // --- 2. BACKGROUND IMAGE ROW ---
  // Prefer <img> direct child, else data-hlx-background-image
  let bgImg = null;
  const imgEl = element.querySelector(':scope > img');
  if (imgEl) {
    bgImg = imgEl;
  } else if (element.dataset.hlxBackgroundImage) {
    const urlMatch = element.dataset.hlxBackgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      const img = document.createElement('img');
      img.src = urlMatch[1];
      bgImg = img;
    }
  }
  const bgImgRow = [bgImg || ''];

  // --- 3. CONTENT ROW ---
  // Find heading, paragraphs, and preserve semantic structure
  // Heading
  const heading = element.querySelector('h2');
  // Paragraphs (may be multiple, preserve all)
  const textBlocks = [];
  if (heading) textBlocks.push(heading);
  // Find all text blocks inside .elementor-widget-text-editor
  const textEditors = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
  textEditors.forEach(te => {
    // Each may have multiple <p>
    Array.from(te.children).forEach(child => {
      if (child.tagName === 'P') {
        textBlocks.push(child);
      }
    });
  });

  // Compose content cell
  const contentRow = [textBlocks.length ? textBlocks : ''];

  // --- Assemble table ---
  const cells = [
    headerRow,
    bgImgRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
