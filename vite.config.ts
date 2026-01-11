import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("menoo-"),
        },
      },
      customElement: true,
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "MenooSDK",
      formats: ["es", "umd"],
      fileName: (format) => {
        if (format === "es") {
          return "menoo-sdk.js";
        }
        return `menoo-sdk.${format}.js`;
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: "menoo-widget.css",
      },
    },
    sourcemap: true,
    minify: false,
  },
  server: {
    port: 3000,
    open: "/examples/index.html",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
