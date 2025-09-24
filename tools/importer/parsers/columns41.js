/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex container (the one with e-parent)
  const mainContainer = element.querySelector('.e-parent');
  if (!mainContainer) return;

  // Find the left column: logo, tagline, socials, copyright
  let leftColContent = [];
  const leftCol = mainContainer.querySelector('.elementor-hidden-tablet.elementor-hidden-mobile .e-con-inner');
  if (leftCol) {
    // Logo
    const logo = leftCol.querySelector('.elementor-widget-image');
    if (logo) leftColContent.push(logo);
    // Tagline (first .elementor-widget-text-editor)
    const tagline = leftCol.querySelector('.elementor-widget-text-editor');
    if (tagline) leftColContent.push(tagline);
    // Social icons
    const socials = leftCol.querySelector('.elementor-widget-social-icons');
    if (socials) leftColContent.push(socials);
    // Copyright (last .elementor-widget-text-editor)
    const textEditors = leftCol.querySelectorAll('.elementor-widget-text-editor');
    if (textEditors.length > 1) leftColContent.push(textEditors[textEditors.length - 1]);
  }

  // Find the right column: main menu and sub menu
  let rightColContent = [];
  // Find all visible nav menus (not hidden)
  const navMenus = Array.from(mainContainer.querySelectorAll('.elementor-widget-nav-menu'));
  navMenus.forEach(menu => {
    // Only include menus that are not inside hidden containers
    let parent = menu;
    let hidden = false;
    while (parent && parent !== mainContainer) {
      if (parent.classList.contains('elementor-hidden-desktop') || parent.classList.contains('elementor-hidden-tablet') || parent.classList.contains('elementor-hidden-mobile')) {
        hidden = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!hidden) rightColContent.push(menu);
  });

  // Also include any copyright text that is outside the left column (for completeness)
  if (rightColContent.length === 0) {
    // fallback: try to find copyright in mainContainer
    const copyright = mainContainer.querySelector('.elementor-widget-text-editor');
    if (copyright) rightColContent.push(copyright);
  }

  // Compose table rows
  const headerRow = ['Columns (columns41)'];
  const contentRow = [leftColContent, rightColContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
