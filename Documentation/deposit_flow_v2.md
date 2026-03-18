# Panduan Fitur Deposit V2 (Harmony Laundry)

Dokumen ini menjelaskan alur fungsional dan teknis untuk fitur Deposit Pelanggan (V2), mencakup API endpoint, request/response, dan urutan pengerjaan bagi Frontend (FE).

---

## 1. Alur Fungsional

1.  **Halaman Utama Deposit**: Menampilkan daftar pelanggan beserta saldo terakhir mereka. Terdapat fitur pencarian berdasarkan nama atau nomor telepon.
2.  **Detail & Riwayat**: Ketika pelanggan diklik, FE menampilkan riwayat transaksi deposit (debit/kredit) beserta keterangan dan tanggalnya.
3.  **Top-up Saldo**: Admin/Kasir dapat menambah saldo pelanggan dengan memasukkan nominal dan keterangan tambahan.

---

## 2. API Endpoints

### A. List Summary Deposit Pelanggan
Digunakan untuk menampilkan daftar saldo pelanggan di halaman utama deposit.

- **Endpoint**: `GET /api/v2/deposit`
- **Query Params**:
  - `search` (Optional): Nama atau No. Telp
  - `page` (Default: 1)
  - `limit` (Default: 10)
- **Response (200 OK)**:
  ```json
  {
    "items": [
      {
        "id_customer": 123,
        "customer_name": "Budi Santoso",
        "customer_phone": "08123456789",
        "saldo": 150000.0
      }
    ],
    "total_items": 1,
    "page": 1,
    "limit": 10
  }
  ```

### B. Detail & Riwayat Deposit Pelanggan
Digunakan untuk menampilkan kartu rincian saldo dan tabel riwayat transaksi pelanggan tertentu.

- **Endpoint**: `GET /api/v2/deposit/:id_customer`
- **Response (200 OK)**:
  ```json
  {
    "id_customer": 123,
    "customer_name": "Budi Santoso",
    "customer_phone": "08123456789",
    "saldo": 150000.0,
    "histories": [
      {
        "id": "uuid-transaction-1",
        "last_deposit_amount": 100000.0,
        "deposit_amount": 50000.0,
        "tanggal_deposit": "2024-03-16T08:00:00Z",
        "keterangan": "Top up via Kasir"
      }
    ]
  }
  ```

### C. Top-up Saldo (Tambah Deposit)
Digunakan untuk memproses penambahan saldo pelanggan.

- **Endpoint**: `POST /api/v2/deposit`
- **Request Body (JSON)**:
  ```json
  {
    "id_customer": 123,
    "amount": 50000.0,
    "keterangan": "Top up saldo bulanan"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Top up berhasil diproses"
  }
  ```

---

## 3. Catatan Penting untuk Frontend

- **Validasi Nominal**: Nominal deposit (`amount`) haruslah angka positif dan lebih besar dari 0.
- **Format Tanggal**: API mengembalikan `tanggal_deposit` dalam format ISO 8601 (`RFC3339`). FE dapat memformatnya menjadi `DD-MM-YYYY HH:mm` untuk kenyamanan user.
- **Pencarian**: Pencarian bersifat *global*, jadi FE bisa langsung memicu hit API saat user mengetik di search bar (disarankan menggunakan *debounce*).
- **Saldo**: Saldo adalah total akumulatif. Di bagian riwayat, `last_deposit_amount` menunjukkan saldo *sebelum* transaksi tersebut dilakukan.
