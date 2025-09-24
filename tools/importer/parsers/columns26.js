/* global WebImporter */
export default function parse(element, { document }) {
  // Find all containers that represent columns (deep search for all columns)
  const columnContainers = Array.from(element.querySelectorAll(
    '.elementor-element.e-con-full.e-flex.e-con.e-child'
  ))
    // Only keep containers that have at least one h2 that's not just a number
    .filter(container => {
      const h2s = container.querySelectorAll('h2');
      return Array.from(h2s).some(h2 => !/^\d+$/.test(h2.textContent.trim()));
    });

  // Use a Set to track unique column titles to avoid duplicates
  const seenTitles = new Set();
  const columns = [];

  columnContainers.forEach((container) => {
    // Find number (h2 with only digits)
    const numberEl = Array.from(container.querySelectorAll('h2')).find(h2 => /^\d+$/.test(h2.textContent.trim()));
    // Find title (h2 that's not just a number)
    const titleEl = Array.from(container.querySelectorAll('h2')).find(h2 => !/^\d+$/.test(h2.textContent.trim()));
    // Find description (first <p> inside .elementor-widget-text-editor)
    const descEl = container.querySelector('.elementor-widget-text-editor p');

    // Only add if we haven't already seen this title
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    if (titleText && !seenTitles.has(titleText)) {
      seenTitles.add(titleText);
      const cellContent = [];
      if (numberEl) cellContent.push(numberEl.cloneNode(true));
      if (titleEl) cellContent.push(titleEl.cloneNode(true));
      if (descEl) cellContent.push(descEl.cloneNode(true));
      columns.push(cellContent);
    }
  });

  // Build the table rows: header and one row with all columns
  const headerRow = ['Columns (columns26)'];
  const tableRows = [headerRow, columns];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
