/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Select all direct card containers
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));

  cardContainers.forEach(card => {
    // Find the image (first <img> descendant)
    const img = card.querySelector('img');

    // Find the heading (h3 or h4)
    const heading = card.querySelector('h3, h4');

    // Find the description (first <p> descendant)
    const desc = card.querySelector('p');

    // Compose the text cell: always group heading and description together
    const textCell = [];
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);

    // Only add row if there is at least an image or text
    if (img || textCell.length > 0) {
      rows.push([
        img || '',
        textCell.length === 1 ? textCell[0] : textCell
      ]);
    }
  });

  // Remove any empty rows (should not be necessary, but for safety)
  const filteredRows = rows.filter(row => {
    // Header row always included
    if (row === headerRow) return true;
    // Card row: must have image or non-empty text cell
    const [img, text] = row;
    const imgOk = img && (typeof img !== 'string' || img.trim().length > 0);
    let textOk = false;
    if (Array.isArray(text)) textOk = text.length > 0;
    else if (typeof text === 'string') textOk = text.trim().length > 0;
    else if (text) textOk = true;
    return imgOk || textOk;
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(filteredRows, document);
  element.replaceWith(table);
}
