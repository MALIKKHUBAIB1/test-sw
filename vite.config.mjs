import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/test-sw/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "sw.js", // This will copy sw.js
          dest: ".", // into dist/
        },
        {
          src: "manifest.json", // if you also want this copied
          dest: ".",
        },
      ],
    }),
  ],
});
