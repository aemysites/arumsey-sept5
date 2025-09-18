/* global WebImporter */
export default function parse(element, { document }) {
  // Table block name header
  const headerRow = ['Table (no header, tableNoHeader44)'];

  // Defensive: Find the loop grid container
  const loopGrid = element.querySelector('.elementor-loop-container');
  if (!loopGrid) return;

  // Each .e-loop-item is a row
  const rows = Array.from(loopGrid.querySelectorAll(':scope > .e-loop-item'));
  const tableRows = [];

  rows.forEach((rowEl) => {
    // 1. Year & Month (left column)
    const postInfo = rowEl.querySelector('.elementor-post-info');
    let yearMonth = '';
    if (postInfo) {
      const items = postInfo.querySelectorAll('.elementor-post-info__item');
      if (items.length >= 2) {
        yearMonth = `<strong>${items[0].textContent.trim()}</strong> ${items[1].textContent.trim()}`;
      } else {
        yearMonth = Array.from(items).map(i => i.textContent.trim()).join(' ');
      }
    }
    // Create left cell
    const leftCell = document.createElement('div');
    leftCell.innerHTML = yearMonth;

    // 2. Title (middle column)
    let titleCell;
    const titleWidget = rowEl.querySelector('.elementor-widget-heading .elementor-heading-title');
    if (titleWidget) {
      titleCell = titleWidget;
    } else {
      // fallback: try to find any h3
      const h3 = rowEl.querySelector('h3');
      titleCell = h3 || document.createElement('span');
    }

    // 3. Buttons (right column)
    // Find all .elementor-button-link in this row
    const buttons = Array.from(rowEl.querySelectorAll('.elementor-button-link'));
    // Place both buttons side by side in a div
    const btnCell = document.createElement('div');
    buttons.forEach(btn => btnCell.appendChild(btn));

    // Compose row
    tableRows.push([leftCell, titleCell, btnCell]);
  });

  // Compose final table data
  const cells = [headerRow, ...tableRows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
