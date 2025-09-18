/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children divs
  const topDivs = element.querySelectorAll(':scope > div');

  // Defensive: find the inner content container
  let innerContainer = null;
  for (const div of topDivs) {
    if (div.classList.contains('e-con-inner')) {
      innerContainer = div;
      break;
    }
  }
  if (!innerContainer) return;

  // There are two main child containers: left (text), right (image)
  const childContainers = innerContainer.querySelectorAll(':scope > div');

  // Find text container (contains heading and paragraph)
  let textContainer = null;
  let imageContainer = null;
  if (childContainers.length === 2) {
    // Usually left is text, right is image
    textContainer = childContainers[0];
    imageContainer = childContainers[1];
  } else {
    // Defensive: fallback to search by content
    childContainers.forEach(div => {
      if (div.querySelector('h1, h2, h3, h4, h5, h6, p')) {
        textContainer = div;
      } else if (div.querySelector('img')) {
        imageContainer = div;
      }
    });
  }

  // Extract image element for row 2
  let imageEl = null;
  if (imageContainer) {
    const imgWidget = imageContainer.querySelector('.elementor-widget-image');
    if (imgWidget) {
      imageEl = imgWidget.querySelector('img');
    } else {
      imageEl = imageContainer.querySelector('img');
    }
  }

  // Extract heading and paragraph for row 3
  let headingEl = null;
  let paragraphEls = [];
  if (textContainer) {
    // Heading
    const headingWidget = textContainer.querySelector('.elementor-widget-heading');
    if (headingWidget) {
      headingEl = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
    } else {
      headingEl = textContainer.querySelector('h1, h2, h3, h4, h5, h6');
    }
    // Paragraphs
    const textWidget = textContainer.querySelector('.elementor-widget-text-editor');
    if (textWidget) {
      const widgetContainer = textWidget.querySelector('.elementor-widget-container');
      if (widgetContainer) {
        paragraphEls = Array.from(widgetContainer.querySelectorAll('p')).filter(p => p.textContent.trim());
      }
    } else {
      paragraphEls = Array.from(textContainer.querySelectorAll('p')).filter(p => p.textContent.trim());
    }
  }

  // Compose table rows
  const headerRow = ['Hero (hero10)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose text row: heading + paragraphs
  const textRowContent = [];
  if (headingEl) textRowContent.push(headingEl);
  if (paragraphEls.length) textRowContent.push(...paragraphEls);
  const textRow = [textRowContent.length ? textRowContent : ''];

  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
