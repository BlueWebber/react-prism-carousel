import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `npm run dev`: serves the demos (index.html -> demos/main.tsx).
// `vite build`: the library, into dist/ (index.js and style.css). index.js imports
//   style.css itself, so consumers don't have to. The type declarations come from
//   tsc afterwards (tsconfig.lib.json).
// `vite build --mode demos`: the demo site, into dist-demos/, for GitHub Pages.
export default defineConfig(({ mode }) =>
  mode === "demos"
    ? {
        plugins: [react()],
        // GitHub Pages serves the site from /react-prism-carousel/
        base: "/react-prism-carousel/",
        build: { outDir: "dist-demos" },
      }
    : {
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
            output: {
              // Library mode moves the CSS into style.css and drops the import from
              // the JS. This puts it back, so the consumer's bundler loads the CSS
              // automatically ("sideEffects" in package.json keeps it from being
              // tree-shaken away).
              banner: 'import "./style.css";',
            },
          },
          // public/ holds the demo page's favicons, not library files
          copyPublicDir: false,
        },
      },
);
