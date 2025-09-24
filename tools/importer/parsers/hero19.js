/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the first direct image (background)
  function findBackgroundImage(el) {
    const img = el.querySelector(':scope > img');
    if (img) return img;
    // Fallback: look for data-hlx-background-image
    const bgUrl = el.getAttribute('data-hlx-background-image');
    if (bgUrl) {
      const urlMatch = bgUrl.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        const bgImg = document.createElement('img');
        bgImg.src = urlMatch[1];
        return bgImg;
      }
    }
    return null;
  }

  // Helper: Find heading (h2 or .elementor-heading-title)
  function findHeading(el) {
    return el.querySelector('h1, h2, .elementor-heading-title');
  }

  // Helper: Find address block (icon list + address)
  function findAddressBlock(el) {
    const iconList = el.querySelector('.elementor-widget-icon-list ul');
    const addressText = el.querySelector('.elementor-widget-text-editor p');
    if (iconList && addressText) {
      const frag = document.createDocumentFragment();
      frag.appendChild(iconList);
      frag.appendChild(addressText);
      return frag;
    }
    return null;
  }

  // Helper: Find all map links (Google Maps, Waze)
  function findMapLinks(el) {
    const links = [];
    el.querySelectorAll('.elementor-widget-icon-list ul a').forEach(a => links.push(a));
    return links;
  }

  // Helper: Find CTA button
  function findCTA(el) {
    return el.querySelector('a.elementor-button');
  }

  // Compose the table rows
  const headerRow = ['Hero (hero19)'];

  // Row 2: Background image
  const bgImg = findBackgroundImage(element);
  const bgRow = [bgImg ? bgImg : ''];

  // Row 3: Content block
  const content = [];
  const heading = findHeading(element);
  if (heading) content.push(heading);
  const addressBlock = findAddressBlock(element);
  if (addressBlock) content.push(addressBlock);
  const mapLinks = findMapLinks(element);
  if (mapLinks.length) content.push(...mapLinks);
  const cta = findCTA(element);
  if (cta) content.push(cta);

  const contentRow = [content.length ? content : ''];

  // Build the table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
