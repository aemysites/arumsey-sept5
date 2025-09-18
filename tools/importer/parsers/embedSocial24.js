/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Embed (embedSocial24)'];

  // Try to find an iframe URL
  let embedUrl = '';
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    embedUrl = iframe.src;
  }

  // If no iframe, try to find any external embed link (e.g., <a> with adobe.ly or maps.google)
  if (!embedUrl) {
    const links = Array.from(element.querySelectorAll('a'));
    const externalLink = links.find(a =>
      a.href && (
        a.href.includes('twitter.com') ||
        a.href.includes('adobe.ly') ||
        a.href.includes('maps.google')
      )
    );
    if (externalLink) {
      embedUrl = externalLink.href;
    }
  }

  // If still no embedUrl, try to extract text content that looks like a URL
  if (!embedUrl) {
    const text = element.textContent;
    const urlMatch = text.match(/https?:\/\/[^\s)]+/);
    if (urlMatch) {
      embedUrl = urlMatch[0];
    }
  }

  // Fallback: if nothing found, use the full text content
  let embedCell;
  if (embedUrl) {
    const link = document.createElement('a');
    link.href = embedUrl;
    link.textContent = embedUrl;
    embedCell = link;
  } else {
    embedCell = element.textContent.trim();
  }

  const rows = [
    headerRow,
    [embedCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
