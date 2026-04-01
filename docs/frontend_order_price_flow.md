# Panduan Penanganan Harga Pesanan untuk Frontend & Mobile

Dokumen ini menjelaskan struktur data terbaru dari endpoint `/api/pesanan/get-pesanan/:kode_pesan` (Detail Pesanan) dan metode yang paling tepat untuk menampilkan riwayat harga.

## 1. Perubahan Struktur Payload

Berdasarkan pembaharuan sistem, `DetailPesanans` sekarang berhasil me-*load* seluruh object master `jenis_cuci` beserta atributnya karena perbaikan tipe relasi pada database.

Struktur respon JSON akan terlihat seperti ini:

```json
{
  "data": {
    "kode_pesan": "HRMN-1774865826",
    "total_harga": 15000,
    ...
    "detail_pesanans": [
      {
        "id": 1,
        "id_pesanan": 100,
        "id_jenis_cuci": 5,
        "qty": 2,
        "harga": 5000,           // <--- HARGA DEAL AWAL (GUNAKAN INI)
        "total_harga": 10000,
        "jenis_cuci": {
           "id": 5,
           "nama": "Cuci Kering",
           "harga": 7000,        // <--- HARGA MASTER BERJALAN SAAT INI (JANGAN DIGUNAKAN UNTUK RIWAYAT TRANSAKSI)
           "tipe": "per_kilo"
        }
      }
    ]
  }
}
```

## 2. Peringatan Penting Untuk `item.harga` vs `item.jenis_cuci.harga`

### Kasus:
Sistem lama secara otomatis me-load `jenisCuci.Harga` saat *insert* database (sehingga harga keranjang terbuang), dan secara antarmuka beberapa logic frontend mungkin bergantung pada membaca relasi `item.jenis_cuci.harga`.

### Masalah:
Objek `jenis_cuci` (`item.jenis_cuci.harga`) akan **selalu** berubah mengikuti update katalog admin di master data. Jika Master Harga Cuci Kering dirubah menjadi Rp 7.000, maka `item.jenis_cuci.harga` di invoice lama akan ikut menjadi Rp 7.000, walhasil riwayat total belanja tidak akurat dengan riwayat aslinya yang Rp 5.000.

### Solusi Final (Backend):
Backend saat ini telah dikonfigurasi untuk menangkap harga `Cart` (keranjang kasir) atau Transaksi Offline (`sync`) secara independen dan menguncinya di: **`item.harga`**.

### Action Item untuk Tim Frontend / Android / iOS:
1. Pengecekan *History / Invoice View*:
   Pastikan setiap text renderer harga per pesanan menggunakan properti:
   ✅ **`item.harga`** 
2. Hindari Penggunaan Master View:
   ❌ **`item.jenis_cuci.harga`** (hanya gunakan ini untuk halaman pemilihan keranjang, bukan halaman riwayat order/invoice yang sudah terjadi).
3. Untuk melihat total sub harga, tetap gunakan properti `item.total_harga` yang sudah otomatis dihitung backend berdasarkan `item.qty` * `item.harga`.

## 3. Kompabilitas Endpoint

Panduan `item.harga` ini harus diterapkan secara konsisten ketika memanggil endpoint manapun yang mengembalikan array `detail_pesanans`, termasuk:
- `/api/pesanan/get-pesanan/:kode_pesan` (Legacy)
- `/api/pesanan/get-pesanan` (List Paginated)
- `/api/v2/pesanan/create` (Penciptaan Clean Architecture - jika return body di-pass ke state management frontend).
- `/api/pesanan/sync`
