import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import compress from "astro-compress";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import { externalLink } from "./src/plugins";

import sitemap from "@astrojs/sitemap";

const devMode = !!import.meta.env.PUBLIC_DEV_MODE;

// https://astro.build/config
export default defineConfig({
  scopedStyleStrategy: "attribute",
  site: devMode ? "https://demo.playsorbonne.fr" : "https://playsorbonne.fr/",
  integrations: [
    react(),
    mdx(),
    sitemap(),
    compress({
      HTML: {
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkDirective],
    rehypePlugins: [
      [
        externalLink,
        {
          domain: "playsorbonne.fr",
        },
      ],
    ],
  },
});
