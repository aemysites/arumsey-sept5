/* global WebImporter */
export default function parse(element, { document }) {
  // Find all nav menus (main and sub)
  const navMenus = Array.from(element.querySelectorAll('nav.elementor-nav-menu--main'));

  // Extract all menu items as text (not just the nav elements)
  function extractMenuItems(nav) {
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('ul.elementor-nav-menu > li > a')).map(a => a.textContent.trim());
  }

  // Compose columns: one column per menu item
  const headerRow = ['Columns (columns25)'];
  let columnsRow = [];

  navMenus.forEach(nav => {
    columnsRow = columnsRow.concat(extractMenuItems(nav));
  });

  // Defensive: if no items found, add empty cell
  if (columnsRow.length === 0) {
    columnsRow.push('');
  }

  const cells = [
    headerRow,
    columnsRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
