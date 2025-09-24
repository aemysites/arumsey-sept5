/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to convert non-image elements with src to links
  function convertNonImageSrcToLink(root) {
    root.querySelectorAll('[src]:not(img)').forEach(el => {
      const src = el.getAttribute('src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = src;
        el.replaceWith(link);
      }
    });
  }

  // Helper to collect all visible text content from a container
  function collectTextContent(container) {
    const fragment = document.createDocumentFragment();
    // Get all headings, paragraphs, labels, and visible text nodes
    container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, legend, button, [role="group"] label, .frm_primary_label').forEach(el => {
      if (el.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = el.innerHTML;
        fragment.appendChild(p);
      }
    });
    // Also get direct text nodes under the container
    Array.from(container.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        fragment.appendChild(p);
      }
    });
    return fragment;
  }

  // Find the main column containers
  const leftColumn = element.querySelector('.elementor-element-6130ed22');
  const rightColumn = element.querySelector('.elementor-element-42e90d86');

  // Left column: heading + form
  let leftContent = [];
  if (leftColumn) {
    // Heading (h2)
    const headingWidget = leftColumn.querySelector('.elementor-widget-heading');
    if (headingWidget) {
      const headingContainer = headingWidget.querySelector('.elementor-widget-container');
      if (headingContainer) leftContent.push(collectTextContent(headingContainer));
    }
    // Form
    const formWidget = leftColumn.querySelector('.elementor-widget-formidable');
    if (formWidget) {
      const formContainer = formWidget.querySelector('.elementor-widget-container');
      if (formContainer) leftContent.push(collectTextContent(formContainer));
    }
  }

  // Convert non-image src to link in leftContent
  leftContent.forEach(node => convertNonImageSrcToLink(node));

  // Right column: image(s)
  let rightContent = [];
  if (rightColumn) {
    let imgWidget = rightColumn.querySelector('.elementor-widget-image:not(.elementor-hidden-widescreen):not(.elementor-hidden-desktop):not(.elementor-hidden-laptop):not(.elementor-hidden-tablet_extra)');
    if (!imgWidget) {
      imgWidget = rightColumn.querySelector('.elementor-widget-image');
    }
    if (imgWidget) {
      const imgContainer = imgWidget.querySelector('.elementor-widget-container');
      if (imgContainer) rightContent.push(imgContainer.cloneNode(true));
    }
  }

  // Convert non-image src to link in rightContent
  rightContent.forEach(node => convertNonImageSrcToLink(node));

  // Table header must match block name exactly
  const headerRow = ['Columns (columns34)'];
  // Table row: left and right columns
  const contentRow = [leftContent, rightContent];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
