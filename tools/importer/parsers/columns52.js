/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Columns (columns52)'];

  // Find the first visible column set (desktop/tablet/mobile)
  const containers = Array.from(element.querySelectorAll(':scope > .e-con-inner > .e-con'));
  let columnSet = null;
  for (const container of containers) {
    if (container.querySelector('h2, p, a, img')) {
      columnSet = container;
      break;
    }
  }
  if (!columnSet) {
    element.replaceWith(WebImporter.DOMUtils.createTable([headerRow], document));
    return;
  }

  // Find all direct children that are columns (e-con)
  const columnDivs = Array.from(columnSet.children).filter(div => div.classList.contains('e-con'));
  let columns = [];
  for (const col of columnDivs) {
    // Collect all content blocks (headings, paragraphs, buttons, images)
    const colContent = [];
    // Headings
    col.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => colContent.push(el));
    // Paragraphs
    col.querySelectorAll('p').forEach(el => colContent.push(el));
    // Buttons/links
    col.querySelectorAll('a').forEach(el => colContent.push(el));
    // Images
    col.querySelectorAll('img').forEach(el => colContent.push(el));
    // If nothing found, try to get all text content (as fallback)
    if (colContent.length === 0 && col.textContent.trim()) {
      colContent.push(document.createTextNode(col.textContent.trim()));
    }
    columns.push(colContent);
  }

  // If not enough columns, try to split content into two columns (text and images)
  if (columns.length < 2) {
    // Gather all content from columnSet
    const allContent = [];
    columnSet.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, img').forEach(el => allContent.push(el));
    if (allContent.length) {
      const images = allContent.filter(el => el.tagName === 'IMG');
      const nonImages = allContent.filter(el => el.tagName !== 'IMG');
      if (images.length && nonImages.length) {
        columns = [nonImages, images];
      } else if (allContent.length >= 2) {
        // Split roughly in half
        const mid = Math.ceil(allContent.length / 2);
        columns = [allContent.slice(0, mid), allContent.slice(mid)];
      } else {
        columns = [allContent];
      }
    }
  }

  // Remove empty columns
  columns = columns.filter(col => col.length > 0);

  // If still less than 2 columns, try to put all content in two columns (text and images, even if one is empty)
  if (columns.length < 2) {
    const allContent = [];
    columnSet.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, img').forEach(el => allContent.push(el));
    const images = allContent.filter(el => el.tagName === 'IMG');
    const nonImages = allContent.filter(el => el.tagName !== 'IMG');
    columns = [nonImages, images];
  }

  // Remove empty columns again
  columns = columns.filter(col => col.length > 0);

  // If still less than 2 columns, fallback to all content in first column and an empty second column
  if (columns.length < 2) {
    const allContent = [];
    columnSet.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, img').forEach(el => allContent.push(el));
    columns = [allContent, []];
  }

  // Only output if there are at least 2 columns (even if one is empty)
  if (columns.length < 2) {
    element.replaceWith(WebImporter.DOMUtils.createTable([headerRow], document));
    return;
  }

  const tableRows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
