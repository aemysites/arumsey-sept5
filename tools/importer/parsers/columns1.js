/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: find the image column and the content column
  let imgCol, contentCol;
  // There are two main children: first is the image, second is the content
  if (topDivs.length === 2) {
    [imgCol, contentCol] = topDivs;
  } else {
    // fallback: try to find by structure
    imgCol = element.querySelector('.elementor-widget-image');
    contentCol = element.querySelector('.e-flex, .e-con-full');
  }

  // Get image element from imgCol
  let imgEl = null;
  if (imgCol) {
    imgEl = imgCol.querySelector('img');
  }

  // Get content elements from contentCol
  let headingEl = null, textEls = [], buttonEl = null;
  if (contentCol) {
    headingEl = contentCol.querySelector('h2, h1, h3, h4, h5, h6');
    // All paragraphs in the text editor
    const textEditor = contentCol.querySelector('.elementor-widget-text-editor');
    if (textEditor) {
      textEls = Array.from(textEditor.querySelectorAll('p'));
    }
    // Button
    const btnWrap = contentCol.querySelector('.elementor-button-wrapper');
    if (btnWrap) {
      buttonEl = btnWrap.querySelector('a');
    }
  }

  // Compose the right column: heading, paragraphs, button
  const rightCol = [];
  if (headingEl) rightCol.push(headingEl);
  if (textEls.length) rightCol.push(...textEls);
  if (buttonEl) rightCol.push(buttonEl);

  // Compose the table
  const headerRow = ['Columns (columns1)'];
  const contentRow = [imgEl, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
