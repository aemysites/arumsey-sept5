/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero47)'];

  // --- Row 2: Background image (optional) ---
  let bgImageUrl = null;
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/i);
  if (bgMatch) {
    bgImageUrl = bgMatch[1];
  }
  if (!bgImageUrl && element.hasAttribute('data-settings')) {
    try {
      const settings = JSON.parse(element.getAttribute('data-settings').replace(/&quot;/g, '"'));
      if (settings.background_image) {
        bgImageUrl = settings.background_image;
      }
    } catch (e) {}
  }
  let bgImgElem = null;
  if (bgImageUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImageUrl;
    bgImgElem.alt = '';
  }
  // Always include the background row (empty if no image)
  const bgRow = [bgImgElem ? bgImgElem : ''];

  // --- Row 3: Headline, subheading, CTA (call-to-action as text with a link only, no form) ---
  // Find all heading widgets and collect their text content
  let headingElems = [];
  let headingWidget = null;
  const widgets = Array.from(element.querySelectorAll(':scope .elementor-widget-heading'));
  if (widgets.length > 0) {
    headingWidget = widgets[0];
    const h = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) {
      // Split on <br> and create separate divs for each line
      const lines = h.innerHTML.split(/<br\s*\/?>(?![^<]*<\/)*?/i).map(line => line.trim()).filter(Boolean);
      lines.forEach((line) => {
        const div = document.createElement('div');
        div.innerHTML = line;
        headingElems.push(div);
      });
    }
  }

  // Find the form (call-to-action)
  // Only extract the button as CTA, not the entire form
  let ctaElem = null;
  const formWidget = Array.from(element.querySelectorAll(':scope form'));
  if (formWidget.length > 0) {
    const button = formWidget[0].querySelector('button[type="submit"]');
    if (button) {
      ctaElem = document.createElement('a');
      ctaElem.href = '#';
      ctaElem.textContent = button.textContent.trim();
    }
  }

  // Compose the third row cell
  const row3Content = [];
  headingElems.forEach(e => row3Content.push(e));
  if (ctaElem) row3Content.push(ctaElem);
  const thirdRow = [row3Content.length ? row3Content : ''];

  const cells = [
    headerRow,
    bgRow,
    thirdRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
