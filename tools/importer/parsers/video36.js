/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract video URL from data-settings attribute
  function getYoutubeUrl(settingsStr) {
    try {
      const settings = JSON.parse(settingsStr.replace(/&quot;/g, '"'));
      if (settings.youtube_url) return settings.youtube_url;
    } catch (e) {}
    return null;
  }

  // Find the video widget element
  const videoWidget = element.querySelector('[data-widget_type="video.default"]');
  let videoUrl = null;
  let posterImg = null;
  let textContent = '';

  if (videoWidget) {
    // Extract video URL
    const settingsStr = videoWidget.getAttribute('data-settings');
    videoUrl = getYoutubeUrl(settingsStr);

    // Extract poster image (from overlay style)
    const overlay = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
    if (overlay) {
      // Get background-image URL
      const bgStyle = overlay.style.backgroundImage;
      const match = bgStyle.match(/url\(([^)]+)\)/);
      if (match && match[1]) {
        const imgUrl = match[1].replace(/['"]/g, '');
        posterImg = document.createElement('img');
        posterImg.src = imgUrl;
        posterImg.alt = '';
      }
      // Try to get any overlay text (e.g., title or label)
      // Look for direct text nodes or child elements with text
      textContent = overlay.textContent.trim();
    }
    // If overlay text is empty, try to get text from the video widget container
    if (!textContent) {
      const widgetContainer = videoWidget.querySelector('.elementor-widget-container');
      if (widgetContainer) {
        textContent = widgetContainer.textContent.trim();
      }
    }
  }

  // Compose the block table rows
  const headerRow = ['Video (video36)'];
  const contentRow = [];
  // Add poster image if available
  if (posterImg) contentRow.push(posterImg);
  // Add video link if available
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    contentRow.push(link);
  }
  // Add any text content if found
  if (textContent) {
    contentRow.push(textContent);
  }

  // If no video, image, or text, fallback to original element content
  if (contentRow.length === 0) {
    contentRow.push(element);
  }

  // Build the table
  const cells = [headerRow, [contentRow]];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
