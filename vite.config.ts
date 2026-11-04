import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `npm run dev` serves the demos (index.html -> demos/main.tsx).
// `vite build` builds the library into dist/: index.js and style.css.
// The type declarations come from tsc afterwards (tsconfig.lib.json).
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "style",
    },
    rolldownOptions: {
      // react, react/jsx-runtime: the consumer's copy, never a bundled second React
      external: [/^react($|\/)/],
    },
    // public/ holds the demo page's favicons, not library files
    copyPublicDir: false,
  },
});
