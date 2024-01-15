import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import compress from "astro-compress";

import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";

// https://astro.build/config
export default defineConfig({
  scopedStyleStrategy: "attribute",
  site: "https://playsorbonne.fr/",
  integrations: [
    react(),
    // compress(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkDirective],
  },
});
