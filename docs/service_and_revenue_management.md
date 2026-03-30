# Dokumentasi Manajemen Jenis Cuci, Kategori, dan Akun Pendapatan

Dokumen ini menjelaskan struktur data dan keterkaitan antara **Kategori Paket**, **Jenis Cuci**, serta pemetaannya ke **Akun Pendapatan (Revenue Accounts)** dalam sistem Harmony Laundry.

## 1. Kategori Paket (Category Management)

Kategori Paket digunakan untuk mengelompokkan berbagai jenis layanan cucian berdasarkan karakteristik waktu atau model bisnisnya (misal: Kiloan, Satuan, Karpet).

### Struktur Data (`category_pakets`)
| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | primaryKey | ID unik kategori. |
| `nama` | string | Nama kategori (contoh: "Cuci Kiloan", "Satuan"). |
| `deskripsi` | string | Penjelasan mengenai kategori. |
| `tipe_durasi` | enum | `hari` atau `jam`. |
| `durasi` | int | Lama waktu pengerjaan standar. |

---

## 2. Jenis Cuci (Wash Type Management)

Jenis Cuci adalah detail layanan yang tersedia di dalam suatu kategori. Di sinilah tarif (harga) dan tipe perhitungan didefinisikan.

### Struktur Data (`jenis_cucis`)
| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | primaryKey | ID unik jenis cuci. |
| `uuid_jenis_cuci` | string (UUID) | UUID unik yang digunakan untuk integrasi sistem lain. |
| `id_category_paket` | int (FK) | Relasi ke tabel `category_pakets`. |
| `nama` | string | Nama layanan (contoh: "Cuci Lipat", "Cuci Setrika 2 Hari"). |
| `harga` | float64 | Harga per satuan unit. |
| `tipe` | enum | `per_kilo`, `satuan`, `meter`, atau `kilo_meter`. |
| `keterangan` | string | Catatan tambahan layanan. |
| `gambar` | string | URL/Path gambar layanan (disimpan sebagai string path). |

### Upload Gambar Layanan
Sistem menyediakan endpoint khusus untuk mengunggah gambar layanan:
*   **Endpoint**: `POST /api/v2/jenis-cuci/upload`
*   **Body (Multipart)**: `image` (file)
*   **Response**: `{ "status": 200, "data": { "url": "/uploads/jenis-cuci/..." } }`

Setelah mendapatkan URL gambar, simpan URL tersebut ke field `gambar` saat melakukan **Create** atau **Update** Jenis Cuci.

---

## 3. Akun Pendapatan (Revenue Accounts Integration)

Setiap pendapaatan dari layanan (Jenis Cuci) harus dicatatkan ke akun akuntansi yang sesuai. Sistem menyediakan pemetaan fleksibel antara Jenis Cuci dengan Akun Pendapatan di Bagan Akun (Chart of Accounts).

### Tabel Pemetaan (`service_revenue_accounts`)
Tabel ini berfungsi sebagai jembatan (mapping) antara layanan dengan modul akuntansi.

| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `uuid` | primaryKey | ID unik pemetaan. |
| `uuid_jenis_cuci` | string (FK) | UUID dari `jenis_cucis`. |
| `id_revenue_account` | string (FK) | ID Akun dari Chart of Accounts (Tipe: Revenue). |

### Logika Bisnis Integrasi
1.  **Validasi Akun**: Saat melakukan pemetaan (create/update Jenis Cuci), sistem memvalidasi bahwa `id_revenue_account` yang dimasukkan benar-benar memiliki tipe **Revenue**.
2.  **Resolusi Akun Otomatis**:
    *   Saat transaksi terjadi, sistem akan mencari akun pendapatan yang terhubung dengan `uuid_jenis_cuci` tersebut.
    *   **Fallback (Default)**: Jika tidak ditemukan pemetaan spesifik di tabel `service_revenue_accounts`, sistem akan secara otomatis menggunakan akun default **"Pendapatan Jasa Cuci Kiloan"** dengan ID `9f28e3d5-d62e-4833-a6c9-1a636617af44`.
3.  **Pencatatan Jurnal**: Total harga dari layanan tersebut akan dikreditkan ke akun pendapatan yang telah ditentukan dalam entri jurnal akuntansi.

---

## 4. Alur Kerja (Workflow)

### Menambah Layanan Baru dengan Akun Pendapatan Spesifik
1.  Admin membuat **Kategori Paket** (jika belum ada).
2.  Admin membuat **Jenis Cuci** baru, memilih kategori, menentukan harga, dan memilih **Akun Pendapatan** yang sesuai dari daftar akun.
3.  Sistem menyimpan data layanan ke `jenis_cucis` dan menyimpan pemetaan akun ke `service_revenue_accounts`.
4.  Setiap kali pelanggan memesan layanan tersebut, sistem secara otomatis tahu pendapatan tersebut harus masuk ke pos akun mana di laporan keuangan.
