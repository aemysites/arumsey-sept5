/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children divs
  const getChildrenDivs = (el) => Array.from(el.children).filter(child => child.tagName === 'DIV');

  // Get the inner .e-con-inner if present
  const inner = element.querySelector('.e-con-inner');
  const mainDivs = inner ? getChildrenDivs(inner) : getChildrenDivs(element);
  if (mainDivs.length < 2) return;

  // LEFT COLUMN: Address block
  const leftCol = mainDivs[0];
  let addressBlock = document.createElement('div');
  const leftInner = leftCol.querySelector('.e-con-inner');
  const leftInnerDivs = leftInner ? getChildrenDivs(leftInner) : getChildrenDivs(leftCol);
  leftInnerDivs.forEach(inner => {
    const iconList = inner.querySelector('.elementor-icon-list-items');
    if (iconList) addressBlock.appendChild(iconList.cloneNode(true));
    const addressText = inner.querySelector('.elementor-widget-text-editor p');
    if (addressText) addressBlock.appendChild(addressText.cloneNode(true));
  });

  // RIGHT COLUMN: List block
  const rightCol = mainDivs[1];
  let listBlock = document.createElement('div');
  const rightUl = rightCol.querySelector('ul');
  if (rightUl) listBlock.appendChild(rightUl.cloneNode(true));

  // Compose the table
  const headerRow = ['Columns (columns31)'];
  const contentRow = [addressBlock, listBlock];
  const rows = [headerRow, contentRow];

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
