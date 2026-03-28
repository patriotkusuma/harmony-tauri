# 📋 Customer Management API

Dokumentasi lengkap API untuk manajemen pelanggan (customer) pada sistem Harmony Laundry.

---

## 📌 Base URL

```
/api
```

> Semua endpoint yang membutuhkan autentikasi menggunakan **Bearer Token** via header `Authorization`.

---

## 🔐 Autentikasi

Semua endpoint Customer **memerlukan autentikasi** kecuali dinyatakan lain.

```
Authorization: Bearer <token>
```

---

## 📦 Data Model

### Customer

| Field                 | Tipe        | Keterangan                                      |
|-----------------------|-------------|------------------------------------------------|
| `id`                  | `uint64`    | ID unik pelanggan                              |
| `uuid_customer`       | `string?`   | UUID pelanggan (nullable)                      |
| `nama`                | `string`    | Nama lengkap pelanggan                         |
| `telpon`              | `string?`   | Nomor telepon pelanggan (nullable)             |
| `keterangan`          | `string?`   | Catatan / keterangan tambahan (nullable)       |
| `tipe`                | `string`    | Tipe pelanggan: `member` / `non_member`        |
| `alamat`              | `string?`   | Alamat lengkap (nullable)                      |
| `latitude`            | `float32`   | Koordinat latitude lokasi                      |
| `longitude`           | `float32`   | Koordinat longitude lokasi                     |
| `id_affiliate`        | `uint64?`   | ID afiliasi yang terhubung (nullable)          |
| `is_active_resident`  | `bool`      | Apakah pelanggan merupakan residen aktif       |
| `total_order`         | `int`       | **Total jumlah order** yang pernah dibuat      |
| `active_orders`       | `array`     | **Daftar order yang sedang aktif/berjalan**    |

### ActiveOrder (Order Aktif / Berjalan)

| Field                  | Tipe        | Keterangan                                    |
|------------------------|-------------|----------------------------------------------|
| `id`                   | `uint64`    | ID order                                     |
| `kode_pesan`           | `string`    | Kode unik order                              |
| `id_pelanggan`         | `uint64`    | ID pelanggan pemilik order                   |
| `total_harga`          | `float64`   | Total harga order                            |
| `status`               | `string`    | Status order saat ini                        |
| `tanggal_pesan`        | `datetime`  | Tanggal order dibuat                         |
| `tanggal_selesai`      | `datetime?` | Tanggal order selesai (nullable)             |
| `tanggal_ambil`        | `datetime?` | Tanggal pengambilan (nullable)               |
| `keterangan`           | `string?`   | Catatan order (nullable)                     |
| `status_pembayaran`    | `string?`   | Status pembayaran (nullable)                 |
| `antar`                | `int`       | Flag antar (1 = diantar, 0 = tidak)          |
| `paid`                 | `int`       | Status lunas (1 = lunas, 0 = belum)          |
| `notify_pesan`         | `int`       | Notifikasi pesan terkirim                    |
| `notify_selesai`       | `int`       | Notifikasi selesai terkirim                  |
| `setrika_at`           | `datetime?` | Waktu mulai setrika (nullable)               |
| `selesai_at`           | `datetime?` | Waktu selesai keseluruhan (nullable)         |
| `diproses_at`          | `datetime?` | Waktu mulai diproses (nullable)              |
| `siap_diambil_at`      | `datetime?` | Waktu siap diambil (nullable)                |
| `id_outlet`            | `string?`   | ID outlet terkait (nullable)                 |
| `transaction_id`       | `string?`   | ID transaksi pembayaran (nullable)           |
| `bill_id`              | `uint64?`   | ID tagihan terkait (nullable)                |
| `id_pegawai`           | `int?`      | ID pegawai yang menangani (nullable)         |
| `created_at`           | `datetime?` | Waktu dibuat                                 |
| `updated_at`           | `datetime?` | Waktu terakhir diupdate                      |

---

## 🗂️ Daftar Endpoint

| Method   | Endpoint                     | Deskripsi                                    |
|----------|------------------------------|----------------------------------------------|
| `GET`    | `/api/v2/customer`           | Ambil daftar semua customer (paginasi)       |
| `POST`   | `/api/v2/customer`           | Buat customer baru                           |
| `GET`    | `/api/v2/customer/:id`       | Ambil detail customer berdasarkan ID         |
| `PUT`    | `/api/v2/customer/:id`       | Update data customer                         |
| `DELETE` | `/api/v2/customer/:id`       | Hapus customer                               |
| `POST`   | `/api/customer/by-phones`    | Cari customer berdasarkan nomor telepon (batch) |
| `GET`    | `/api/customer/get-customer` | Cari customer (nama/email/telpon) — Legacy   |

---

## 📖 Detail Endpoint

---

### 1. GET `/api/v2/customer` — Daftar Customer

Mengambil daftar seluruh customer dengan dukungan pencarian dan paginasi.  
Setiap customer menyertakan **total order** dan **daftar order aktif**.

**Query Parameters:**

| Parameter | Tipe     | Default | Keterangan                  |
|-----------|----------|---------|-----------------------------|
| `search`  | `string` | `""`    | Kata kunci pencarian (nama) |
| `page`    | `int`    | `1`     | Halaman saat ini            |
| `limit`   | `int`    | `10`    | Jumlah data per halaman     |

**Response sukses `200 OK`:**

```json
{
  "data": [
    {
      "id": 1,
      "uuid_customer": "abc-123-xyz",
      "nama": "Budi Santoso",
      "telpon": "081234567890",
      "keterangan": "Pelanggan setia",
      "tipe": "member",
      "alamat": "Jl. Merdeka No. 10",
      "latitude": -6.2,
      "longitude": 106.8,
      "id_affiliate": null,
      "is_active_resident": true,
      "total_order": 15,
      "active_orders": [
        {
          "id": 101,
          "kode_pesan": "ORD-2026-001",
          "id_pelanggan": 1,
          "total_harga": 75000,
          "status": "diproses",
          "tanggal_pesan": "2026-03-20T09:00:00Z",
          "tanggal_selesai": null,
          "tanggal_ambil": null,
          "status_pembayaran": "unpaid",
          "paid": 0,
          "antar": 1,
          "created_at": "2026-03-20T09:00:00Z",
          "updated_at": "2026-03-20T10:00:00Z"
        }
      ]
    }
  ],
  "total": 100,
  "limit": 10,
  "page": 1
}
```

> **Catatan:** Field `total_order` mencerminkan **total semua order** yang pernah dibuat oleh pelanggan tersebut (historis), sedangkan `active_orders` hanya menampilkan order yang **sedang berjalan/belum selesai**.

---

### 2. POST `/api/v2/customer` — Buat Customer Baru

Membuat data pelanggan baru.

**Request Body (JSON):**

| Field                 | Tipe      | Wajib | Keterangan                                       |
|-----------------------|-----------|-------|--------------------------------------------------|
| `nama`                | `string`  | ✅ Ya | Nama lengkap pelanggan                           |
| `telpon`              | `string`  | ❌    | Nomor telepon                                    |
| `alamat`              | `string`  | ❌    | Alamat lengkap                                   |
| `keterangan`          | `string`  | ❌    | Catatan tambahan                                 |
| `latitude`            | `float32` | ❌    | Koordinat latitude                               |
| `longitude`           | `float32` | ❌    | Koordinat longitude                              |
| `id_affiliate`        | `uint64`  | ❌    | ID afiliasi (jika ada)                           |
| `is_active_resident`  | `bool`    | ❌    | Status residen aktif (default: `true`)           |

**Contoh Request:**

```json
{
  "nama": "Siti Rahayu",
  "telpon": "08987654321",
  "alamat": "Jl. Sudirman No. 5",
  "keterangan": "Pelanggan baru dari referral",
  "latitude": -6.21,
  "longitude": 106.85,
  "id_affiliate": 3,
  "is_active_resident": true
}
```

**Response sukses `200 OK`:**

```json
{
  "message": "customer berhasil dibuat",
  "data": {
    "id": 42,
    "uuid_customer": "def-456-uvw",
    "nama": "Siti Rahayu",
    "telpon": "08987654321",
    "keterangan": "Pelanggan baru dari referral",
    "tipe": "not_member",
    "alamat": "Jl. Sudirman No. 5",
    "latitude": -6.21,
    "longitude": 106.85,
    "id_affiliate": 3,
    "is_active_resident": true,
    "total_order": 0,
    "active_orders": []
  }
}
```

**Response error `400 Bad Request`:**

```json
{
  "error": "invalid request body"
}
```

---

### 3. GET `/api/v2/customer/:id` — Detail Customer

Mengambil detail satu customer berdasarkan ID, termasuk **total order** dan **daftar order aktif** miliknya.

**Path Parameter:**

| Parameter | Tipe     | Keterangan                  |
|-----------|----------|-----------------------------|
| `id`      | `uint64` | ID unik customer            |

**Contoh Request:**

```
GET /api/v2/customer/1
```

**Response sukses `200 OK`:**

```json
{
  "data": {
    "id": 1,
    "uuid_customer": "abc-123-xyz",
    "nama": "Budi Santoso",
    "telpon": "081234567890",
    "keterangan": "Pelanggan setia",
    "tipe": "member",
    "alamat": "Jl. Merdeka No. 10",
    "latitude": -6.2,
    "longitude": 106.8,
    "id_affiliate": null,
    "is_active_resident": true,
    "total_order": 15,
    "active_orders": [
      {
        "id": 101,
        "kode_pesan": "ORD-2026-001",
        "id_pelanggan": 1,
        "total_harga": 75000,
        "status": "diproses",
        "tanggal_pesan": "2026-03-20T09:00:00Z",
        "tanggal_selesai": null,
        "status_pembayaran": "unpaid",
        "paid": 0,
        "antar": 1,
        "diproses_at": "2026-03-20T09:30:00Z",
        "siap_diambil_at": null,
        "created_at": "2026-03-20T09:00:00Z",
        "updated_at": "2026-03-20T10:00:00Z"
      }
    ]
  }
}
```

**Response error `404 Not Found`:**

```json
{
  "error": "customer not found"
}
```

---

### 4. PUT `/api/v2/customer/:id` — Update Customer

Memperbarui data pelanggan yang sudah ada.

**Path Parameter:**

| Parameter | Tipe     | Keterangan       |
|-----------|----------|------------------|
| `id`      | `uint64` | ID unik customer |

**Request Body (JSON):**

| Field                 | Tipe      | Wajib | Keterangan                        |
|-----------------------|-----------|-------|-----------------------------------|
| `nama`                | `string`  | ✅ Ya | Nama lengkap pelanggan            |
| `telpon`              | `string`  | ❌    | Nomor telepon                     |
| `alamat`              | `string`  | ❌    | Alamat                            |
| `keterangan`          | `string`  | ❌    | Catatan tambahan                  |
| `latitude`            | `float32` | ❌    | Koordinat latitude                |
| `longitude`           | `float32` | ❌    | Koordinat longitude               |
| `id_affiliate`        | `uint64`  | ❌    | ID afiliasi (jika ada)            |
| `is_active_resident`  | `bool`    | ❌    | Status residen aktif              |

**Contoh Request:**

```json
{
  "nama": "Budi Santoso",
  "telpon": "081234567890",
  "alamat": "Jl. Merdeka No. 10, RT 03",
  "keterangan": "Update alamat baru",
  "latitude": -6.21,
  "longitude": 106.82,
  "is_active_resident": true
}
```

**Response sukses `200 OK`:**

```json
{
  "message": "customer berhasil diupdate",
  "data": {
    "id": 1,
    "uuid_customer": "abc-123-xyz",
    "nama": "Budi Santoso",
    "telpon": "081234567890",
    "keterangan": "Update alamat baru",
    "tipe": "member",
    "alamat": "Jl. Merdeka No. 10, RT 03",
    "latitude": -6.21,
    "longitude": 106.82,
    "id_affiliate": null,
    "is_active_resident": true,
    "total_order": 15,
    "active_orders": [...]
  }
}
```

**Response error `400 Bad Request`:**

```json
{
  "error": "id tidak valid"
}
```

**Response error `500 Internal Server Error`:**

```json
{
  "error": "customer not found"
}
```

---

### 5. DELETE `/api/v2/customer/:id` — Hapus Customer

Menghapus data pelanggan berdasarkan ID.

**Path Parameter:**

| Parameter | Tipe     | Keterangan       |
|-----------|----------|------------------|
| `id`      | `uint64` | ID unik customer |

**Contoh Request:**

```
DELETE /api/v2/customer/42
```

**Response sukses `200 OK`:**

```json
{
  "message": "customer berhasil dihapus"
}
```

**Response error `400 Bad Request`:**

```json
{
  "error": "id tidak valid"
}
```

**Response error `500 Internal Server Error`:**

```json
{
  "error": "gagal menghapus customer"
}
```

---

### 6. POST `/api/customer/by-phones` — Cari Customer by Nomor Telepon (Batch)

Mengambil data customer berdasarkan daftar nomor telepon sekaligus (batch).  
Digunakan untuk mengecek apakah customer dengan nomor tertentu memiliki order aktif.

**Request Body (JSON):**

| Field    | Tipe       | Wajib | Keterangan                       |
|----------|------------|-------|----------------------------------|
| `phones` | `[]string` | ✅ Ya | Array nomor telepon yang dicari  |

**Contoh Request:**

```json
{
  "phones": ["081234567890", "08987654321", "082112345678"]
}
```

**Response sukses `200 OK`:**

```json
{
  "groups": [
    {
      "phone": "081234567890",
      "has_active_order": true,
      "customers": [
        {
          "id": 1,
          "nama": "Budi Santoso",
          "telpon": "081234567890",
          "alamat": "Jl. Merdeka No. 10",
          "keterangan": "Pelanggan setia",
          "tipe": "member",
          "has_active_order": true,
          "active_order": {
            "id": 101,
            "kode_pesan": "ORD-2026-001",
            "status": "diproses",
            "total_harga": 75000,
            "tanggal_pesan": "2026-03-20T09:00:00Z"
          }
        }
      ],
      "active_orders": [
        {
          "id": 101,
          "kode_pesan": "ORD-2026-001",
          "status": "diproses",
          "total_harga": 75000,
          "tanggal_pesan": "2026-03-20T09:00:00Z",
          "customer": {
            "id": 1,
            "nama": "Budi Santoso",
            "telpon": "081234567890"
          }
        }
      ]
    },
    {
      "phone": "08987654321",
      "has_active_order": false,
      "customers": [
        {
          "id": 42,
          "nama": "Siti Rahayu",
          "telpon": "08987654321",
          "tipe": "not_member",
          "has_active_order": false,
          "active_order": null
        }
      ],
      "active_orders": []
    }
  ],
  "total_groups": 2
}
```

---

### 7. GET `/api/customer/get-customer` — Cari Customer (Legacy)

> ⚠️ **Endpoint Legacy** — Gunakan `/api/v2/customer` untuk versi baru.

Mencari customer berdasarkan nama, email, atau nomor telepon.

**Query Parameters:**

| Parameter | Tipe     | Keterangan          |
|-----------|----------|---------------------|
| `nama`    | `string` | Filter berdasarkan nama  |
| `email`   | `string` | Filter berdasarkan email |
| `telpon`  | `string` | Filter berdasarkan telepon |

**Contoh Request:**

```
GET /api/customer/get-customer?nama=Budi
```

**Response sukses `200 OK`:**

```json
{
  "success": "true",
  "customers": [...],
  "lenght": 3
}
```

---

## ℹ️ Informasi Tambahan

### Cek Total Order Customer

Field `total_order` pada setiap respons customer menampilkan **total seluruh order** yang pernah dibuat pelanggan tersebut sepanjang masa, terlepas dari status order (selesai, dibatalkan, dsb).

### Cek Order Aktif Customer

Field `active_orders` berisi array order yang **sedang berjalan** (belum selesai/belum diambil). Jika pelanggan tidak memiliki order aktif, nilai ini akan berupa array kosong `[]`.

**Cara cepat mengecek order aktif:**

```
GET /api/v2/customer/{id}
```

Contoh respons — customer dengan 2 order aktif:

```json
{
  "data": {
    "id": 5,
    "nama": "Ahmad Rizki",
    "total_order": 8,
    "active_orders": [
      { "id": 201, "kode_pesan": "ORD-2026-010", "status": "diterima", "total_harga": 50000 },
      { "id": 205, "kode_pesan": "ORD-2026-014", "status": "diproses", "total_harga": 85000 }
    ]
  }
}
```

### Nilai Status Order (`status`)

| Status         | Keterangan                              |
|----------------|-----------------------------------------|
| `diterima`     | Order baru diterima, belum diproses     |
| `diproses`     | Order sedang dalam proses pencucian     |
| `setrika`      | Order sedang dalam proses setrika       |
| `siap_diambil` | Order siap diambil oleh pelanggan       |
| `selesai`      | Order sudah diambil / selesai           |
| `dibatalkan`   | Order dibatalkan                        |

### Nilai Tipe Customer (`tipe`)

| Tipe          | Keterangan                          |
|---------------|-------------------------------------|
| `member`      | Pelanggan terdaftar sebagai member  |
| `non_member`  | Pelanggan biasa tanpa keanggotaan   |
| `not_member`  | Sama dengan `non_member` (legacy)   |

---

## 🔁 Contoh Alur Penggunaan

### Skenario 1: Tambah pelanggan baru dan cek ordernya

```
1. POST /api/v2/customer        → Buat pelanggan baru
2. GET  /api/v2/customer/{id}   → Cek detail + total order + order aktif
```

### Skenario 2: Mencari pelanggan dan melihat riwayat order

```
1. GET /api/v2/customer?search=Budi&page=1&limit=10
   → Dapatkan daftar customer yang namanya mengandung "Budi"
   → Setiap item sudah memuat total_order dan active_orders
```

### Skenario 3: Update data pelanggan

```
1. GET  /api/v2/customer/{id}   → Ambil data terkini
2. PUT  /api/v2/customer/{id}   → Update dengan data baru
```

### Skenario 4: Hapus pelanggan

```
1. GET    /api/v2/customer/{id}   → Pastikan pelanggan ada
2. DELETE /api/v2/customer/{id}   → Hapus data pelanggan
```

---

*Dokumentasi dibuat pada: 2026-03-23*  
*Versi API: v2*
