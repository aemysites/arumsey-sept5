/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the main hero image (desktop preferred)
  function findHeroImage() {
    // Prefer desktop image
    const desktopImg = element.querySelector('img[src*="desktop"]');
    if (desktopImg) return desktopImg;
    // Fallback: first image
    const img = element.querySelector('img');
    return img || null;
  }

  // Helper: get all heading and text nodes in the hero area
  function extractHeroTextContent() {
    // Try to find the main heading
    let heading = element.querySelector('h1, h2, h3');
    if (!heading) {
      // Sometimes heading is styled differently, fallback to strong/b tags
      heading = element.querySelector('strong, b');
    }
    // Find all text blocks that are visually grouped with the hero
    // We'll look for heading, subheading, and paragraphs near the heading
    const content = [];
    if (heading) {
      content.push(heading);
      let next = heading.nextElementSibling;
      while (next) {
        // Accept h2, h3, h4, p, strong, b, span
        if (["h2","h3","h4","p","strong","b","span","div"].includes(next.tagName.toLowerCase())) {
          // Only add if it contains text
          if (next.textContent.trim().length > 0) {
            content.push(next);
          }
        }
        next = next.nextElementSibling;
      }
    } else {
      // Fallback: get first non-empty text block
      const fallback = element.querySelector('p, div, span');
      if (fallback && fallback.textContent.trim().length > 0) {
        content.push(fallback);
      }
    }
    // Also look for a CTA button or link (with visible text)
    const cta = Array.from(element.querySelectorAll('a, button')).find(a => a.textContent.trim().length > 0 && !a.querySelector('img'));
    if (cta && !content.includes(cta)) {
      content.push(cta);
    }
    return content;
  }

  // --- Collect block content ---
  const headerRow = ['Hero (hero38)'];

  // Row 2: background image (optional)
  const heroImg = findHeroImage();
  const row2 = [heroImg ? heroImg : ''];

  // Row 3: all text content (title, subheading, paragraph, CTA)
  const heroContent = extractHeroTextContent();
  const row3 = [heroContent.length ? heroContent : ''];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row2,
    row3,
  ], document);

  element.replaceWith(table);
}
