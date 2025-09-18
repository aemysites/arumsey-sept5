/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main visible column container (not hidden on any device)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  let mainColumn = columns.find(col => {
    const cls = col.getAttribute('class') || '';
    return !cls.includes('elementor-hidden-mobile') && !cls.includes('elementor-hidden-tablet') && !cls.includes('elementor-hidden-desktop') && !cls.includes('elementor-hidden-widescreen');
  });
  if (!mainColumn) mainColumn = columns[0];

  // Get its direct children (each column)
  const mainChildren = Array.from(mainColumn.children);
  const cells = [];
  mainChildren.forEach(col => {
    // Gather all content blocks in each column
    let colContent = [];
    // Get all widgets inside this column
    const widgets = col.querySelectorAll('.elementor-widget');
    widgets.forEach(widget => {
      // Heading
      const heading = widget.querySelector('.elementor-heading-title');
      if (heading) colContent.push(heading.cloneNode(true));
      // Paragraph
      const para = widget.querySelector('p');
      if (para) colContent.push(para.cloneNode(true));
      // Button
      const btn = widget.querySelector('a.elementor-button');
      if (btn) colContent.push(btn.cloneNode(true));
      // Image
      const img = widget.querySelector('img');
      if (img) colContent.push(img.cloneNode(true));
    });
    // If no widgets, check for direct images
    if (colContent.length === 0) {
      const img = col.querySelector('img');
      if (img) colContent.push(img.cloneNode(true));
    }
    // If still empty, get all text content (including from child elements)
    if (colContent.length === 0) {
      // Instead of just text, clone all children for full content
      if (col.children.length > 0) {
        colContent = Array.from(col.children).map(child => child.cloneNode(true));
      } else {
        const text = col.textContent.trim();
        if (text) colContent.push(text);
      }
    }
    // Only add non-empty columns
    if (colContent.length > 0) {
      cells.push(colContent);
    }
  });

  // Table header must match target block name exactly
  const headerRow = ['Columns (columns59)'];

  // Only create the table if we have at least one non-empty cell row
  if (cells.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      cells
    ], document);
    element.replaceWith(table);
  }
}
