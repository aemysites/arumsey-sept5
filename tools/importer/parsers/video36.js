/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the video URL from data-settings attribute
  let videoUrl = null;
  let posterImg = null;
  let extraText = '';

  // Find the widget with data-settings
  const videoWidget = element.querySelector('[data-widget_type="video.default"]');
  if (videoWidget) {
    // Parse data-settings JSON
    try {
      const settingsStr = videoWidget.getAttribute('data-settings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        if (settings.youtube_url) {
          videoUrl = settings.youtube_url;
        }
        if (settings.image_overlay && settings.image_overlay.url) {
          // Find the actual <img> element to use as poster
          const overlayImg = videoWidget.querySelector('img[src]');
          if (overlayImg) {
            posterImg = overlayImg;
          }
        }
      }
    } catch (e) {
      // Fallback: Try to find a <iframe> or <a> with video URL
      // Not needed for this structure
    }
    // Extract any visible text from the videoWidget (e.g. overlay text)
    // Use less specific selector to get all text
    const widgetTexts = Array.from(videoWidget.querySelectorAll('*'))
      .map(el => el.textContent.trim())
      .filter(Boolean);
    if (widgetTexts.length) {
      extraText = widgetTexts.join(' ');
    }
  }

  // Fallback: Try to find an <iframe> with src if no videoUrl
  if (!videoUrl) {
    const iframe = element.querySelector('iframe[src]');
    if (iframe) {
      videoUrl = iframe.src;
    }
  }

  // Build the cell content: poster image (if any) + text + video link
  const cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (extraText) {
    cellContent.push(document.createElement('br'));
    cellContent.push(extraText);
  }
  if (videoUrl) {
    cellContent.push(document.createElement('br'));
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  // Table rows
  const headerRow = ['Video (video36)'];
  const contentRow = [cellContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
