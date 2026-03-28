# Antigravity Rules & SOP untuk Project Harmony (Tauri + React)

## 📌 Tech Stack
- **Framework & Build**: Vite + React + Tauri
- **State Management**: Zustand
- **HTTP Client**: Axios (melalui `services/axios-instance.js`)
- **Styling**: Vanilla CSS (terpusat pada folder `src/assets/css/`)
- **UI Dialogs**: SweetAlert2

## 🏗️ Struktur & Arsitektur Direktori
Project ini menerapkan variasi dari pendekatan **Atomic Design Architecture**:
- `src/components/atoms`: Komponen terkecil seperti Avatar, Button, Spinner.
- `src/components/molecules`: Kombinasi atom seperti Form Input, Card, Searchbar.
- `src/components/organisms`: Komponen kompleks yang memiliki business logic atau fetch data seperti Table List, Modal Form, dll.
- `src/views/pages` / `src/pages`: Level halaman utuh yang digunakan sebagai endpoint dari Router.
- `src/hooks`: Custom hooks React (`useCustomer.js`, dsb).
- `src/store`: Manajemen *global state* dengan Zustand (seperti `customerStore.js`).

## 💾 Guideline Store & Data Fetching (Zustand & Axios)
1. **Pemisahan Tanggung Jawab**: Komponen UI tidak boleh melakukan fetch Axios langsung apabila logika tersebut bisa diletakkan di *Zustand store*. Store harus merangkum data, fungsi fetch, loading, dan *error state*.
2. **Standar Pagination & Response**:
   - Jika API memberikan pagination, *store* harus menyimpan `page`, `limit`, dan `total`.
   - **Format terbaru**:
     ```json
     {
         "success": "true",
         "customers": [...], // Atau nama resource lain
         "lenght": 10,
         "total": 1450,
         "page": 1,
         "limit": 10
     }
     ```
   - Selalu lakukan *destructuring* data fallback (contoh: `data ?? []`).
3. **Pesan Error**: Tangkap *error* dari response Axios menggunakan struktur `err?.response?.data?.error ?? 'Terjadi kesalahan'`.

## 🎨 UI & UX Best Practices
1. **Clean & Premium Concept**: Karena menggunakan Vanilla CSS, pastikan kode CSS tertata dengan methodology seperti BEM (misal: `.cust-list__item`). Usahakan UI tetap mulus, transisi smooth, dan pergunakan flex/grid layout yang optimal.
2. **Konfirmasi & Dialog**: Segala bentuk perombakan data (misalnya Delete atau Update krusial) **wajib** menggunakan konfirmasi visual, utamanya melalui SweetAlert2 (`Swal.fire`).
3. **Empty State & Loading**:
   - Selalu sertakan UX berupa kerangka *Skeleton* saat data sedang *loading*.
   - Sediakan komponen *EmptyState* manis apabila hasil dari array bernilai kosong.

## 📄 Standard Operational Procedure (SOP) Development
1. Saat membuat modul/fitur baru, perhatikan struktur file (buat *atom/molecule/organism* yang relevan).
2. Tulis dokumentasi (*Markdown*) terlebih dulu di folder `Documentation/` bila instruksinya cukup masif, sebelum memulai revisi barisan kode.
3. Saat *refactoring*, pisahkan kode yang dirasa terlalu tebal (*monolithic*) ke pecahan komponen yang fungsional.
4. **Sidebar New**: Navigasi utama project sekarang menggunakan `src/components/Sidebar/SidebarNew.jsx`. Pastikan rute baru didaftarkan di sini untuk akses menu.
5. **System Settings Management**: Konfigurasi inti sistem (API Keys, Gemini Model, dsb) wajib dikelola melalui menu **Konfigurasi Inti** di UI, bukan hardcode di `.env` (API `/api/v2/system-settings`).
6. **Perhatikan *Environment***: Jangan hapus *endpoints* lama atau menimpa routing lain yang sudah bekerja pada sistem Tauri dan web.
