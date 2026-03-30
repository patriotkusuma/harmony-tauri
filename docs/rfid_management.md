# Dokumentasi API: RFID Management & Discovery

Dokumen ini menjelaskan endpoint yang digunakan oleh Admin untuk mengelola data master kartu RFID di dalam sistem.

---

## 1. Daftar Semua RFID (Discovery & List)

Digunakan untuk melihat semua kartu RFID yang pernah di-tap ke sistem (baik yang sudah di-_assign_ maupun yang masih kosong/Raw).

**Endpoint:** `GET /api/rfids`  
**Auth:** Bearer Token (Admin / Owner)  
**Query Params (Opsional):**

- `page`: Halaman ke- (default: 1)
- `limit`: Jumlah data per halaman (default: 10)
- `search`: Pencarian berdasarkan `rfid_code`
- `type`: Filter berdasarkan tipe kartu (`basket`, `machine`, `operator`)
- `status`: Filter berdasarkan status (`AVAILABLE`, `ASSIGNED`, `DISABLED`)

**Contoh Request:**

```http
GET /api/rfids?page=1&limit=10&type=basket&status=ASSIGNED
```

**Contoh Respons (200 OK):**

```json
{
  "data": [
    {
      "id": 10,
      "code": "E5F6G7H8",
      "status": "ASSIGNED",
      "type": "operator",
      "user_id": 5,
      "assigned_order": null,
      "assigned_machine": null,
      "assigned_user": {
        "user_id": 5,
        "user_name": "Budi Operator",
        "user_role": "pegawai"
      }
    },
    {
      "id": 11,
      "code": "A1B2C3D4",
      "status": "ASSIGNED",
      "type": "basket",
      "user_id": null,
      "assigned_order": {
        "order_id": 101,
        "order_code": "ORD-20260304-001",
        "order_status": "cuci",
        "customer_name": "Siska",
        "customer_phone": "08123456789"
      },
      "assigned_machine": null,
      "assigned_user": null
    },
    {
      "id": 12,
      "code": "F9G8H7I6",
      "status": "ASSIGNED",
      "type": "machine",
      "user_id": null,
      "assigned_order": null,
      "assigned_machine": {
        "machine_id": 3,
        "machine_uuid": "a4af2976-2f44-4099-84a3-636ee763e3ce",
        "machine_name": "Mesin Cuci A",
        "machine_type": "cuci",
        "machine_status": "aktif"
      },
      "assigned_user": null
    },
    {
      "id": 13,
      "code": "C3D4E5F6",
      "status": "AVAILABLE",
      "type": "basket",
      "user_id": null,
      "assigned_order": null,
      "assigned_machine": null,
      "assigned_user": null
    }
  ],
  "limit": 10,
  "page": 1,
  "total": 4
}
```

> **Cara baca field assignment:**
>
> - `assigned_order` → hanya muncul jika RFID ini **sedang aktif terikat ke pesanan** (belum di-detach)
> - `assigned_machine` → hanya muncul jika RFID ini terdaftar di tabel `mesins`
> - `assigned_user` → hanya muncul jika RFID ini terhubung ke akun pegawai
> - Jika ketiganya `null` → RFID bebas / `AVAILABLE`
>
> **⚡ Tip debugging RFID nyangkut:** Jika status `AVAILABLE` tapi `assigned_order` masih isi (atau sebaliknya), itu indikasi data tidak konsisten yang perlu di-detach manual via `POST /api/rfid/detach`.

---

## 2. Mendaftarkan Kartu RFID Mentah (Create Raw Card)

Endpoint ini digunakan saat Admin memiliki tumpukan kartu fisik baru dan ingin meregistrasikannya ke sistem sebelum ditempel ke mesin atau diberikan ke pegawai.

_(Catatan: Sistem memiliki fitur **Auto-Create** saat scan. Endpoint ini berguna jika Admin ingin mendaftarkan banyak kartu sekaligus dengan tipe tertentu melalui UI)._

**Endpoint:** `POST /api/rfids`  
**Auth:** Bearer Token (Admin / Owner)  
**Payload:**

```json
{
  "rfid_code": "0987654321",
  "type": "basket"
}
```

_Note: `type` opsional. Jika dikosongkan, defaultnya adalah `basket`._

**Contoh Respons (201 Created):**

```json
{
  "message": "RFID berhasil didaftarkan",
  "data": {
    "ID": 15,
    "Code": "0987654321",
    "Status": "AVAILABLE",
    "Type": "basket",
    "UserID": null
  }
}
```

---

## 3. Assign RFID ke Pesanan (Attach to Order)

Menghubungkan kartu RFID (keranjang) ke sebuah pesanan yang sedang aktif. Jika RFID belum terdaftar, sistem akan **auto-create** kartu tersebut.

**Endpoint:** `POST /api/rfid/attach`  
**Auth:** Bearer Token  
**Payload:**

```json
{
  "order_id": 101,
  "rfid_code": "A1B2C3D4"
}
```

**Respons Sukses (200 OK):**

```json
{
  "status": "ok"
}
```

**Respons Konflik (409 Conflict):** _(RFID sudah dipakai order lain)_

```json
{
  "message": "RFID ini sudah terikat ke pesanan milik Siska. Harap lepas terlebih dahulu atau gunakan keranjang yang berbeda."
}
```

> ⚠️ **Anti-Conflict:** Sistem akan otomatis memeriksa apakah RFID sedang aktif digunakan oleh order lain. Nama pelanggan pemilik keranjang akan ditampilkan agar Admin tahu **ke mana RFID tersebut menempel** sebelum memaksanya dipakai ulang.

---

## 4. Assign RFID ke User/Operator (Attach to User)

Menghubungkan kartu RFID tipe `operator` ke akun pegawai agar bisa digunakan untuk fitur **Login RFID**.

**Endpoint:** `POST /api/rfid/attach/user`  
**Auth:** Bearer Token (Admin / Owner)  
**Payload:**

```json
{
  "user_id": 10,
  "rfid_code": "E5F6G7H8"
}
```

**Respons Sukses (200 OK):**

```json
{
  "status": "ok",
  "message": "RFID berhasil dihubungkan ke user"
}
```

> **Efek Samping:** Status RFID otomatis berubah menjadi `ASSIGNED` dan `type` diubah menjadi `operator`. Field `UserID` pada tabel `rfids` akan terisi.

---

## 5. Lepas RFID dari Pesanan (Detach from Order)

Melepas/menonaktifkan kaitan antara RFID dan sebuah pesanan. Baris di tabel `order_rfids` akan di-set `detached_at = NOW()`. Status RFID kembali menjadi `AVAILABLE`.

**Endpoint:** `POST /api/rfid/detach`  
**Auth:** Bearer Token  
**Payload:**

```json
{
  "order_id": 101,
  "rfid_code": "A1B2C3D4"
}
```

**Respons Sukses (200 OK):**

```json
{
  "status": "ok"
}
```

---

## 6. Monitoring Pesanan & Pelacakan RFID

### A. Daftar Semua Pesanan + Status Keterikatan RFID

Mengambil daftar **pesanan aktif** (status bukan `diambil`, `batal`, atau `selesai`) beserta informasi RFID yang terikat. Berguna untuk memantau keranjang mana yang sudah di-assign dan mana yang belum.

**Endpoint:** `GET /api/rfid/orders`  
**Auth:** Bearer Token

**Contoh Respons (200 OK):**

```json
{
  "data": [
    {
      "order_id": 101,
      "order_code": "ORD-20260304-001",
      "order_date": "2026-03-04T10:00:00Z",
      "order_note": "Jangan dicampur pemutih",
      "customer_id": 5,
      "customer_name": "Siska",
      "customer_phone": "0812345678",
      "rfid_id": 50,
      "rfid_code": "A1B2C3D4",
      "rfid_attached_at": "2026-03-04T10:05:00Z"
    },
    {
      "order_id": 102,
      "order_code": "ORD-20260304-002",
      "order_date": "2026-03-04T11:00:00Z",
      "order_note": null,
      "customer_id": 6,
      "customer_name": "Budi",
      "customer_phone": "0898765432",
      "rfid_id": null,
      "rfid_code": null,
      "rfid_attached_at": null
    }
  ]
}
```

> **Cara baca:** Jika `rfid_code` bernilai `null`, berarti pesanan tersebut **belum punya keranjang yang terikat**. Jika ada nilai, berarti sudah ter-assign. Jika satu pesanan punya **multiple basket**, pesanan tersebut akan muncul lebih dari satu baris.

---

### B. Daftar Pesanan yang Punya RFID Aktif (Linked Orders)

Mengambil hanya pesanan yang **sudah terikat** dengan RFID (tidak ada `NULL`). Berguna untuk melacak keranjang yang sedang "terpakai".

**Endpoint:** `GET /api/rfid/orders/linked`  
**Auth:** Bearer Token

**Contoh Respons (200 OK):**

```json
{
  "data": [
    {
      "order_id": 101,
      "order_code": "ORD-20260304-001",
      "order_date": "2026-03-04T10:00:00Z",
      "customer_id": 5,
      "customer_name": "Siska",
      "customer_phone": "0812345678",
      "rfid_id": 50,
      "rfid_code": "A1B2C3D4",
      "rfid_attached_at": "2026-03-04T10:05:00Z"
    }
  ]
}
```

---

### C. Detail Pesanan via Scan RFID

Mengambil detail lengkap pesanan hanya dengan men-scan **salah satu** tag keranjangnya. Menampilkan juga seluruh daftar keranjang yang terikat pada pesanan yang sama — berguna untuk **melacak RFID yang nyangkut / tidak terdetach**.

**Endpoint:** `GET /api/rfid/order/detail/:rfid_code`  
**Auth:** Bearer Token

**Contoh Request:**

```http
GET /api/rfid/order/detail/A1B2C3D4
```

**Contoh Respons (200 OK):**

```json
{
  "data": {
    "order": {
      "id": 101,
      "kode_pesan": "ORD-20260304-001",
      "status": "cuci",
      "tanggal_pesan": "2026-03-04T10:00:00Z"
    },
    "customer": {
      "id": 5,
      "nama": "Siska",
      "telpon": "0812345678"
    },
    "detail_pesanans": [{ "id": 201, "nama_pakaian": "Kaos", "jumlah": 5 }],
    "scanned_rfid_code": "A1B2C3D4",
    "baskets": [
      {
        "rfid_id": 50,
        "rfid_code": "A1B2C3D4",
        "attached_at": "2026-03-04T10:05:00Z"
      },
      {
        "rfid_id": 51,
        "rfid_code": "E5F6G7H8",
        "attached_at": "2026-03-04T10:06:00Z"
      }
    ]
  }
}
```

> **Tips Debugging RFID Nyangkut:** Jika sebuah keranjang tidak bisa di-assign ke pesanan baru dan sistem melaporkan _"RFID sudah dipakai"_, gunakan endpoint ini untuk langsung tahu **pesanan mana yang masih "memegang" keranjang tersebut**. Setelah diketahui, Admin bisa trigger `POST /api/rfid/detach` secara manual.

---

## 7. Sinkronisasi Offline (Bulk Sync dari Kasir)

Digunakan oleh **aplikasi kasir offline** untuk mensinkronkan aksi attach/detach yang terjadi saat tidak ada koneksi internet.

**Endpoint:** `POST /api/rfid/sync`  
**Auth:** Bearer Token  
**Payload (array):**

```json
[
  {
    "kode_pesan": "ORD-20260301-001",
    "rfid_code": "A1B2C3D4",
    "action": "attach"
  },
  {
    "kode_pesan": "ORD-20260301-002",
    "rfid_code": "E5F6G7H8",
    "action": "detach"
  }
]
```

**Respons Sukses (200 OK):**

```json
{
  "status": 200,
  "message": "RFID offline sync selesai"
}
```

> **Catatan:** Jika satu `kode_pesan` tidak ditemukan (karena pesanannya belum tersinkron ke server), RFID action tersebut akan **di-skip** tanpa menggagalkan keseluruhan batch.

---

## 8. Ringkasan Semua Endpoint RFID

| No  | Fitur                         | Method | Endpoint                            | Auth          |
| :-- | :---------------------------- | :----- | :---------------------------------- | :------------ |
| 1   | Daftar semua RFID             | `GET`  | `/api/rfids`                        | ✅ User/Admin |
| 2   | Daftarkan RFID baru           | `POST` | `/api/rfids`                        | ✅ User/Admin |
| 3   | Attach ke pesanan             | `POST` | `/api/rfid/attach`                  | ✅ User/Admin |
| 4   | Attach ke user/operator       | `POST` | `/api/rfid/attach/user`             | ✅ Admin      |
| 5   | Detach dari pesanan           | `POST` | `/api/rfid/detach`                  | ✅ User/Admin |
| 6   | Semua pesanan + status RFID   | `GET`  | `/api/rfid/orders`                  | ✅ User/Admin |
| 7   | Pesanan yang punya RFID aktif | `GET`  | `/api/rfid/orders/linked`           | ✅ User/Admin |
| 8   | Detail pesanan via scan RFID  | `GET`  | `/api/rfid/order/detail/:rfid_code` | ✅ User/Admin |
| 9   | Sinkronisasi offline (bulk)   | `POST` | `/api/rfid/sync`                    | ✅ User/Admin |

---

## 9. Tabel & Struktur Data di Database

### Tabel `rfids` (Master Kartu)

| Kolom        | Tipe                                  | Keterangan                                      |
| :----------- | :------------------------------------ | :---------------------------------------------- |
| `id`         | `BIGINT UNSIGNED`                     | Primary Key                                     |
| `user_id`    | `BIGINT UNSIGNED NULL`                | FK ke `users.id` — diisi jika tipe `operator`   |
| `rfid_code`  | `VARCHAR(100)`                        | Kode unik kartu fisik                           |
| `type`       | `ENUM('basket','machine','operator')` | Tipe kartu                                      |
| `status`     | `VARCHAR`                             | `AVAILABLE`, `ASSIGNED`, atau `DISABLED`        |
| `created_at` | `DATETIME`                            | Waktu pertama kali terdaftar                    |
| `updated_at` | `DATETIME`                            | Waktu terakhir diupdate (dipakai untuk sorting) |

### Tabel `order_rfids` (Riwayat Penempelan Keranjang)

| Kolom         | Tipe              | Keterangan                              |
| :------------ | :---------------- | :-------------------------------------- |
| `id`          | `BIGINT UNSIGNED` | Primary Key                             |
| `order_id`    | `BIGINT UNSIGNED` | FK ke `pesanans.id`                     |
| `rfid_id`     | `BIGINT UNSIGNED` | FK ke `rfids.id`                        |
| `attached_at` | `DATETIME`        | Waktu di-attach                         |
| `detached_at` | `DATETIME NULL`   | Waktu dilepas. `NULL` = **masih aktif** |

> **Cara cek RFID nyangkut via SQL:**
>
> ```sql
> SELECT orf.*, rf.rfid_code, p.kode_pesan, c.nama
> FROM order_rfids orf
> JOIN rfids rf ON rf.id = orf.rfid_id
> JOIN pesanans p ON p.id = orf.order_id
> JOIN customers c ON c.id = p.id_pelanggan
> WHERE orf.detached_at IS NULL
> ORDER BY orf.attached_at DESC;
> ```
>
> Baris yang muncul di sana adalah RFID yang **masih terikat** ke suatu pesanan. Jika keranjang fisiknya sudah tidak ada tapi baris ini masih ada — itulah "RFID yang nyangkut".

---

## 10. Alur Kerja (Workflow) yang Disarankan untuk Admin

### Mendaftarkan Kartu Baru

1. Admin mendapatkan tumpukan kartu fisik baru.
2. Admin masuk ke halaman **Manajemen RFID** di Dashboard.
3. Admin men-tap kartu baru ke _RFID Reader_ di mejanya.
4. UI Dashboard otomatis menangkap input dari Reader dan menembak `POST /api/rfids` untuk meregistrasi kartu sebagai `basket` (atau tipe lain).
5. Kartu kini terdaftar dan muncul di tabel `GET /api/rfids`.
6. Jika itu kartu untuk pegawai, pilih kartu di tabel, klik "Assign to User" → `POST /api/rfid/attach/user`.

### Melacak & Membebaskan RFID yang Nyangkut

1. Tau ada RFID yang "nyangkut" (tidak bisa di-assign ke pesanan baru).
2. Buka **`GET /api/rfid/orders/linked`** untuk melihat daftar semua RFID yang masih aktif dan pesanan mana yang "memegang" mereka.
3. Atau scan langsung kode RFID-nya ke **`GET /api/rfid/order/detail/:rfid_code`** untuk langsung tahu `order_id` dan nama pelanggan pemiliknya.
4. Setelah diketahui, Admin trigger **`POST /api/rfid/detach`** dengan `order_id` dan `rfid_code` yang bersangkutan.
5. Status RFID kembali `AVAILABLE` dan bisa dipakai untuk pesanan baru.
