import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  scopedStyleStrategy: "attribute",
  site: "https://playsorbonne.fr/",
  integrations: [
    react(),
    // compress(),
  ],
  experimental: {
    devOverlay: false,
  },
});
