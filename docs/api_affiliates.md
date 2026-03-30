# Dokumentasi API Afiliasi (V2 Clean Architecture)

Dokumen ini berisi daftar endpoint untuk mengelola fitur afiliasi di sistem Laundry.

## Base URL
Semua endpoint diakses dengan awalan: `/api/v2/affiliates`

## Otorisasi
Semua endpoint memerlukan Bearer Token (`Authorization: Bearer <token>`) karena menggunakan V2 Clean Middleware (`userMW`).

---

## 1. Mendaftarkan Partner Afiliasi
Mendaftarkan Pengurus Kos atau Customer sebagai partner Afiliasi.

- **Endpoint:** `POST /api/v2/affiliates`
- **Body / JSON Payload:**
```json
{
  "name": "Budi Setiawan",
  "type": "manager",        // "manager" atau "customer"
  "group_name": "Kos Putra A",
  "no_wa": "081234567890",
  "status": "active",       // "active" atau "inactive"
  "level": "bronze"         // "bronze", "silver", atau "gold"
}
```
- **Response (201 Created):**
```json
{
  "message": "Affiliate created successfully",
  "data": {
    "id": 1,
    "name": "Budi Setiawan",
    "type": "manager",
    "group_name": "Kos Putra A",
    "no_wa": "081234567890",
    "status": "active",
    "level": "bronze"
  }
}
```

---

## 2. Mendapatkan Daftar Afiliasi
Mendapatkan semua daftar afiliasi.

- **Endpoint:** `GET /api/v2/affiliates`
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Budi Setiawan",
      "type": "manager",
      "group_name": "Kos Putra A",
      "no_wa": "081234567890",
      "status": "active",
      "level": "bronze"
    }
  ]
}
```

---

## 2.a Mengedit Data Partner Afiliasi
Memperbarui informasi partner afiliasi yang sudah ada.

- **Endpoint:** `PUT /api/v2/affiliates/:id`
- **Body / JSON Payload:** (Sama dengan format Create, isi parameter yang ingin diubah)
- **Response (200 OK):**
```json
{
  "message": "Affiliate updated successfully",
  "data": { ... }
}
```

---

## 2.b Menghapus Partner Afiliasi
Menghapus data partner afiliasi yang sudah tidak aktif.

- **Endpoint:** `DELETE /api/v2/affiliates/:id`
- **Response (200 OK):**
```json
{
  "message": "Affiliate deleted successfully"
}
```

---

## 3. Mengatur Fee Layanan
Mengatur besaran fee per jenis cucian untuk tipe afiliasi tertentu.

- **Endpoint:** `POST /api/v2/affiliates/fees`
- **Body / JSON Payload:**
```json
{
  "affiliate_type": "manager", // Target penerima (manager/customer)
  "id_jenis_cuci": 1,          // ID Layanan
  "fee_type": "flat",          // "flat", "percentage", atau "progressive"
  "amount": 2500,              // Rp 2.500 jika flat, atau % jika percentage
  "min_qty": 3                 // Minimal berat/jumlah (Pilihan)
}
```
- **Response (200 OK):**
```json
{
  "message": "Fee set successfully"
}
```

---

## 4. Mendapatkan Daftar Fee Layanan
Mendapatkan konfigurasi fee layanan berdasarkan jenis afiliasi.

- **Endpoint:** `GET /api/v2/affiliates/fees?type=manager`
- **Query Parameter:**
  - `type` (Wajib): "manager" atau "customer"
- **Response (200 OK):**
```json
{
  "data": [
    {
      "ID": 1,
      "AffiliateType": "manager",
      "IdJenisCuci": 1,
      "FeeType": "flat",
      "Amount": 2500,
      "MinQty": 3,
      "CreatedAt": "2026-03-21T10:00:00Z",
      "UpdatedAt": "2026-03-21T10:00:00Z"
    }
  ]
}
```

---

## 4.a Mengedit Skema Fee Layanan
Memperbarui skema konfigurasi fee afiliasi.

- **Endpoint:** `PUT /api/v2/affiliates/fees/:id`
- **Body / JSON Payload:** (Sama seperti Set Fee / Create Fee)
- **Response (200 OK):**
```json
{
  "message": "Fee updated successfully"
}
```

---

## 4.b Menghapus Skema Fee Layanan
Menghapus konfigurasi fee layanan, misalnya ketika promo dihentikan.

- **Endpoint:** `DELETE /api/v2/affiliates/fees/:id`
- **Response (200 OK):**
```json
{
  "message": "Fee deleted successfully"
}
```

---

## 5. Mendapatkan Riwayat Komisi
Mendapatkan laporan riwayat komisi per pengguna afiliasi.

- **Endpoint:** `GET /api/v2/affiliates/:id/commissions`
- **Query Parameter (Pilihan):**
  - `status`: Filter status komisi ("pending", "verified", "paid", "canceled")
- **Response (200 OK):**
```json
{
  "data": [
    {
      "ID": 1,
      "IdAffiliate": 1,
      "IdPesanan": 105,
      "IdCustomer": 32,
      "IdJenisCuci": 1,
      "Qty": 5.5,
      "BasePrice": 30000,
      "CalculatedFee": 2500,
      "StatusPembayaran": "pending",
      "PaidAt": null,
      "CreatedAt": "2026-03-21T10:30:00Z"
    }
  ]
}
```

---

## 6. Verifikasi Komisi (Setelah 24 Jam)
Mengubah status komisi dari `pending` ke `verified` yang menandakan pesanan selesai tanpa complain/refund.

- **Endpoint:** `PUT /api/v2/affiliates/commissions/:id/confirm`
- **Response (200 OK):**
```json
{
  "message": "Commission confirmed successfully"
}
```

---

## 7. Melakukan Pembayaran Komisi (Pencairan Saldo)
Tandai komisi telah dibayarkan ke partner (dicairkan).

- **Endpoint:** `PUT /api/v2/affiliates/commissions/:id/pay`
- **Response (200 OK):**
```json
{
  "message": "Commission paid successfully"
}
```

## 8. Integrasi dengan Manajemen Pelanggan (Customer)
Untuk menautkan seorang pelanggan kos dengan sebuah afiliasi pengurus kos, sistem mendukung parameter `id_affiliate` pada semua versi API Customer.

### A. API Customer V2 (`/api/v2/customer`)
Request Body (`POST` atau `PUT`):
```json
{
  "nama": "Mahasiswa A",
  "id_affiliate": 1,
  "is_active_resident": true
}
```

### B. API Customer Legacy (`/api/customer/create`)
Request Body (`POST`):
```json
{
  "nama": "Mahasiswa B",
  "telpon": "0812...",
  "id_affiliate": 1
}
```

---

## 9. Mendapatkan Daftar Pelanggan per Afiliasi
Melihat siapa saja pelanggan yang terdaftar di bawah pengurus kos tertentu.

- **Endpoint:** `GET /api/v2/affiliates/:id/customers`
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": 10,
      "nama": "Andi Mahasiswa",
      "telpon": "0812345678",
      "alamat": "Kamar 102"
    }
  ]
}
```

---

## 10. Menghubungkan Daftar Pelanggan (Bulk Link)
Menghubungkan banyak pelanggan sekaligus ke seorang pengurus kos.

- **Endpoint:** `POST /api/v2/affiliates/:id/customers`
- **Body / JSON Payload:**
```json
{
  "customer_ids": [10, 11, 12]
}
```
- **Response (200 OK):**
```json
{
  "message": "Customers linked successfully"
}
```

---

## 11. Mendapatkan Daftar Transaksi per Affiliate
Melihat riwayat pesanan yang dilakukan oleh customer di bawah affiliate ini beserta komisi yang dihasilkan.

- **Endpoint:** `GET /api/v2/affiliates/:id/transactions`
- **Response (200 OK):**
```json
{
  "data": [
    {
      "order_id": 105,
      "kode_pesan": "HRMN-12345678",
      "customer_id": 32,
      "customer_nama": "Andi Mahasiswa",
      "total_harga": 35000,
      "commission": 2500,
      "created_at": "2026-03-21T10:30:00Z"
    }
  ]
}
```

---

## 12. Mekanisme Pencatatan Otomatis (Automated Recording)
Sistem sekarang sudah mendukung pencatatan komisi otomatis tanpa perlu memanggil API komisi secara manual:

1. **Trigger Baru Pesanan**: Setiap kali pesanan dibuat (baik melalui API V2 `CreateOrderWithBill` maupun API Legacy `StorePesanan`), sistem akan secara otomatis mengecek apakah pelanggan terhubung dengan Afiliasi aktif.
2. **Kalkulasi Fee**: Sistem akan mengambil aturan fee (Fee Rules) yang sesuai dengan layanan yang dipesan dan menghitung nilai komisi secara real-time berdasarkan biaya layanan tersebut.
3. **Status Pending**: Komisi baru akan dicatat dengan status `pending` dan akan muncul di daftar komisi afiliator.
4. **Idempotensi**: Sistem menjamin tidak ada pencatatan ganda untuk ID Pesanan yang sama, mencegah komisi ganda saat status pesanan diperbarui.

---

## Catatan Tambahan (Error Handling)
Sistem menggunakan spesifikasi standar RESTful API untuk memberikan respons kegagalan yang jelas:
- **400 Bad Request:** Payload salah atau data kurang. Response JSON menyertakan detail pesan error (`details`).
- **401 Unauthorized:** Akses API tanpa token pengguna yang benar.
- **500 Internal Server Error:** Gagal memproses query database atau eksekusi logika. Termasuk Logging di server internal.
