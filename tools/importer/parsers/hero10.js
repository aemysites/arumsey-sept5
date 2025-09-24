/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  const getImmediateDivs = (el) => Array.from(el.querySelectorAll(':scope > div'));

  // Find the main inner content container
  let inner = element.querySelector('.e-con-inner') || element;
  let row2Img = null;
  let row3Content = [];

  // Defensive: find all direct children of inner
  const innerDivs = getImmediateDivs(inner);

  // Find image for row 2
  for (const div of innerDivs) {
    // Look for image widget
    const imgWidget = div.querySelector('.elementor-widget-image img');
    if (imgWidget) {
      row2Img = imgWidget;
      break;
    }
  }

  // Find heading and paragraph for row 3
  for (const div of innerDivs) {
    // Heading widget
    const headingWidget = div.querySelector('.elementor-widget-heading .elementor-widget-container');
    if (headingWidget) {
      // Use the heading element directly
      const heading = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        row3Content.push(heading);
      }
    }
    // Text widget
    const textWidget = div.querySelector('.elementor-widget-text-editor .elementor-widget-container');
    if (textWidget) {
      // Find all paragraphs inside
      const paragraphs = Array.from(textWidget.querySelectorAll('p'));
      row3Content.push(...paragraphs);
    }
  }

  // Build the table rows
  const headerRow = ['Hero (hero10)'];
  const row2 = [row2Img ? row2Img : ''];
  const row3 = [row3Content.length ? row3Content : ''];

  const cells = [headerRow, row2, row3];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
