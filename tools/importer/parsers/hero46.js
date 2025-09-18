/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children with a selector
  const getDirectChildren = (el, selector) => Array.from(el.querySelectorAll(`:scope > ${selector}`));

  // Find the two main child containers (text and image)
  const containers = getDirectChildren(element, 'div');
  if (containers.length < 2) return; // Defensive: must have at least text and image

  // Find image (background image for row 2)
  let imageEl = null;
  // Defensive: look for image in the second container, fallback to any image in block
  const imageCandidates = containers[1].querySelectorAll('img');
  if (imageCandidates.length > 0) {
    imageEl = imageCandidates[0];
  } else {
    // fallback: any image in block
    imageEl = element.querySelector('img');
  }

  // Compose text content for row 3
  const textContainer = containers[0];
  // Find heading
  let heading = textContainer.querySelector('h1, h2, h3, h4, h5, h6');
  // Find paragraphs
  const paragraphs = Array.from(textContainer.querySelectorAll('p'));
  // Find button (call-to-action)
  let button = textContainer.querySelector('a');
  // Compose cell content for row 3
  const row3Content = [];
  if (heading) row3Content.push(heading);
  paragraphs.forEach(p => row3Content.push(p));
  if (button) row3Content.push(button);

  // Table rows
  const headerRow = ['Hero (hero46)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [row3Content];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
