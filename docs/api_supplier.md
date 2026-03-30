# Dokumentasi API Supplier (Vendor) V2

Dokumen ini berisi spesifikasi Endpoint untuk Manajemen Data Supplier (vendor untuk perlengkapan / belanja operasional) menggunakan standar Clean Architecture V2.

Semua request wajib menyertakan otorisasi Bearer Token `Authorization: Bearer <token>` karena menggunakan middleware `userMW`.

---

## 1. Mendapatkan Semua Daftar Supplier
Berfungsi untuk menampilkan semua data supplier atau vendor.

- **Endpoint:** `GET /api/v2/suppliers`
- **Response (200 OK):**
```json
{
  "total": 2,
  "data": [
    {
      "id": "20260322103045",
      "name": "Toko Sabun Berkah",
      "contact_person": "Cak Lontong",
      "telpone": "081234567890",
      "email": "berkah@sabun.com",
      "address": "Pasar Keputran Lt.1",
      "supplier_type": "Deterjen",
      "description": "Supplier utama bahan sabun cair",
      "created_at": "2026-03-22T10:30:45Z",
      "updated_at": "2026-03-22T10:30:45Z"
    }
  ]
}
```

---

## 2. Membuat Data Supplier Baru
Mendaftarkan entitas data supplier/vendor baru ke dalam database.

- **Endpoint:** `POST /api/v2/suppliers`
- **Body / JSON Payload:**
```json
{
  "name": "Toko Sabun Berkah",            // Wajib
  "contact_person": "Cak Lontong",        // Opsional
  "telpone": "081234567890",              // Opsional
  "email": "berkah@sabun.com",            // Opsional
  "address": "Pasar Keputran Lt.1",       // Opsional
  "supplier_type": "Deterjen",            // Wajib
  "description": "Supplier sabun cair"    // Opsional
}
```
- **Response (201 Created):**
```json
{
  "message": "Supplier berhasil dibuat",
  "data": {
    "id": "20260322103045",
    "name": "Toko Sabun Berkah",
    "contact_person": "Cak Lontong",
    "telpone": "081234567890",
    "email": "berkah@sabun.com",
    "address": "Pasar Keputran Lt.1",
    "supplier_type": "Deterjen",
    "description": "Supplier sabun cair",
    "created_at": "2026-03-22T10:30:45Z",
    "updated_at": "2026-03-22T10:30:45Z"
  }
}
```

---

## 3. Mendapatkan Detail Satu Supplier
Mendapatkan informasi detail secara spesifik hanya untuk satu supplier menggunakan ID-nya.

- **Endpoint:** `GET /api/v2/suppliers/:id`
- **Path Parameter:** `id` = ID Supplier (Contoh: `20260322103045`)
- **Response (200 OK):**
```json
{
  "data": {
    "id": "20260322103045",
    "name": "Toko Sabun Berkah",
    ...
  }
}
```

---

## 4. Mengubah Data Supplier
Memperbarui data supplier (bisa parsial / tidak wajib melengkapi seluruh data).

- **Endpoint:** `PUT /api/v2/suppliers/:id`
- **Path Parameter:** `id` = ID Supplier
- **Body / JSON Payload:** (Semua field bersifat opsional, isi hanya yang ingin diubah saja)
```json
{
  "telpone": "089888777666",
  "description": "Berubah jadi distributor langsung"
}
```
- **Response (200 OK):**
```json
{
  "message": "Supplier berhasil diperbarui",
  "data": { ... }
}
```

---

## 5. Menghapus Data Supplier
Menghapus permanen master data supplier dari server.

- **Endpoint:** `DELETE /api/v2/suppliers/:id`
- **Path Parameter:** `id` = ID Supplier
- **Response (200 OK):**
```json
{
  "message": "Supplier telah dihapus"
}
```

---

## Kode Error yang umum terjadi:
- **400 Bad Request:** Terjadi kesalahan dalam format JSON yang dikirimkan, atau data mandatory (contoh: `name` dan `supplier_type`) tidak diisi.
- **404 Not Found:** `id` supplier yang dituju untuk proses GET/PUT/DELETE tidak ditemukan dalam database.
- **500 Internal Server Error:** Kegagalan saat memproses *query* ke MySQL Database.
