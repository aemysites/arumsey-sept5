/* global WebImporter */
export default function parse(element, { document }) {
  // --- COLUMN EXTRACTION LOGIC ---
  // Find the desktop container with image and content
  const desktop = element.querySelector('.elementor-element-e2c560f');
  let imgEl = null;
  let contentCol = null;
  if (desktop) {
    imgEl = desktop.querySelector('img');
    contentCol = desktop.querySelector('.elementor-element-8ae740d');
  }

  // Fallback: mobile/tablet containers (no image)
  let fallbackContent = null;
  if (!contentCol) {
    // Try mobile
    const mobile = element.querySelector('.elementor-element-9681687');
    if (mobile) {
      fallbackContent = mobile.querySelector('.elementor-element-29e1a79');
    }
    // Try tablet
    if (!fallbackContent) {
      const tablet = element.querySelector('.elementor-element-8c5a7d4');
      if (tablet) {
        fallbackContent = tablet.querySelector('.elementor-element-c60fb06');
      }
    }
  }

  // --- COLUMN CONSTRUCTION ---
  const headerRow = ['Columns (columns52)'];
  let columnsRow = [];
  if (contentCol && imgEl) {
    // Desktop: text left, image right
    // Extract all text content from contentCol
    const heading = contentCol.querySelector('.elementor-widget-heading');
    const text = contentCol.querySelector('.elementor-widget-text-editor');
    const button = contentCol.querySelector('.elementor-widget-button');
    const colContent = document.createElement('div');
    if (heading) {
      const headingClone = heading.cloneNode(true);
      colContent.appendChild(headingClone);
    }
    if (text) {
      const textClone = text.cloneNode(true);
      colContent.appendChild(textClone);
    }
    if (button) {
      const buttonClone = button.cloneNode(true);
      colContent.appendChild(buttonClone);
    }
    columnsRow = [colContent, imgEl.cloneNode(true)];
  } else if (fallbackContent) {
    // Mobile/tablet: text only
    const heading = fallbackContent.querySelector('.elementor-widget-heading');
    const text = fallbackContent.querySelector('.elementor-widget-text-editor');
    const button = fallbackContent.querySelector('.elementor-widget-button');
    const colContent = document.createElement('div');
    if (heading) {
      const headingClone = heading.cloneNode(true);
      colContent.appendChild(headingClone);
    }
    if (text) {
      const textClone = text.cloneNode(true);
      colContent.appendChild(textClone);
    }
    if (button) {
      const buttonClone = button.cloneNode(true);
      colContent.appendChild(buttonClone);
    }
    columnsRow = [colContent];
  } else if (contentCol) {
    // Defensive: text only
    const heading = contentCol.querySelector('.elementor-widget-heading');
    const text = contentCol.querySelector('.elementor-widget-text-editor');
    const button = contentCol.querySelector('.elementor-widget-button');
    const colContent = document.createElement('div');
    if (heading) {
      const headingClone = heading.cloneNode(true);
      colContent.appendChild(headingClone);
    }
    if (text) {
      const textClone = text.cloneNode(true);
      colContent.appendChild(textClone);
    }
    if (button) {
      const buttonClone = button.cloneNode(true);
      colContent.appendChild(buttonClone);
    }
    columnsRow = [colContent];
  } else {
    // Defensive: fallback to all direct children
    const children = Array.from(element.children);
    columnsRow = children.length ? children : [element];
  }

  // --- TABLE CREATION ---
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
