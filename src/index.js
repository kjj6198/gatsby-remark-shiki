const { getHighlighter, loadTheme } = require('shiki')
const visit = require('unist-util-visit')

module.exports = async function parse({ markdownAST }, options) {
  let theme = options.theme || "nord";

  const shikiTheme = await loadTheme(theme)

  const highlighter = await getHighlighter({
    theme: shikiTheme,
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
