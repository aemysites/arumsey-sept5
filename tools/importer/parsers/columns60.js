/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child containers that represent columns
  const inner = element.querySelector(':scope > .e-con-inner');
  const columnElements = inner ? Array.from(inner.children) : Array.from(element.children);

  // Defensive: ensure we have at least 4 columns as per visual layout
  // Column 1: Status, Logo, Heading
  const col1 = document.createElement('div');
  {
    // Status (icon list)
    const status = columnElements[0]?.querySelector('.elementor-icon-list-items');
    if (status) col1.appendChild(status.cloneNode(true));
    // Logo
    const logo = columnElements[0]?.querySelector('img');
    if (logo) col1.appendChild(logo.cloneNode(true));
    // Heading
    const heading = columnElements[0]?.querySelector('h2');
    if (heading) col1.appendChild(heading.cloneNode(true));
  }

  // Column 2: Location (icon lists)
  const col2 = document.createElement('div');
  {
    // First icon list (location name)
    const loc1 = columnElements[1]?.querySelector('.elementor-icon-list-items');
    if (loc1) col2.appendChild(loc1.cloneNode(true));
    // Second icon list (city/state)
    const loc2 = columnElements[1]?.querySelectorAll('.elementor-icon-list-items')[1];
    if (loc2) col2.appendChild(loc2.cloneNode(true));
  }

  // Column 3: Features (icon list)
  const col3 = document.createElement('div');
  {
    const features = columnElements[2]?.querySelector('.elementor-icon-list-items');
    if (features) col3.appendChild(features.cloneNode(true));
  }

  // Column 4: CTA Button
  const col4 = document.createElement('div');
  {
    const button = columnElements[3]?.querySelector('.elementor-button-wrapper');
    if (button) col4.appendChild(button.cloneNode(true));
  }

  // Build the table
  const headerRow = ['Columns (columns60)'];
  const contentRow = [col1, col2, col3, col4];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
