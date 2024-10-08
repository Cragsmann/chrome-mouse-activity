import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false, // So that popup build files don't get deleted
    rollupOptions: {
      input: {
        content: "./content-script/content-script.ts",
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
