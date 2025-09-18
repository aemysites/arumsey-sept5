/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name
  const headerRow = ['Hero (hero54)'];

  // 2. Background image row: Find first <img> if present, else empty string
  let backgroundImage = element.querySelector('img');
  const imageRow = [backgroundImage ? backgroundImage.cloneNode(true) : ''];

  // 3. Content row: Only headline, subheading, and CTA (not all technical data)
  const contentFragment = document.createElement('div');

  // Heading (from .elementor-widget-heading .elementor-widget-container)
  const headingWidget = element.querySelector('.elementor-widget-heading .elementor-widget-container');
  if (headingWidget) {
    const heading = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentFragment.appendChild(heading.cloneNode(true));
  }

  // Subheading and paragraph (from first .elementor-widget-text-editor .elementor-widget-container only)
  const textWidget = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textWidget) {
    // Only add the first <p> with content as subheading, and the next as paragraph if present
    const ps = Array.from(textWidget.querySelectorAll('p')).filter(p => p.textContent.trim() !== '');
    if (ps[0]) contentFragment.appendChild(ps[0].cloneNode(true));
    if (ps[1]) contentFragment.appendChild(ps[1].cloneNode(true));
  }

  // CTA: Look for <a> inside the first text widget
  let cta = textWidget ? textWidget.querySelector('a') : null;
  if (!cta) cta = element.querySelector('a');
  if (cta) {
    contentFragment.appendChild(cta.cloneNode(true));
  }

  // Always ensure 3 rows: header, image, content
  const rows = [headerRow, imageRow, [contentFragment.childNodes.length ? contentFragment : '']];
  while (rows.length < 3) rows.push(['']);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
