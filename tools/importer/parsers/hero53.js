/* global WebImporter */
export default function parse(element, { document }) {
  // Extract first image for background
  const bgImg = element.querySelector('img');
  const backgroundRow = [bgImg ? bgImg : ''];

  // Find the main content container (with heading, address, links, button)
  const contentDiv = Array.from(element.children).find(
    (el) => el.tagName === 'DIV' && el.querySelector('h2, h1, .elementor-button, ul, p')
  );

  let contentCell;
  if (contentDiv) {
    // Collect heading
    const heading = contentDiv.querySelector('h1, h2, h3');
    // Collect paragraphs
    const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
    // Collect icon lists (addresses, links)
    const iconLists = Array.from(contentDiv.querySelectorAll('ul'));
    // Collect button
    const button = contentDiv.querySelector('.elementor-button, a.elementor-button');

    // Compose content cell as a single array (for one column)
    const cellContent = [];
    if (heading) cellContent.push(heading);
    iconLists.forEach((ul) => cellContent.push(ul));
    paragraphs.forEach((p) => cellContent.push(p));
    if (button) cellContent.push(button);
    contentCell = [cellContent]; // single cell in array for 1-column row
  } else {
    contentCell = [[contentDiv || element]];
  }

  // Table rows
  const headerRow = ['Hero (hero53)'];

  // Build table: each row is an array with ONE cell
  const cells = [
    headerRow,
    backgroundRow,
    [contentCell.flat()], // ensure single cell in array for content row
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
