/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Embed (embedSocial24)'];

  // Try to find a social embed URL (iframe src)
  let embedUrl = '';
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    embedUrl = iframe.src;
  } else {
    // If no iframe, try to find a direct link in the content
    // Look for <a> tags with hrefs that look like social or map embeds
    const links = Array.from(element.querySelectorAll('a'));
    const likelyEmbed = links.find(a => /twitter|facebook|instagram|maps\.google|youtube|vimeo|tiktok|linkedin|embed|\.ly|\.it|\.com\//i.test(a.href));
    if (likelyEmbed) {
      embedUrl = likelyEmbed.href;
    } else {
      // As a last resort, look for a background image URL that might be an embed
      const bg = element.getAttribute('data-hlx-background-image');
      if (bg && /^url\(["']?(.*?)["']?\)$/i.test(bg)) {
        embedUrl = bg.match(/^url\(["']?(.*?)["']?\)$/i)[1];
      }
    }
  }

  // Compose the table rows
  const rows = [headerRow, [embedUrl]];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
