/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first iframe src as a link
  function extractEmbedUrl(el) {
    // Look for iframes
    const iframes = el.querySelectorAll('iframe');
    if (iframes.length > 0) {
      const src = iframes[0].getAttribute('src');
      if (src) {
        // Return as a link element
        const a = document.createElement('a');
        a.href = src;
        a.textContent = src;
        return a;
      }
    }
    // If no iframe, look for images that might be embeds (not typical, but fallback)
    const imgs = el.querySelectorAll('img');
    if (imgs.length > 0) {
      // Use the image src as a fallback embed (for aerial image)
      const src = imgs[0].getAttribute('src');
      if (src) {
        const a = document.createElement('a');
        a.href = src;
        a.textContent = src;
        return a;
      }
    }
    // Otherwise, no embed found
    return null;
  }

  // Try to find an embed URL in the element
  const embedLink = extractEmbedUrl(element);

  // Collect all visible text content from the element (for context)
  function extractTextContent(el) {
    // Get all text nodes, filter out empty/whitespace
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let text = '';
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim()) {
        text += node.textContent.trim() + ' ';
      }
    }
    return text.trim();
  }

  const textContent = extractTextContent(element);

  // Only create the block if we found an embed link
  if (embedLink) {
    const headerRow = ['Embed (embedSocial24)'];
    // If text content exists, include it in the cell with the link
    let cellContent;
    if (textContent) {
      cellContent = [embedLink, document.createTextNode(' ' + textContent)];
    } else {
      cellContent = [embedLink];
    }
    const tableRows = [headerRow, [cellContent]];
    const table = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(table);
  }
}
