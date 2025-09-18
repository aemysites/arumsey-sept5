/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first image in the video overlay
  function getBackgroundImage(el) {
    // Find the image inside the video overlay
    const overlay = el.querySelector('.elementor-custom-embed-image-overlay');
    if (overlay) {
      const img = overlay.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Helper to get the heading
  function getHeading(el) {
    // Find the first h2 inside the heading widget
    const headingWidget = el.querySelector('.elementor-widget-heading');
    if (headingWidget) {
      const h2 = headingWidget.querySelector('h2');
      if (h2) return h2;
    }
    return null;
  }

  // Helper to get the paragraph/subheading
  function getSubheading(el) {
    // Find the first p inside the text editor widget
    const textWidget = el.querySelector('.elementor-widget-text-editor');
    if (textWidget) {
      const p = textWidget.querySelector('p');
      if (p) return p;
    }
    return null;
  }

  // Helper to get the CTA button
  function getCTA(el) {
    // Find the button link inside the button widget
    const buttonWidget = el.querySelector('.elementor-widget-button');
    if (buttonWidget) {
      const link = buttonWidget.querySelector('a');
      if (link) return link;
    }
    return null;
  }

  // Compose the table rows
  const headerRow = ['Hero (hero3)'];

  // Row 2: Background image (optional)
  const bgImg = getBackgroundImage(element);
  const row2 = [bgImg ? bgImg : ''];

  // Row 3: Title, subheading, CTA
  const heading = getHeading(element);
  const subheading = getSubheading(element);
  const cta = getCTA(element);
  // Compose content for row 3
  const row3Content = [];
  if (heading) row3Content.push(heading);
  if (subheading) row3Content.push(subheading);
  if (cta) row3Content.push(cta);
  const row3 = [row3Content.length ? row3Content : ''];

  // Build the table
  const cells = [headerRow, row2, row3];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
