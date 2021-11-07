const { getHighlighter, loadTheme } = require('shiki')
const visit = require('unist-util-visit')

module.exports = async function parse({ markdownAST }, options) {

  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: options.langs || [],
  });

  visit(markdownAST, "code", (node) => {
    node.type = "html";
    node.children = undefined;

    if (!node.lang) {
      node.value = `<pre class="shiki-unknown"><code>${node.value}</code></pre>`;
      return;
    }

    node.value = highlighter.codeToHtml(node.value, node.lang);
  });

  return markdownAST;
}
