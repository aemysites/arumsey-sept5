/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from video overlay
  function getBackgroundImageDiv() {
    // Find the video widget
    const videoWidget = Array.from(element.querySelectorAll(':scope > div')).find(div =>
      div.classList.contains('elementor-widget-video')
    );
    if (!videoWidget) return null;
    // Find overlay div
    const overlay = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
    if (!overlay) return null;
    // Try to get the background image URL
    const style = overlay.getAttribute('style') || '';
    const urlMatch = style.match(/url\(([^)]+)\)/);
    if (urlMatch && urlMatch[1]) {
      const img = document.createElement('img');
      img.src = urlMatch[1];
      img.alt = '';
      return img;
    }
    return null;
  }

  // Helper to extract heading, subheading, paragraph, and CTA
  function getContentElements() {
    const children = Array.from(element.querySelectorAll(':scope > div > .e-con-inner > div'));
    let heading = null;
    let paragraph = null;
    let cta = null;
    // Find heading
    heading = children.find(div => div.classList.contains('elementor-widget-heading'));
    // Find paragraph
    paragraph = children.find(div => div.classList.contains('elementor-widget-text-editor'));
    // Find CTA button
    cta = children.find(div => div.classList.contains('elementor-widget-button'));
    // Extract their content containers
    const headingContent = heading ? heading.querySelector('.elementor-widget-container') : null;
    const paragraphContent = paragraph ? paragraph.querySelector('.elementor-widget-container') : null;
    let ctaLink = null;
    if (cta) {
      const wrapper = cta.querySelector('.elementor-widget-container');
      if (wrapper) {
        ctaLink = wrapper.querySelector('a');
      }
    }
    // Assemble content array
    const content = [];
    if (headingContent) content.push(headingContent);
    if (paragraphContent) content.push(paragraphContent);
    if (ctaLink) content.push(ctaLink);
    return content;
  }

  // Build table rows
  const headerRow = ['Hero (hero3)'];
  const backgroundImg = getBackgroundImageDiv();
  const imageRow = [backgroundImg ? backgroundImg : ''];
  const contentRow = [getContentElements()];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
