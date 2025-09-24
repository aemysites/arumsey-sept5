/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child containers (each card)
  const cardContainers = element.querySelectorAll(':scope > div');

  // Table header row
  const headerRow = ['Cards (cards30)'];

  // Build card rows
  const rows = [headerRow];

  cardContainers.forEach((card) => {
    // Find image (first image in card)
    const imgWidget = card.querySelector('.elementor-widget-image');
    let imgEl = null;
    if (imgWidget) {
      imgEl = imgWidget.querySelector('img');
    }

    // Find heading (h3 or h4)
    let headingEl = null;
    const headingWidget = card.querySelector('.elementor-widget-heading');
    if (headingWidget) {
      headingEl = headingWidget.querySelector('h3, h4');
    }

    // Find description (first p in text-editor)
    let descEl = null;
    const textWidget = card.querySelector('.elementor-widget-text-editor');
    if (textWidget) {
      descEl = textWidget.querySelector('p');
    }

    // Compose text cell: heading + description
    const textCell = [];
    if (headingEl) textCell.push(headingEl);
    if (descEl) textCell.push(descEl);

    // Only add row if at least one cell has content
    if (imgEl || textCell.length) {
      rows.push([
        imgEl ? imgEl : '',
        textCell.length ? textCell : ''
      ]);
    }
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
