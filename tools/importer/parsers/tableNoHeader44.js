/* global WebImporter */
export default function parse(element, { document }) {
  // Find the loop container
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;

  // Get all rows (each .e-loop-item)
  const rows = Array.from(loopContainer.querySelectorAll('[data-elementor-type="loop-item"]'));

  // Table header: must match target block name exactly
  const headerRow = ['Table (no header, tableNoHeader44)'];
  const tableRows = [headerRow];

  rows.forEach(rowEl => {
    // Extract year and month
    let year = '';
    let month = '';
    const infoList = rowEl.querySelector('.elementor-post-info');
    if (infoList) {
      const infoItems = infoList.querySelectorAll('.elementor-post-info__terms-list-item');
      if (infoItems.length >= 2) {
        year = infoItems[0].textContent.trim();
        month = infoItems[1].textContent.trim();
      }
    }

    // Extract title link (reference, not clone)
    let titleLink = '';
    const titleWidget = rowEl.querySelector('.elementor-widget-theme-post-title');
    if (titleWidget) {
      const h3 = titleWidget.querySelector('h3');
      if (h3 && h3.querySelector('a')) {
        titleLink = h3.querySelector('a');
      }
    }

    // Extract buttons (reference, not clone)
    const buttonTexts = ['Ler regulamento', 'Baixar arquivo'];
    const buttons = [];
    const buttonLinks = rowEl.querySelectorAll('.elementor-button-link');
    buttonLinks.forEach(a => {
      // Only add if text matches expected button label
      const btnText = a.textContent.trim();
      if (buttonTexts.includes(btnText)) {
        buttons.push(a);
      }
    });

    // Compose row: year, month, title, buttons
    const rowCells = [year, month, titleLink || '', ...buttons];
    tableRows.push(rowCells);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
