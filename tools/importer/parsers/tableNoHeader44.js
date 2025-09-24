/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all loop items (each row in the table)
  const loopItems = Array.from(
    element.querySelectorAll('[data-elementor-type="loop-item"]')
  );

  // Table header row
  const headerRow = ['Table (no header, tableNoHeader44)'];
  const rows = [headerRow];

  // Parse each loop item as a row
  loopItems.forEach((item) => {
    // Get year and month from the post-info widget
    const infoWidget = item.querySelector('.elementor-post-info');
    let year = '', month = '';
    if (infoWidget) {
      const infoSpans = infoWidget.querySelectorAll('.elementor-post-info__item--type-terms');
      if (infoSpans[0]) year = infoSpans[0].textContent.trim();
      if (infoSpans[1]) month = infoSpans[1].textContent.trim();
    }

    // Get the title link
    const titleWidget = item.querySelector('.elementor-widget-theme-post-title .elementor-heading-title a');
    let titleLink = null;
    if (titleWidget) {
      titleLink = titleWidget;
    }

    // Get both buttons (Ler regulamento, Baixar arquivo)
    const buttonLinks = Array.from(
      item.querySelectorAll('.elementor-widget-button .elementor-button-link')
    ).filter(a => a && a.textContent.trim());
    // Defensive: Only keep unique buttons by text
    const seen = new Set();
    const buttons = buttonLinks.filter(a => {
      const txt = a.textContent.trim();
      if (seen.has(txt)) return false;
      seen.add(txt);
      return true;
    });

    // Compose cells for this row
    // Screenshot shows: Year | Month | Title | Button1 | Button2
    const row = [
      year ? document.createTextNode(year) : '',
      month ? document.createTextNode(month) : '',
      titleLink ? titleLink : '',
      buttons[0] ? buttons[0] : '',
      buttons[1] ? buttons[1] : ''
    ];
    rows.push(row);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
