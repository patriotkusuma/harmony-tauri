import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Sama persis dengan jsconfig.json baseUrl: "src"
      assets: path.resolve(__dirname, "src/assets"),
      components: path.resolve(__dirname, "src/components"),
      views: path.resolve(__dirname, "src/views"),
      layouts: path.resolve(__dirname, "src/layouts"),
      hooks: path.resolve(__dirname, "src/hooks"),
      services: path.resolve(__dirname, "src/services"),
      store: path.resolve(__dirname, "src/store"),
      utils: path.resolve(__dirname, "src/utils"),
      variables: path.resolve(__dirname, "src/variables"),
      routes: path.resolve(__dirname, "src/routes.jsx"),
      chart: "chart.js/auto",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "if-function",
          "abs-percent",
          "function-units",
          "slash-div",
        ],
      },
    },
  },
  server: {
    port: 3010,
    open: false, // Tauri yang buka window-nya
    strictPort: true,
  },
  build: {
    outDir: "build", // Sama dengan CRA, agar tauri.conf.json tidak perlu berubah
    emptyOutDir: true,
  },
  // Vite otomatis load file .env, prefix default adalah VITE_
  // Tapi karena project ini tidak punya env vars, tidak ada yang perlu diubah
});
