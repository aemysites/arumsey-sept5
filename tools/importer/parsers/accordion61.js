/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children by class
  function findDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Accordion (accordion61)'];
  const rows = [headerRow];

  // 2. Get the content container (the green box)
  // The structure is: top-level div > ... > div with heading, text, accordion widget
  // Find the child with the heading and content
  const contentContainer = Array.from(element.querySelectorAll(':scope > div')).find(div =>
    div.querySelector('.elementor-widget-heading')
  );

  if (!contentContainer) {
    // Defensive: fallback, do nothing
    return;
  }

  // 3. Get the heading (title for the first accordion item)
  const headingWidget = contentContainer.querySelector('.elementor-widget-heading');
  let headingTitle = '';
  if (headingWidget) {
    const headingContainer = headingWidget.querySelector('.elementor-widget-container');
    if (headingContainer) {
      headingTitle = headingContainer.querySelector('h2, h1, h3, h4, h5, h6');
    }
  }

  // 4. Get the text editor (content for the first accordion item)
  const textWidget = contentContainer.querySelector('.elementor-widget-text-editor');
  let textContent = '';
  if (textWidget) {
    const textContainer = textWidget.querySelector('.elementor-widget-container');
    if (textContainer) {
      textContent = textContainer;
    }
  }

  // 5. Get the accordion widget (may have multiple details)
  const accordionWidget = contentContainer.querySelector('.elementor-widget-n-accordion');
  if (accordionWidget) {
    const detailsList = accordionWidget.querySelectorAll('details.e-n-accordion-item');
    detailsList.forEach(details => {
      // Title cell: summary > .e-n-accordion-item-title-header > h4 (or similar)
      let titleEl = details.querySelector('.e-n-accordion-item-title-header h4, summary h4, summary');
      if (!titleEl) {
        // fallback: summary itself
        titleEl = details.querySelector('summary');
      }
      // Content cell: the region div inside details
      const contentEl = details.querySelector('[role="region"]');
      if (titleEl && contentEl) {
        rows.push([
          titleEl,
          contentEl
        ]);
      }
    });
  }

  // 6. Add the first accordion item (heading + text)
  // Only if we have a heading and content
  if (headingTitle && textContent) {
    rows.splice(1, 0, [headingTitle, textContent]);
  }

  // 7. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
