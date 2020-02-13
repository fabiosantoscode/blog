const visit = require('unist-util-visit');
const { selectAll } = require('hast-util-select');

const {
  convertHastToHtml,
  convertHtmlToHast
} = require('../utils/convertHast');

const requiredExternalLinkAttrs = ['href', 'title', 'description', 'link'];

function isCorrectExternalLinkAttr(attrsKeyTagArray) {
  return requiredExternalLinkAttrs.every(attr =>
    attrsKeyTagArray.includes(attr)
  );
}

function renderTag(attrs) {
  return `
    <section class="elp-content-holder">
      <a href=${attrs.href} class="external-link-preview">
          <div class="elp-description-holder">
            <h4 class="elp-title">${attrs.title}</h4>
            <div class="elp-description">${attrs.description}</div>
            <div class="elp-link">${attrs.link}</div>
          </div>
           ${
             attrs.image
               ? `<div class="elp-image-holder">
                <img src="${attrs.image}" alt="${attrs.title}"/>
            </div>`
               : ``
           }
      </a>
    </section>
    `;
}

module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'html', node => {
    const hast = convertHtmlToHast(node.value);

    const externalLinkNodeList = selectAll('external-link', hast);

    externalLinkNodeList.forEach(externalLinkNode => {
      const { properties } = externalLinkNode;
      if (isCorrectExternalLinkAttr(Object.keys(properties))) {
        const externalLinkHtml = renderTag(properties);
        const externalLinkHast = convertHtmlToHast(externalLinkHtml);

        externalLinkNode.type = externalLinkHast.type;
        externalLinkNode.tagName = externalLinkHast.tagName;
        externalLinkNode.properties = externalLinkHast.properties;
        externalLinkNode.children = externalLinkHast.children;
      } else {
        throw new Error(
          `No correct tag <external-link /> or not all nested tags in ${node.value}`
        );
      }
    });

    node.value = convertHastToHtml(hast);
  });
};
