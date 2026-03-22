# Dokumentasi Rancangan Fitur Afiliasi - Harmony Laundry

Dokumen ini berisi rancangan teknis untuk fitur afiliasi yang mencakup Pengurus Kos dan Customer Umum. Rancangan ini dibuat agar fleksibel (mendukung Kiloan, Satuan, Flat, Progresif, dan Persentase) serta memudahkan pelacakan (tracking) per kos dan rekapan bulanan.

## 1. Arsitektur Database (Draf SQL)

### A. Tabel `affiliates`
Pusat data partner afiliasi (Pengurus Kos atau Customer).

```sql
CREATE TABLE IF NOT EXISTS `affiliates` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('manager','customer') NOT NULL DEFAULT 'manager',
  `group_name` varchar(255) DEFAULT NULL, -- Nama Kos atau Komunitas
  `no_wa` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `level` enum('bronze','silver','gold') DEFAULT 'bronze', -- Untuk sistem Tiered
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### B. Tabel `affiliate_item_fees`
Pengaturan jatah fee per item/layanan.

```sql
CREATE TABLE IF NOT EXISTS `affiliate_item_fees` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `affiliate_type` enum('manager','customer') NOT NULL,
  `id_jenis_cuci` int(11) NOT NULL,
  `fee_type` enum('flat','percentage','progressive') NOT NULL,
  `amount` double(15,2) NOT NULL, 
  `min_qty` double(8,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### C. Tabel `affiliate_commissions`
Log transaksi untuk bahan rekapan bulanan.

```sql
CREATE TABLE IF NOT EXISTS `affiliate_commissions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_affiliate` bigint(20) UNSIGNED NOT NULL,
  `id_pesanan` bigint(20) UNSIGNED NOT NULL,
  `id_customer` bigint(20) UNSIGNED NOT NULL,
  `id_jenis_cuci` int(11) NOT NULL,
  `qty` double(8,2) NOT NULL,
  `base_price` double(15,2) NOT NULL,
  `calculated_fee` double(15,2) NOT NULL,
  `status_pembayaran` enum('pending','verified','paid','canceled') NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 2. Alur Kerja (Workflow) Standar

1.  **Registrasi Partner:** Daftarkan partner ke tabel `affiliates`.
2.  **Setting Fee:** Atur nominal fee di `affiliate_item_fees`.
3.  **Tautan Pelanggan:** Isi `customers.affiliate_id` saat pendaftaran pelanggan baru.
4.  **Trigger Fee:** Saat pesanan berstatus 'selesai' atau 'diambil', sistem menginput data ke `affiliate_commissions` dengan status `pending`.
5.  **Verifikasi:** Setelah 24 jam (masa tunggu komplain), status berubah menjadi `verified`.
6.  **Pembayaran:** Admin melakukan pencairan (bulk payment) di akhir bulan, lalu status berubah menjadi `paid`.

---

## 3. Strategi Lanjutan (Advanced Recommendations)

### A. Keamanan & Verifikasi (Pending/Verified)
*   **Mekanisme:** Komisi tidak langsung bisa dicairkan. Ada masa tunggu (misal 1 hari) untuk memastikan tidak ada refund atau pembatalan transaksi.
*   **Manfaat:** Melindungi margin owner dari kerugian akibat transaksi yang bermasalah.

### B. Notifikasi WhatsApp Otomatis
*   **Mekanisme:** Integrasikan dengan sistem WA Gateway. Kirim pesan ke pengurus setiap kali komisi baru masuk (`pending`).
*   **Contoh Pesan:** *"Halo [Nama], penghuni kos Anda (Si A) baru saja laundry. Komisi Anda bertambah Rp [Nominal]! Total saldo bulan ini: Rp [Total]."*

### C. Manajemen Penghuni (Data Hygiene)
*   **Fitur:** Di dashboard admin, sediakan tombol untuk menonaktifkan penghuni (`is_active_resident = 0`) jika mereka sudah pindah dari kos tersebut.
*   **Manfaat:** Memastikan fee hanya diberikan kepada pengurus selama pelanggan masih menjadi penghuni resmi.

### D. Sistem Tiering (Leveling)
*   **Konsep:** Berikan reward lebih bagi partner yang membawa volume tinggi.
    *   **Bronze:** < 100kg/bulan (Fee standar).
    *   **Silver:** 101-300kg/bulan (Fee + Rp 200/kg).
    *   **Gold:** > 300kg/bulan (Fee + Rp 500/kg).
*   **Manfaat:** Meningkatkan loyalitas pengurus kos agar tetap merekomendasikan laundry Anda.

### E. Transparansi & Reporting (PDF/Dashboard)
*   **Fitur:** Generate laporan bulanan otomatis dalam format PDF.
*   **Isi Laporan:** Ringkasan total berat, total transaksi, total komisi, dan rincian detail per penghuni.
*   **Manfaat:** Menghindari perselisihan hitungan dan meningkatkan kepercayaan partner.

### F. Analisis Profitabilitas (HPP vs Fee)
*   **Fitur:** Tambahkan kalkulasi otomatis yang memotong Margin dengan Fee Afiliasi.
*   **Manfaat:** Memastikan bisnis tetap sehat secara finansial meski memberikan bagi hasil yang kompetitif.

---
*Dokumen ini diperbarui pada: Sabtu, 21 Maret 2026.*
