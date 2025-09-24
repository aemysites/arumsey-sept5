/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image (first <img> in the block)
  function getBackgroundImage(el) {
    // Only return the first <img> that is not a UI icon
    const imgs = el.querySelectorAll('img');
    for (const img of imgs) {
      // Heuristic: background image is the first <img> in the outermost container
      // and is not an SVG icon (not .svg extension)
      if (!img.src.endsWith('.svg')) return img;
    }
    // fallback: if only SVGs, use the first
    return imgs[0] || null;
  }

  // Helper to get the main heading (h2 or h1)
  function getHeading(el) {
    return el.querySelector('h1, h2, h3');
  }

  // Helper to get all paragraphs (excluding those that are icon captions)
  function getParagraphs(el) {
    // Exclude paragraphs that are direct siblings of icon widgets
    const all = Array.from(el.querySelectorAll('p'));
    return all.filter(p => {
      // If previous sibling is an image widget, it's an icon caption
      const prev = p.parentElement.previousElementSibling;
      if (prev && prev.classList && prev.classList.contains('elementor-widget-image')) return false;
      // If parent is an icon-text pair, skip
      return true;
    });
  }

  // Helper to get CTA button
  function getCTA(el) {
    // Only pick the first <a> that is styled as a button
    const btn = el.querySelector('a.elementor-button, a[href*="matterport"], a[href*="sferica"]');
    return btn || null;
  }

  // Helper to get icon+caption pairs
  function getIconInstructionPairs(el) {
    // Find all image widgets that are SVGs (icons)
    const iconPairs = [];
    const iconWidgets = el.querySelectorAll('.elementor-widget-image');
    iconWidgets.forEach(widget => {
      const img = widget.querySelector('img');
      if (!img || !img.src.endsWith('.svg')) return;
      // Find the next .elementor-widget-text-editor sibling
      let next = widget.parentElement.nextElementSibling;
      if (next && next.classList.contains('elementor-widget-text-editor')) {
        const text = next.querySelector('p');
        if (text) {
          // Compose a div with icon and text
          const pairDiv = document.createElement('div');
          pairDiv.appendChild(img);
          pairDiv.appendChild(text);
          iconPairs.push(pairDiv);
        }
      }
    });
    return iconPairs;
  }

  // Compose table rows
  const headerRow = ['Hero (hero22)'];

  // Row 2: Background image (optional)
  const bgImg = getBackgroundImage(element);
  const row2 = [bgImg ? bgImg : ''];

  // Row 3: Title, subheading, paragraphs, icons, CTA
  const content = [];
  const heading = getHeading(element);
  if (heading) content.push(heading);
  const paragraphs = getParagraphs(element);
  paragraphs.forEach(p => content.push(p));
  // Add icon+instruction pairs
  const iconPairs = getIconInstructionPairs(element);
  if (iconPairs.length) {
    const iconsDiv = document.createElement('div');
    iconPairs.forEach(pair => iconsDiv.appendChild(pair));
    content.push(iconsDiv);
  }
  // Add CTA button (if present)
  const cta = getCTA(element);
  if (cta) content.push(cta);

  const row3 = [content.length ? content : ''];

  // Build table
  const cells = [headerRow, row2, row3];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
