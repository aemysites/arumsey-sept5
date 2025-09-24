/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const headerRow = ['Hero (hero3)'];

  // --- ROW 2: Background Image (optional) ---
  // Find video overlay image
  let bgImg = null;
  const videoWidget = element.querySelector('.elementor-widget-video');
  if (videoWidget) {
    const overlayImg = videoWidget.querySelector('.elementor-custom-embed-image-overlay img');
    if (overlayImg) {
      bgImg = overlayImg.cloneNode(true);
    }
  }

  // --- ROW 3: Title, Subheading, CTA ---
  // Heading
  let heading = null;
  const headingWidget = element.querySelector('.elementor-widget-heading h2');
  if (headingWidget) {
    heading = headingWidget.cloneNode(true);
  }
  // Paragraph
  let paragraph = null;
  const paragraphWidget = element.querySelector('.elementor-widget-text-editor p');
  if (paragraphWidget) {
    paragraph = paragraphWidget.cloneNode(true);
  }
  // Button
  let button = null;
  const buttonWidget = element.querySelector('.elementor-widget-button a');
  if (buttonWidget) {
    button = buttonWidget.cloneNode(true);
  }

  // Compose cell for text/cta row
  const textCtaContent = [];
  if (heading) textCtaContent.push(heading);
  if (paragraph) textCtaContent.push(paragraph);
  if (button) textCtaContent.push(button);

  // Build table rows
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [textCtaContent.length ? textCtaContent : '']
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
