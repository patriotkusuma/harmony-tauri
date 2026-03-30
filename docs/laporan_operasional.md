# Dokumen Spesifikasi: Laporan Operasional (Operational Reports)

Dokumen ini menguraikan spesifikasi, struktur data, dan kebutuhan sistem untuk fitur **Laporan Operasional** pada sistem POS/Laundry Harmony. Laporan operasional berfokus pada aktivitas harian, pergerakan barang, status produksi, serta evaluasi kinerja karyawan, bukan pada sisi finansial.

---

## 1. Tujuan dan Manfaat Laporan Operasional
Laporan operasional dirancang untuk memberikan transparansi terkait kondisi operasional di setiap outlet. Tujuannya adalah untuk:
- Mengidentifikasi perlambatan proses produksi (bottlenecks).
- Mencegah kehilangan atau keterlambatan pesanan pelanggan.
- Memantau penggunaan bahan baku dan peringatan stok menipis.
- Mengelola kinerja karyawan di setiap shift.
- Audit dan pemantauan pergerakan tag RFID (jika menggunakan fitur RFID).

---

## 2. Jenis-jenis Laporan Operasional Utama

Berikut adalah jenis-jenis laporan operasional yang direkomendasikan untuk dikembangkan:

### A. Laporan Status Pesanan (Order Production Report)
Laporan ini berguna untuk memantau kelancaran alur kerja di bagian produksi/laundry.

*   **Metrik Kunci yang Ditampilkan:**
    *   **Outstanding Orders:** Jumlah pesanan/kilogram pakaian yang belum selesai (Status: Baru, Diproses).
    *   **Overdue Orders:** Pesanan yang melewati tenggat waktu (SLA) namun belum selesai.
    *   **Completed Today:** Total pesanan/kilogram pakaian yang diselesaikan hari ini.
*   **Kolom Tabel Data:**
    *   ID Pesanan / Invoice
    *   Tanggal Masuk & Estimasi Selesai
    *   Nama Pelanggan
    *   Layanan (Jenis Cuci)
    *   Status Saat Ini
    *   Lama Keterlambatan (Bila ada)
*   **Filter Pencarian:** Tanggal, Outlet, Status Pesanan.

### B. Laporan Pemakaian Stok Persediaan (Inventory Usage Report)
Laporan ini melacak "Barang Keluar" di luar penjualan langsung, yaitu pemakaian barang untuk produksi (misal: detergen, plastik, parfum).

*   **Metrik Kunci yang Ditampilkan:**
    *   Total pemakaian per item dalam rentang waktu tertentu.
    *   Sisa stok saat ini.
    *   Peringatan Stok Kurang (*Low Stock Alert*).
*   **Kolom Tabel Data:**
    *   Tanggal Pemakaian / Tanggal Stok Keluar
    *   Nama Barang (Item Persediaan)
    *   Jumlah Dipakai (Qty)
    *   Keterangan (Oleh siapa barang diambil/dialokasikan)
*   **Filter Pencarian:** Tanggal, Outlet, Kategori Barang Persediaan.

### C. Laporan Kinerja Karyawan (Employee Performance Report)
Memantau aktivitas dan tingkat produktivitas masing-masing kasir/karyawan.

*   **Metrik Kunci yang Ditampilkan:**
    *   Jumlah pesanan yang dibuat oleh kasir tertentu.
    *   Beban kerja (Jika ada pencatatan siapa yang mengerjakan proses cuci/setrika).
    *   Log absensi/shift (Jam buka shift & tutup shift).
*   **Kolom Tabel Data:**
    *   Nama Karyawan/Kasir
    *   Total Transaksi yang Diproses
    *   Total Pesanan Diselesaikan
    *   Total Nilai Transaksi (Informasional)
*   **Filter Pencarian:** Rentang Tanggal, Outlet, ID Karyawan.

### D. Laporan Log RFID (RFID Audit & Tracking)
Memanfaatkan integrasi RFID untuk mengaudit keamanan barang dan kelancaran proses.

*   **Metrik Kunci yang Ditampilkan:**
    *   Tag RFID Aktif di Pesanan (Sedang dipakai).
    *   Tag RFID Idle/Detached (Tersedia untuk pesanan baru).
    *   Potensi Barang Hilang (Tag yang belum dipindai dalam waktu lama padahal berstatus aktif).
*   **Kolom Tabel Data:**
    *   UID RFID
    *   ID Pesanan Terkait (Bila terpasang)
    *   Waktu Pindai Terakhir
    *   Lokasi Pindai Terakhir (Outlet/Posisi)
*   **Filter Pencarian:** Status Tag (Attached/Detached), Waktu Terakhir Aktif.

---

## 3. Desain API & Struktur Endpoint (Draft)

Untuk mendukung laporan di atas, disarankan untuk memisahkan endpoint pelaporan atau menggunakan query parameter lanjutan di endpoint yang ada.

**Endpoint Khusus Laporan (Contoh):**

*   `GET /api/v2/reports/operational/orders`
    *   *Query Params*: `start_date`, `end_date`, `outlet_id`, `status`
    *   *Response*: Ringkasan pesanan + Rincian paginasi.
*   `GET /api/v2/reports/operational/inventory-usage`
    *   *Query Params*: `start_date`, `end_date`, `outlet_id`, `item_id`
    *   *Response*: Log pengurangan inventaris untuk produksi + Low stock items.
*   `GET /api/v2/reports/operational/employee-performance`
    *   *Query Params*: `start_date`, `end_date`, `outlet_id`
    *   *Response*: Agregasi jumlah penanganan pesanan per user_id.

---

## 4. Kebutuhan Query Basis Data (Optimasi)

Mengingat query agregasi dapat memperlambat database, laporan-laporan ini memerlukan:
1.  **Indeks (Indexing):** Pastikan ada indeks pada kolom `created_at`, `status`, dan `id_outlet` di tabel terkait (seperti `pesanan`, `inventory_logs`, dll).
2.  **Pagination Berbasis Filter:** Gunakan parameter `page` dan `limit` untuk load data rincian di tabel agar memori aman.
3.  **Pengelompokan (Group By):** Query sering kali menggunakan fungsi seperti `COUNT(*)`, `SUM(...)` dan `GROUP BY Date(created_at)`.

---

## 5. Rencana Implementasi

1.  **Fase 1:** Implementasi API Endpoint untuk **Laporan Status Pesanan** dan penambahan UI sederhana (Tabel Outstanding & Overdue).
2.  **Fase 2:** Implementasi API Endpoint untuk **Laporan Pemakaian Persediaan (Inventory)**.
3.  **Fase 3:** Implementasi Laporan Kinerja Karyawan & Integrasi Audit RFID dengan UI Export ke CSV/PDF.
