/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image (first direct child <img>)
  const bgImg = element.querySelector(':scope > img');

  // Extract all heading and text content from the heading widget
  let headingContent = [];
  const headingWidget = element.querySelector('.elementor-widget-heading');
  if (headingWidget) {
    const headingContainer = headingWidget.querySelector('.elementor-widget-container');
    if (headingContainer) {
      headingContent = Array.from(headingContainer.childNodes).map(node => node.cloneNode(true));
    }
  }

  // Extract only the main call-to-action button (not the whole form)
  let ctaButton = null;
  const formWidget = element.querySelector('.elementor-widget-formidable');
  if (formWidget) {
    const container = formWidget.querySelector('.elementor-widget-container');
    if (container) {
      const button = container.querySelector('button[type="submit"]');
      if (button) {
        ctaButton = button.cloneNode(true);
      }
    }
  }

  // Compose the content cell for row 3: heading + CTA button
  const contentCell = [];
  if (headingContent.length) contentCell.push(...headingContent);
  if (ctaButton) contentCell.push(ctaButton);

  // Build the table rows
  const headerRow = ['Hero (hero47)'];
  const bgImgRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
