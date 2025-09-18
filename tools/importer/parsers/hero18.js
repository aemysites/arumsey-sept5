/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Hero (hero18)'];

  // Try to extract a background image from the parent section (not from style or data-settings)
  // Since the provided HTML is empty, but the screenshots show a background image, we must infer the image source
  // We'll check for a sibling <img> or use a placeholder if not found
  let bgImage = '';
  let imageCell = '';

  // Try to find an image in a previous sibling (if any)
  let prev = element.previousElementSibling;
  while (prev) {
    const img = prev.querySelector('img');
    if (img && img.src) {
      bgImage = img.src;
      break;
    }
    prev = prev.previousElementSibling;
  }

  // If not found, try to find an image in the document (first hero-like image)
  if (!bgImage) {
    const imgs = document.querySelectorAll('img');
    if (imgs.length > 0) {
      bgImage = imgs[0].src;
    }
  }

  if (bgImage) {
    const img = document.createElement('img');
    img.src = bgImage;
    imageCell = img;
  }

  // Extract all text content from the element (should be empty for provided HTML)
  let textCell = '';
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  let text = '';
  let node;
  while ((node = walker.nextNode())) {
    text += node.textContent.trim() + '\n';
  }
  text = text.trim();
  if (text) {
    textCell = text;
  }

  // Compose table
  const cells = [
    headerRow,
    [imageCell],
    [textCell],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
