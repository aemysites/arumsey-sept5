/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child containers (columns)
  const columns = Array.from(element.querySelectorAll(':scope > .e-con-inner > .e-con, :scope > .e-con'));

  // Defensive: fallback if no .e-con-inner
  let cols = columns;
  if (!cols.length) {
    cols = Array.from(element.querySelectorAll(':scope > .e-con'));
  }
  if (!cols.length) {
    // fallback to all direct child divs
    cols = Array.from(element.children);
  }

  // For this block, we want to create a row for each visual column
  // The source visually has 4 columns: left (Em obras + logo + TAQUARAL), location, features, button
  // But in the HTML, the first .e-con has three widgets (list, image, heading),
  // the second .e-con has two widgets (icon-list, icon-list),
  // the third .e-con has one widget (icon-list),
  // the fourth .e-con has one widget (button)

  // We'll build the columns as follows:
  // 1. First column: Em obras, logo, TAQUARAL
  // 2. Second column: Taquaral (with icon), Campinas - SP
  // 3. Third column: three features (icon-list)
  // 4. Fourth column: button

  // Defensive: get widgets from each column
  // Helper to flatten and collect all widgets in a column
  function getWidgets(col) {
    return Array.from(col.querySelectorAll(':scope > .elementor-element'));
  }

  // 1. First column: Em obras (icon-list), logo (img), TAQUARAL (heading)
  const col1 = cols[0] ? getWidgets(cols[0]) : [];
  // 2. Second column: Taquaral (icon-list), Campinas - SP (icon-list)
  const col2 = cols[1] ? getWidgets(cols[1]) : [];
  // 3. Third column: three features (icon-list)
  const col3 = cols[2] ? getWidgets(cols[2]) : [];
  // 4. Fourth column: button
  const col4 = cols[3] ? getWidgets(cols[3]) : [];

  // Compose each column's content as an array of elements
  function flattenWidgets(widgets) {
    // For each widget, extract the main container
    return widgets.map(w => {
      // Usually the main content is in .elementor-widget-container
      const container = w.querySelector('.elementor-widget-container');
      return container ? container : w;
    });
  }

  const col1Content = flattenWidgets(col1);
  const col2Content = flattenWidgets(col2);
  const col3Content = flattenWidgets(col3);
  const col4Content = flattenWidgets(col4);

  // Compose the table
  const headerRow = ['Columns (columns60)'];
  const contentRow = [
    col1Content,
    col2Content,
    col3Content,
    col4Content
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
