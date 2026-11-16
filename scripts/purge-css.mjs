/**
 * purge-css.mjs — pangkas CSS hasil build Vite.
 *
 * Kenapa: Bootstrap `utilities/api` meng-generate ribuan utility class
 * (spacing, responsive variant, grid gap negatif) yang hanya sebagian dipakai
 * aplikasi. Dari pengukuran, ~25% class di CSS hasil build tidak pernah
 * muncul di sumber (~120 KB).
 *
 * Dijalankan OTOMATIS setelah `vite build` (lihat script "build" di package.json).
 *
 * ⚠️ Safelist sengaja longgar: kelas yang dibentuk dinamis (template string),
 * state runtime Bootstrap, dan kelas dark-mode TIDAK boleh ikut terhapus.
 */
import { PurgeCSS } from "purgecss";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "build";
const ASSETS = path.join(OUT_DIR, "assets");

/**
 * Kelas yang WAJIB dipertahankan meskipun tidak terdeteksi di sumber.
 * Ini kelas yang ditambahkan saat runtime oleh Bootstrap/Reactstrap/library.
 */
const SAFELIST = [
  // ── State & transisi Bootstrap ────────────────────────────────
  "show",
  "showing",
  "hide",
  "hiding",
  "fade",
  "active",
  "disabled",
  "collapsed",
  "collapsing",
  "collapse",
  "collapsing",
  "collapsed",
  "open",
  "closed",
  "selected",
  "focus",
  "hover",
  "in",
  "out",
  "visible",
  "invisible",
  "was-validated",
  "is-valid",
  "is-invalid",
  "valid-feedback",
  "invalid-feedback",
  "valid-tooltip",
  "invalid-tooltip",
  // ── Overlay & portal Bootstrap ────────────────────────────────
  "modal-backdrop",
  "modal-dialog",
  "modal-dialog-centered",
  "modal-dialog-scrollable",
  "modal-open",
  "modal-static",
  "offcanvas-backdrop",
  "dropdown-menu",
  "dropdown-menu-end",
  "dropdown-menu-start",
  "dropdown-toggle",
  "tooltip",
  "tooltip-inner",
  "tooltip-arrow",
  "popover",
  "popover-inner",
  "popover-arrow",
  "bs-tooltip-top",
  "bs-tooltip-bottom",
  "bs-tooltip-start",
  "bs-tooltip-end",
  "bs-popover-top",
  "bs-popover-bottom",
  "bs-popover-start",
  "bs-popover-end",
  "toast",
  "toast-header",
  "toast-body",
  "toasting",
  "swal2-shown",
  "swal2-height-auto",
  // ── Scrollbar & layout runtime ───────────────────────────────
  "ps",
  "ps--active-x",
  "ps--active-y",
  "ps--scrolling-x",
  "ps--scrolling-y",
  "ps__rail-x",
  "ps__rail-y",
  "ps__thumb-x",
  "ps__thumb-y",
  "ps__rail-x:hover",
  "perfect-scrollbar-off",
  "navbar-collapse",
  "navbar-expand",
  // ── Tema gelap ───────────────────────────────────────────────
  "dark-mode",
  /^dark/,
  /dark-mode/,
  // ── React-toastify & SweetAlert ──────────────────────────────
  /^Toastify/,
  /^swal2/,
  /^rdt/,
  // ── Font Awesome & Nucleo (dibentuk via prefix) ──────────────
  /^fa-/,
  /^fas$/,
  /^far$/,
  /^fab$/,
  /^ni-/,
  // ── Animasi Argon ────────────────────────────────────────────
  /^fade-/,
  /^sidenav/,
  // ── Responsive & state utilities yang dibentuk dinamis ───────
  /-(sm|md|lg|xl|xxl)-/,
  // ── Grid gap (dipakai lewat template string) ─────────────────
  /^(g|gx|gy)-/,
  /^(gap|row-gap|column-gap)-/,
  // ── Spacing negatif (mt--6 dsb, dipakai Argon) ───────────────
  /^[mp][tbesxy]?--/,
];

/** Pola keyframes yang harus dipertahankan (dipakai animasi Argon/Argon & chat). */
const SAFELIST_KEYS = [/^(fade|shimmer|pulse|msgIn|typing|float|swal2)/];

const contentFiles = [
  "src/**/*.{js,jsx,ts,tsx,html}",
  "index.html",
];
// Kelas juga bisa muncul di bundle JS (string hasil build, mis. `className:"x"`)
for (const f of fs.readdirSync(ASSETS)) {
  if (f.endsWith(".js")) contentFiles.push(path.join(ASSETS, f).replace(/\\/g, "/"));
}

const cssFiles = fs
  .readdirSync(ASSETS)
  .filter((f) => f.endsWith(".css"))
  .map((f) => path.join(ASSETS, f));

const before = cssFiles.reduce((a, f) => a + fs.statSync(f).size, 0);

const result = await new PurgeCSS().purge({
  content: contentFiles,
  css: cssFiles,
  safelist: {
    standard: SAFELIST,
    // `deep` & `keyframes` HANYA menerima string/regex non-global dan
    // tidak boleh berisi entri yang bukan RegExp di PurgeCSS v7.
    deep: [
      /^dark/,
      /^Toastify/,
      /^swal2/,
      /^rdt/,
      /^fa-/,
      /^ni-/,
      /^sidenav/,
      /^sb-/,
      /^ps__/,
      /^ps--/,
      /^collapse/,
      /-(sm|md|lg|xl|xxl)-/,
      /^(g|gx|gy)-/,
      /^(gap|row-gap|column-gap)-/,
      /^[mp][tbesxy]?--/,
    ],
    keyframes: [/^(fade|shimmer|pulse|msgIn|typing|float|swal2)/],
    variables: [/^--/],
  },
  defaultExtractor: (content) => content.match(/[A-Za-z0-9_:/.-]+/g) ?? [],
});

let after = 0;
for (const { file, css } of result) {
  fs.writeFileSync(file, css);
  after += Buffer.byteLength(css);
}

console.log(
  `[purgecss] CSS ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB ` +
    `(−${(((before - after) / before) * 100).toFixed(1)}%)`
);
