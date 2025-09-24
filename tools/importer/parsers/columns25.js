/* global WebImporter */
export default function parse(element, { document }) {
  // Find all nav-menu widgets (main menus only)
  const navMenus = Array.from(element.querySelectorAll('.elementor-widget-nav-menu'))
    .map(widget => {
      const widgetContainer = widget.querySelector('.elementor-widget-container');
      if (!widgetContainer) return '';
      // Only include the first nav (main menu)
      const mainNav = widgetContainer.querySelector('nav.elementor-nav-menu--main');
      if (!mainNav) return '';
      // Clone the nav to preserve structure
      return mainNav.cloneNode(true);
    })
    .filter(Boolean);

  // Always produce two columns, fill with empty string if missing
  while (navMenus.length < 2) navMenus.push('');

  // Compose table rows
  const headerRow = ['Columns (columns25)'];
  const secondRow = navMenus;
  const rows = [headerRow, secondRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
