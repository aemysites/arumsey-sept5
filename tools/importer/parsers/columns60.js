/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children containers
  const containers = Array.from(element.querySelectorAll(':scope > .e-con-inner > .e-con, :scope > .e-con'));

  // Defensive: fallback if structure is slightly different
  const mainChildren = containers.length ? containers : Array.from(element.children);

  // There are 4 main columns visually:
  // 1. Left: "Em obras" + logo + heading
  // 2. Next: location info
  // 3. Next: list of features
  // 4. Right: button

  // --- Column 1: "Em obras" + logo + heading ---
  let col1 = [];
  const col1Container = mainChildren[0];
  if (col1Container) {
    // Get icon list ("Em obras")
    const emObras = col1Container.querySelector('.elementor-widget-icon-list');
    if (emObras) col1.push(emObras);
    // Get logo image
    const logo = col1Container.querySelector('img');
    if (logo) col1.push(logo);
    // Get heading (TAQUARAL)
    const heading = col1Container.querySelector('h2, h1, h3, h4, h5, h6');
    if (heading) col1.push(heading);
  }

  // --- Column 2: Location info ---
  let col2 = [];
  const col2Container = mainChildren[1];
  if (col2Container) {
    // Get icon list (location)
    const loc1 = col2Container.querySelector('.elementor-widget-icon-list');
    if (loc1) col2.push(loc1);
    // Get icon list (Campinas - SP)
    const loc2 = col2Container.querySelectorAll('.elementor-widget-icon-list');
    if (loc2.length > 1) col2.push(loc2[1]);
  }

  // --- Column 3: Features list ---
  let col3 = [];
  const col3Container = mainChildren[2];
  if (col3Container) {
    // Get icon list (features)
    const features = col3Container.querySelector('.elementor-widget-icon-list');
    if (features) col3.push(features);
  }

  // --- Column 4: Button ---
  let col4 = [];
  const col4Container = mainChildren[3];
  if (col4Container) {
    // Get button
    const button = col4Container.querySelector('a, button');
    if (button) col4.push(button);
  }

  // Compose the table rows
  const headerRow = ['Columns (columns60)'];
  const contentRow = [col1, col2, col3, col4];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
