// copied from https://www.larrymyers.com/posts/how-to-create-an-astro-markdown-plugin/
// thanks !

import type { RehypePlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import type { Element } from "hast";

interface Options {
  domain: string;
}

export const externalLink: RehypePlugin = (options?: Options) => {
  const siteDomain = options?.domain ?? "";

  return (tree) => {
    visit(tree, (node) => {
      if (node.type != "element") {
        return;
      }

      const element = node as Element;

      if (!isAnchor(element)) {
        return;
      }

      const url = getUrl(element);

      if (isExternal(url, siteDomain)) {
        element.properties!["target"] = "_blank";
      }
    });
  };
};

const isAnchor = (element: Element) =>
  element.tagName == "a" && element.properties && "href" in element.properties;

const getUrl = (element: Element) => {
  if (!element.properties) {
    return "";
  }

  const url = element.properties["href"];

  if (!url) {
    return "";
  }

  return url.toString();
};

const isExternal = (url: string, domain: string) => {
  return url.startsWith("http") && !url.includes(domain);
};
