/* global WebImporter */
export default function parse(element, { document }) {
  // Get only visible columns (not hidden)
  const columns = Array.from(element.querySelectorAll(':scope > div'))
    .filter(col => !col.className.includes('elementor-hidden'));

  // For each column, group all visible widgets into a single cell
  const cells = columns.map(col => {
    // Use .e-con-inner if present, else col
    const inner = col.querySelector('.e-con-inner') || col;
    // Only direct children that are widgets (not hidden)
    const widgets = Array.from(inner.querySelectorAll(':scope > div')).filter(w => !w.className.includes('elementor-hidden'));
    // If no widgets, fallback to all direct children
    const blocks = widgets.length ? widgets : Array.from(inner.children).filter(w => !w.className || !w.className.includes('elementor-hidden'));
    // Remove empty blocks and duplicates (by HTML content)
    const nonEmptyBlocks = blocks.filter(b => b.textContent.trim() || b.querySelector('img,video,iframe'));
    // Deduplicate by HTML content
    const seen = new Set();
    const uniqueBlocks = nonEmptyBlocks.filter(b => {
      const html = b.outerHTML;
      if (seen.has(html)) return false;
      seen.add(html);
      return true;
    });
    if (uniqueBlocks.length === 0) return null;
    if (uniqueBlocks.length === 1) {
      return [uniqueBlocks[0].cloneNode(true)];
    } else {
      const wrapper = document.createElement('div');
      uniqueBlocks.forEach(b => wrapper.appendChild(b.cloneNode(true)));
      return [wrapper];
    }
  }).filter(cell => cell && cell.length > 0); // Remove empty columns

  if (!cells.length) return;

  const headerRow = ['Columns (columns11)'];
  const tableRows = [headerRow, cells];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
