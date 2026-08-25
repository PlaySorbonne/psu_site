import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import compress from "astro-compress";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { externalLink } from "./src/plugins";

import sitemap from "@astrojs/sitemap";

const devMode = !!import.meta.env.PUBLIC_DEV_MODE;

// https://astro.build/config
export default defineConfig({
  scopedStyleStrategy: "attribute",
  compressHTML: true,
  site: devMode ? "https://demo.playsorbonne.fr" : "https://playsorbonne.fr/",
  image: {
    domains: ["gamedevs.playsorbonne.fr", "localhost", "127.0.0.1"],
  },
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
      Image: {
        sharp: {
          sharp: { limitInputPixels: false },
        },
      },
    }),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [
        [
          externalLink,
          {
            domain: "playsorbonne.fr",
          },
        ],
      ],
    }),
  },
});
