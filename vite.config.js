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
    // Naikkan ambang peringatan: vendor "sisa" memang besar (reactstrap +
    // bootstrap-js + yup), tapi sudah tidak lagi menahan react-dom.
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        // codeSplitting (API rolldown) menggantikan manualChunks.
        // Bedanya: `priority` membuat grup diproses berurutan, sehingga react-dom
        // benar-benar keluar dari chunk vendor — manualChunks tidak bisa karena
        // rolldown menyatukan seluruh node_modules lebih dulu.
        codeSplitting: {
          groups: [
            // ⚠️ URUTAN PENTING: rolldown memilih grup pertama yang cocok untuk
            // sebuah modul. React harus didaftarkan paling awal agar react-dom
            // tidak terserap ke grup vendor-maps/charts/editor (yang membuat
            // React terduplikasi di tiap chunk halaman).
            {
              name: "vendor-react",
              test: /node_modules[\\/](react|react-dom|scheduler|react-is|use-sync-external-store)[\\/]/,
              priority: 100,
              minSize: 0,
            },
            { name: "vendor-charts", test: /node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/, priority: 100 },
            { name: "vendor-maps", test: /node_modules[\\/](leaflet|react-leaflet|@react-leaflet)[\\/]/, priority: 100 },
            { name: "vendor-editor", test: /node_modules[\\/](@tiptap|prosemirror-[^\\/]+)[\\/]/, priority: 100 },
            { name: "vendor-mqtt", test: /node_modules[\\/]mqtt[\\/]/, priority: 100 },
            { name: "vendor-swal", test: /node_modules[\\/]sweetalert2[\\/]/, priority: 100 },
            { name: "vendor-query", test: /node_modules[\\/]@tanstack[\\/]/, priority: 90 },
            { name: "vendor-router", test: /node_modules[\\/](react-router|react-router-dom|@remix-run[\\/]router)[\\/]/, priority: 90 },
            { name: "vendor-popper", test: /node_modules[\\/](@popperjs|react-popper)[\\/]/, priority: 70 },
            { name: "vendor-http", test: /node_modules[\\/](axios|follow-redirects|form-data)[\\/]/, priority: 70 },
            // Sisa library lain (reactstrap, bootstrap-js, yup, dayjs, ...)
            { name: "vendor", test: /node_modules[\\/]/, priority: 0 },
          ],
        },
      },
    },
  },
  // Vite otomatis load file .env, prefix default adalah VITE_
  // Tapi karena project ini tidak punya env vars, tidak ada yang perlu diubah
});
