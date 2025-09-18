/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns for the footer
  // The first is the left column (logo, text, social, copyright)
  // The second is the right column (main nav menu + sub nav menu)
  const containers = Array.from(element.querySelectorAll(':scope > div'));
  let leftCol = null;
  let rightCol = null;
  for (const cont of containers) {
    if (!leftCol && cont.querySelector('img') && cont.querySelector('.elementor-widget-social-icons')) {
      leftCol = cont;
      continue;
    }
    if (!rightCol && cont.querySelector('nav.elementor-nav-menu--main')) {
      rightCol = cont;
    }
  }
  // Defensive fallback: pick first two containers
  if (!leftCol && containers.length > 0) leftCol = containers[0];
  if (!rightCol && containers.length > 1) rightCol = containers[1];

  // Compose the header row
  const headerRow = ['Columns (columns41)'];

  // Compose the columns row: only include columns that exist
  const columnsRow = [];
  if (leftCol) columnsRow.push(leftCol);
  if (rightCol) columnsRow.push(rightCol);

  // Only create the table if there are at least 2 columns
  if (columnsRow.length < 2 && containers.length > 1) {
    columnsRow.push(containers[1]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
