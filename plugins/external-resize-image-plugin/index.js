// Support for resize image inline on markdown
// Syntax "=WIDTH" 
//
// Examples
// ![](/relative-path-image "=500")
// ![](/relative-path-image "=500 Some Title")
// ![](/relative-path-image "Some Title =500")

const visit = require('unist-util-visit');
const { selectAll, select } = require('hast-util-select');
const { imageClass, imageWrapperClass } = require('gatsby-remark-images/constants')

const { convertHastToHtml, convertHtmlToHast } = require('../utils/convertHast');

const extractResize = (string) => {
  const regexResize = /=\d{2,4}/g

  const title = string.replace(regexResize, '').trim()
  const resize = string.match(regexResize);

  return {
    title,
    resize
  }
}

module.exports = ({ markdownAST }) => {

  visit(markdownAST, 'html', node => {

    const regexMaxWidth = /max-width: \d{1,5}px/g

    const hast = convertHtmlToHast(node.value);

    const wrapperImageList = selectAll(`.${imageWrapperClass}`, hast);
    //  image related HTML produced by Gatsby looks like: 
    //  <span .gatsby-resp-image-wrapper max-width: 100px>
    //    <a .gatsby-resp-image-link href='/static/...'>
    //      <span .gatsby-resp-image-background-image background-Image>
    //      <picture>
    //        <source srcset="/static/...webp">
    //        <source srcset="/static/...jpg">
    //        <img .gatsby-resp-image-image title='..' alt='...' max-width: 100%>
    //      ...

    wrapperImageList.forEach(wrapperImage => {
      const image = select(`.${imageClass}`, wrapperImage)

      const { title, resize } = extractResize(image.properties.title)

      const maxWidth = wrapperImage
        .properties
        .style
        .match(regexMaxWidth)[0]
        .replace(/\D/g, '')

      if (resize) {

        const width = resize[0].replace('=', '');

        //  by default Gatsby populates title value with alt, 
        //  restoring it here if needed
        image.properties.title = title ? title : image.properties.alt

        wrapperImage.properties.style = wrapperImage
          .properties
          .style
          .replace(
            regexMaxWidth,
            `max-width: ${Math.min(width, maxWidth)}px`
          );
      }
    })
    node.value = convertHastToHtml(hast)
  })
};
