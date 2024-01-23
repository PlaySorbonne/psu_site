import type { RehypePlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import type { Element } from "hast";
import Title from "@/components/markdown/Title.astro"
import { renderToStaticMarkup } from "astro/jsx/server.js";



export const externalLink: RehypePlugin = () => {

  return (tree) => {
    visit(tree, (node) => {
      if (node.type != "element") {
        return;
      }

      const element = node as Element;

      if (!isH1(element)) {
        return;
      }

      // FIXME
      const finalElement = <Title>{element.content}</Title>;
      element.children = [await renderToStaticMarkup(finalElement)];
    });
  };
};

const isH1 = (element: Element) =>
  element.tagName == "h1" && element.content;