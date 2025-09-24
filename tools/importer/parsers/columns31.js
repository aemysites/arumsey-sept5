/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate child containers (columns)
  let columns = Array.from(element.querySelectorAll(':scope > .e-con-inner > div'));
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Only keep columns that have meaningful content (not just empty containers)
  columns = columns.filter(col => {
    const inner = col.querySelector(':scope > .e-con-inner') || col;
    // Look for any ul, li, p, or text content
    if (inner.querySelector('ul,li,p')) return true;
    if (inner.textContent && inner.textContent.trim().length > 0) return true;
    return false;
  });

  // Extract content for each column, flatten arrays, and REMOVE empty columns and empty cell arrays
  const cells = columns.map((col) => {
    const inner = col.querySelector(':scope > .e-con-inner') || col;
    // Collect all widget containers (text, lists, etc)
    const widgets = Array.from(inner.querySelectorAll(':scope > .elementor-widget-container'));
    let content = [];
    if (widgets.length === 0) {
      // Fallback: just use all children, but only those with meaningful content
      content = Array.from(inner.children).filter(child => {
        if (child.querySelector('ul,li,p')) return true;
        if (child.textContent && child.textContent.trim().length > 0) return true;
        return false;
      });
    } else {
      // For each widget, push all its children (preserving structure)
      content = widgets.map(w => {
        const ul = w.querySelector('ul');
        if (ul && ul.textContent.trim().length > 0) return ul;
        const p = w.querySelector('p');
        if (p && p.textContent.trim().length > 0) return p;
        // Only return widget if it has meaningful content
        if (w.textContent && w.textContent.trim().length > 0) return w;
        return null;
      }).filter(Boolean);
    }
    // Only return cell if it has meaningful content
    if (content.length === 0) return null;
    // Remove empty elements from content array
    content = content.filter(el => {
      if (!el) return false;
      if (el.textContent && el.textContent.trim().length === 0) return false;
      return true;
    });
    if (content.length === 0) return null;
    return content;
  }).filter(Boolean);

  const headerRow = ['Columns (columns31)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cells
  ], document);

  element.replaceWith(table);
}
