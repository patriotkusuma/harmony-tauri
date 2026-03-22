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

## 5. Mendapatkan Riwayat Komisi
Mendapatkan laporan riwayat komisi per pengguna afiliasi.

- **Endpoint:** `GET /api/v2/affiliates/:affiliate_id/commissions`
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

---

## Catatan Tambahan (Error Handling)
Sistem menggunakan spesifikasi standar RESTful API untuk memberikan respons kegagalan yang jelas:
- **400 Bad Request:** Payload salah atau data kurang. Response JSON menyertakan detail pesan error (`details`).
- **401 Unauthorized:** Akses API tanpa token pengguna yang benar.
- **500 Internal Server Error:** Gagal memproses query database atau eksekusi logika. Termasuk Logging di server internal.
