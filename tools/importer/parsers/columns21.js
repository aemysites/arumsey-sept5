/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main column containers
  const containers = Array.from(element.querySelectorAll(':scope > div'));

  // Prepare each column's content as a separate cell array
  const contentRow = [];

  // LEFT COLUMN: icon list and address (as one cell)
  if (containers[0]) {
    const leftInner = containers[0].querySelector('.e-con-inner');
    if (leftInner) {
      const leftColContent = [];
      Array.from(leftInner.children).forEach(child => {
        if (child.classList.contains('elementor-widget-icon-list')) {
          const iconList = child.querySelector('.elementor-icon-list-items');
          if (iconList) leftColContent.push(iconList.cloneNode(true));
        } else if (child.classList.contains('elementor-widget-text-editor')) {
          const addressContainer = child.querySelector('.elementor-widget-container');
          if (addressContainer) {
            Array.from(addressContainer.childNodes).forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
                leftColContent.push(node.cloneNode(true));
              }
            });
          }
        }
      });
      if (leftColContent.length) contentRow.push(leftColContent);
    }
  }

  // RIGHT COLUMN: all content in right column as a second cell
  if (containers[1]) {
    const rightInner = containers[1].querySelector('.e-con-inner');
    if (rightInner) {
      const rightColContent = [];
      Array.from(rightInner.children).forEach(child => {
        if (child.classList.contains('elementor-widget-text-editor')) {
          const listContainer = child.querySelector('.elementor-widget-container');
          if (listContainer) {
            Array.from(listContainer.childNodes).forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
                rightColContent.push(node.cloneNode(true));
              }
            });
          }
        }
      });
      if (rightColContent.length) contentRow.push(rightColContent);
    }
  }

  // Only add the row if there are at least 1 non-empty column (no empty columns)
  if (contentRow.length > 0) {
    const headerRow = ['Columns (columns21)'];
    const cells = [headerRow, contentRow];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
