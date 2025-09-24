/* global WebImporter */
export default function parse(element, { document }) {
  // Get the background image (the first <img> child)
  const bgImg = element.querySelector(':scope > img');

  // Compose content cell: Only include title, subheading, and CTA if present
  const contentCell = document.createElement('div');

  // Find the overlay card container (the green box)
  const overlayCard = element.querySelector('[data-hlx-imp-bgcolor]');
  if (overlayCard) {
    // Title: h2 inside overlayCard
    const title = overlayCard.querySelector('h2');
    if (title) contentCell.appendChild(title.cloneNode(true));
    // Subheading: first p or h4 after title
    let subheading = null;
    if (title) {
      let next = title.nextElementSibling;
      while (next && !subheading) {
        if ((next.tagName === 'P' || next.tagName === 'H4') && next.textContent.trim()) {
          subheading = next;
        }
        next = next.nextElementSibling;
      }
    }
    if (!subheading) {
      // fallback: first p or h4 in overlayCard
      subheading = overlayCard.querySelector('p, h4');
    }
    if (subheading && subheading !== title) {
      contentCell.appendChild(subheading.cloneNode(true));
    }
    // CTA: look for a link (a) in overlayCard
    const cta = overlayCard.querySelector('a');
    if (cta) contentCell.appendChild(cta.cloneNode(true));
  }

  // Table rows
  const headerRow = ['Hero (hero8)'];
  const imgRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imgRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
