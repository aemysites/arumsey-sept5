/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find a background image in the element (none in this HTML)
  function findBackgroundImage(el) {
    // Try to find an <img> or inline background style
    // In this HTML, there is no image, so return null
    return null;
  }

  // Helper to collect only heading, subheading, and CTA (not all form fields)
  function getContentBlock(el) {
    // Find the heading
    let heading = null;
    const headingWidget = el.querySelector('.elementor-widget-heading h2');
    if (headingWidget) {
      heading = headingWidget.cloneNode(true);
    } else {
      heading = el.querySelector('h2')?.cloneNode(true);
    }

    // Find subheading (if any)
    let subheading = null;
    // Try to find a subheading: look for a p or h3/h4 after the heading
    if (headingWidget && headingWidget.parentElement) {
      let sib = headingWidget.parentElement.nextElementSibling;
      while (sib) {
        if (sib.matches('h3, h4, h5, h6, p')) {
          subheading = sib.cloneNode(true);
          break;
        }
        sib = sib.nextElementSibling;
      }
    }

    // Find call-to-action (button)
    let cta = null;
    const form = el.querySelector('form');
    if (form) {
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        cta = document.createElement('a');
        cta.textContent = button.textContent.trim();
        cta.href = '#';
      }
    }

    // Compose content block
    const contentBlock = document.createElement('div');
    if (heading) contentBlock.appendChild(heading);
    if (subheading) contentBlock.appendChild(subheading);
    if (cta) contentBlock.appendChild(cta);
    return contentBlock;
  }

  // Compose table rows
  const headerRow = ['Hero (hero55)'];
  const bgImage = findBackgroundImage(element); // always null for this HTML
  // Always ensure 3 rows: header, bg image (empty if none), content
  const cells = [
    headerRow,
    [bgImage ? bgImage : ''], // background image row (empty)
    [''], // content row placeholder
  ];
  const contentBlock = getContentBlock(element);
  cells[2] = [contentBlock]; // third row is content

  // Build table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
