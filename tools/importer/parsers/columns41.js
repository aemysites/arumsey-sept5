/* global WebImporter */
export default function parse(element, { document }) {
  // Get main flex parent
  const mainFlex = element.querySelector(':scope > div');
  if (!mainFlex) return;

  // Helper to get the boxed logo/social/copyright column (desktop/tablet/mobile)
  function getFirstColumn(mainFlex) {
    // Try desktop/tablet first
    let boxed = mainFlex.querySelector('.elementor-hidden-tablet.elementor-hidden-mobile .e-con-inner');
    if (!boxed) {
      // Fallback: mobile boxed
      boxed = mainFlex.querySelector('.elementor-hidden-desktop.elementor-hidden-laptop.elementor-hidden-mobile.elementor-hidden-widescreen.elementor-hidden-tablet_extra .e-con-inner');
    }
    if (!boxed) return '';
    // Instead of picking widgets, include all text content and images
    const col = document.createElement('div');
    Array.from(boxed.children).forEach(child => {
      col.appendChild(child.cloneNode(true));
    });
    return col.innerHTML.trim() ? col : '';
  }

  // Helper to get main nav menu column
  function getNavMenu(mainFlex) {
    // Find nav menu with 4 links (main menu)
    const navMenus = mainFlex.querySelectorAll('.elementor-widget-nav-menu');
    for (const nav of navMenus) {
      const ul = nav.querySelector('ul');
      if (ul && ul.children.length === 4) {
        const col = document.createElement('div');
        col.appendChild(nav.cloneNode(true));
        return col;
      }
    }
    // Fallback: first nav menu
    if (navMenus[0]) {
      const col = document.createElement('div');
      col.appendChild(navMenus[0].cloneNode(true));
      return col;
    }
    return '';
  }

  // Helper to get sub nav menu column
  function getSubMenu(mainFlex) {
    // Find nav menu with 2 links (sub menu)
    const navMenus = mainFlex.querySelectorAll('.elementor-widget-nav-menu');
    for (const nav of navMenus) {
      const ul = nav.querySelector('ul');
      if (ul && ul.children.length === 2) {
        const col = document.createElement('div');
        col.appendChild(nav.cloneNode(true));
        return col;
      }
    }
    // Fallback: second nav menu
    if (navMenus[1]) {
      const col = document.createElement('div');
      col.appendChild(navMenus[1].cloneNode(true));
      return col;
    }
    return '';
  }

  // Compose the columns row - ensure each cell is an element with full content
  const columnsRow = [
    getFirstColumn(mainFlex),
    getNavMenu(mainFlex),
    getSubMenu(mainFlex)
  ];

  // Table header
  const headerRow = ['Columns (columns41)'];
  const tableCells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
