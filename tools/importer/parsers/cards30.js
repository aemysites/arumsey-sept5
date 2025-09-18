/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child card containers
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));

  // Table header row as required
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  cardContainers.forEach((card) => {
    // Image extraction: find the first image inside the card
    const imgWidget = card.querySelector('.elementor-widget-image');
    let imgEl = null;
    if (imgWidget) {
      imgEl = imgWidget.querySelector('img');
    }

    // Heading extraction: prefer h3, then h4, etc.
    const headingWidget = card.querySelector('.elementor-widget-heading');
    let headingEl = null;
    if (headingWidget) {
      headingEl = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
    }

    // Description extraction: get the first paragraph
    const textWidget = card.querySelector('.elementor-widget-text-editor');
    let descEl = null;
    if (textWidget) {
      descEl = textWidget.querySelector('p');
    }

    // Only add a row if at least one of image or text is present
    if (imgEl || headingEl || descEl) {
      // Compose the text cell: heading (if present), then description (if present)
      const textCell = [];
      if (headingEl) textCell.push(headingEl);
      if (descEl) textCell.push(descEl);
      rows.push([
        imgEl || '',
        textCell.length ? textCell : '',
      ]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
