/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child containers
  function getChildContainers(el) {
    return Array.from(el.querySelectorAll(':scope > .e-con-inner > .e-con'));
  }

  // Defensive: handle both .e-con-inner > .e-con and direct .e-con children
  let containers = getChildContainers(element);
  if (!containers.length) {
    containers = Array.from(element.querySelectorAll(':scope > .e-con'));
  }

  // For each block, we expect 3 main columns visually:
  // 1. Left: Title, logo, subtitle, location
  // 2. Middle: Feature list (icon-list)
  // 3. Right: CTA button

  // --- Column 1: Title, logo, subtitle, location ---
  const leftCol = document.createElement('div');
  // First inner container: title, logo, subtitle
  const mainInfo = containers[0];
  if (mainInfo) leftCol.appendChild(mainInfo);
  // Second inner container: location info (icon-list)
  if (containers[1]) leftCol.appendChild(containers[1]);

  // --- Column 2: Feature list ---
  const middleCol = document.createElement('div');
  // Third inner container: feature list (icon-list)
  if (containers[2]) middleCol.appendChild(containers[2]);

  // --- Column 3: CTA button ---
  const rightCol = document.createElement('div');
  // Fourth inner container: button
  if (containers[3]) rightCol.appendChild(containers[3]);

  // Build table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftCol, middleCol, rightCol];

  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
