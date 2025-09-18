/* global WebImporter */
export default function parse(element, { document }) {
  // Get all inner containers (should be two: left and right)
  const containers = Array.from(element.querySelectorAll(':scope > .e-con-inner > div'));

  // --- Extract content ---
  // First container: logo and tagline
  let logoImg = null;
  let logoDesc = null;
  if (containers[0]) {
    const img = containers[0].querySelector('img');
    if (img) logoImg = img.cloneNode(true);
    // Get all text content (not just <p>)
    const textNodes = Array.from(containers[0].querySelectorAll('p, div'));
    for (const node of textNodes) {
      const txt = node.textContent.trim();
      if (txt && txt !== '\u00a0') {
        logoDesc = document.createElement('p');
        logoDesc.textContent = txt;
        break;
      }
    }
  }

  // Second container: heading and paragraph
  let heading = null;
  let subheading = null;
  if (containers[1]) {
    // Use all heading tags, prefer h2 > h1 > h3
    const h = containers[1].querySelector('h2, h1, h3');
    if (h) heading = h.cloneNode(true);
    // Get all <p> (may be more than one)
    const ps = Array.from(containers[1].querySelectorAll('p'));
    if (ps.length > 0) {
      // Join all <p> as separate paragraphs
      subheading = document.createElement('div');
      ps.forEach(p => {
        if (p.textContent.trim() && p.textContent.trim() !== '\u00a0') {
          const para = document.createElement('p');
          para.textContent = p.textContent.trim();
          subheading.appendChild(para);
        }
      });
      // If only one paragraph, unwrap
      if (subheading.childNodes.length === 1) {
        subheading = subheading.firstChild;
      }
    }
  }

  // Table rows
  const headerRow = ['Hero (hero56)'];
  const bgRow = [logoImg ? logoImg : ''];
  // Compose content for row 3: logoDesc, heading, subheading (all as a single cell)
  const content = [];
  if (logoDesc) content.push(logoDesc);
  if (heading) content.push(heading);
  if (subheading) content.push(subheading);
  const contentRow = [content];

  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
