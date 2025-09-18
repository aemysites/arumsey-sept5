/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find first image in block (background image)
  function findBackgroundImage(el) {
    // Try to find any <img> inside the block
    const img = el.querySelector('img');
    if (img) return img;
    // If not found, try to find background-image style
    // (Not present in this HTML, but for resilience)
    const styleBg = el.style && el.style.backgroundImage;
    if (styleBg) {
      // Extract URL from style: background-image: url('...');
      const urlMatch = styleBg.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        const image = document.createElement('img');
        image.src = urlMatch[1];
        return image;
      }
    }
    return null;
  }

  // Helper to collect all heading, subheading, paragraphs, cta
  function collectContent(el) {
    const content = [];
    // Find heading
    const headingWidget = el.querySelector('[data-widget_type="heading.default"]');
    if (headingWidget) {
      const heading = headingWidget.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) content.push(heading);
    }
    // Find address list (icon list)
    const iconLists = el.querySelectorAll('[data-widget_type="icon-list.default"]');
    iconLists.forEach((iconList) => {
      const ul = iconList.querySelector('ul');
      if (ul) content.push(ul);
    });
    // Find address paragraphs
    const textEditor = el.querySelector('[data-widget_type="text-editor.default"]');
    if (textEditor) {
      const paragraphs = textEditor.querySelectorAll('p');
      paragraphs.forEach((p) => content.push(p));
    }
    // Find CTA button
    const buttonWidget = el.querySelector('[data-widget_type="button.default"]');
    if (buttonWidget) {
      const btn = buttonWidget.querySelector('a');
      if (btn) content.push(btn);
    }
    return content;
  }

  // Table rows
  const headerRow = ['Hero (hero53)'];

  // 2nd row: background image (optional)
  const bgImage = findBackgroundImage(element);
  const imageRow = [bgImage ? bgImage : ''];

  // 3rd row: content (title, subheading, cta, etc)
  const contentRow = [collectContent(element)];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
