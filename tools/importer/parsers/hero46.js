/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children by class
  function findDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero46)'];

  // 2. Background image row (row 2)
  // Find the image inside the second child container
  let bgImg = null;
  const childContainers = element.querySelectorAll(':scope > div');
  if (childContainers.length > 1) {
    const imgContainer = childContainers[1];
    // Find the image element inside
    bgImg = imgContainer.querySelector('img');
  }
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content row (row 3): title, paragraphs, CTA button
  // The first child container has the text and button
  let contentEls = [];
  if (childContainers.length > 0) {
    const contentContainer = childContainers[0];
    // Heading
    const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentEls.push(heading);
    // Paragraphs
    const paragraphs = contentContainer.querySelectorAll('p');
    paragraphs.forEach(p => contentEls.push(p));
    // Button (CTA)
    const buttonLink = contentContainer.querySelector('a');
    if (buttonLink) contentEls.push(buttonLink);
  }
  const contentRow = [contentEls];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
