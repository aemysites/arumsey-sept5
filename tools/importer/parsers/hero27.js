/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children divs
  const children = Array.from(element.querySelectorAll(':scope > .e-con-inner > div, :scope > .e-con-inner > .e-con-full'));

  // Find heading (title)
  let heading = null;
  let para = null;
  const ctas = [];

  children.forEach((child) => {
    // Heading
    if (
      child.classList.contains('elementor-widget-heading') &&
      child.querySelector('h1, h2, h3, h4, h5, h6')
    ) {
      heading = child.querySelector('h1, h2, h3, h4, h5, h6');
    }
    // Paragraph (subheading/description)
    if (
      child.classList.contains('elementor-widget-text-editor') &&
      child.querySelector('p')
    ) {
      para = child.querySelector('p');
    }
    // Buttons (CTAs)
    if (
      child.classList.contains('elementor-widget-button') &&
      child.querySelector('a')
    ) {
      ctas.push(child.querySelector('a'));
    }
    // Nested container with buttons
    if (
      child.classList.contains('e-con') &&
      child.querySelector('.elementor-widget-button')
    ) {
      const btns = child.querySelectorAll('.elementor-widget-button a');
      btns.forEach((a) => ctas.push(a));
    }
  });

  // Compose content cell
  const content = [];
  if (heading) content.push(heading);
  if (para) content.push(para);
  if (ctas.length > 0) {
    // Only add the first CTA with a real link (not #)
    const realCta = ctas.find((a) => a.getAttribute('href') && a.getAttribute('href') !== '#');
    if (realCta) content.push(realCta);
  }

  // Table rows
  const headerRow = ['Hero (hero27)'];
  const bgRow = ['']; // No background image in this HTML
  const contentRow = [content];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
