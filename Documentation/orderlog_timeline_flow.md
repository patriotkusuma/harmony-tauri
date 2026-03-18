# Order Log Timeline Flow

Dokumentasi ini menjelaskan alur kerja (_flow_) untuk fitur **Order Log Timeline** yang menampilkan riwayat proses pesanan mesin (cuci, setrika, pengeringan, dsb) secara timeline per hari.

## 1. Request Endpoint

**Endpoint:** `GET /api/order/timeline`

**Query Parameters (Opsional):**

- `date` (format: `YYYY-MM-DD`): Untuk menampilkan data pada tanggal spesifik. Jika kosong, sistem akan menggunakan tanggal hari ini (waktu _current server_).

**Contoh: **

- _Request hari ini:_ `GET /api/order/timeline`
- _Request tanggal spesifik:_ `GET /api/order/timeline?date=2026-03-01`

---

## 2. Handler Layer (Controller)

_File: `internal/interface/http/handler/order_log_handler.go`_

1. Klien memanggil endpoint via Frontend.
2. `OrderlogHandler.GetTimeline` menerima sebuah request `GET`.
3. Handler membaca parameter `date` dari URL query (`c.Query("date")`).
4. Handler langsung meneruskan pemanggilan metode `GetTimelineUC.Execute(date)` ke _Use Case_.
5. Apabila ada error dari Use Case, response `500 Internal Server Error` dikirim. Jika berhasil, sistem mengirimkan data log pesanan dalam format JSON.

---

## 3. Use Case Layer (Business Logic)

_File: `internal/usecase/orderlog/get_timeline.go`_

Di Layer Use Case, aplikasi menjalankan validasi parameter dan normalisasi waktu.

1. **Memproses Parameter `date`:**
   - **Jika `date` diberikan:** Use Case mencoba _parsing_ ke format `YYYY-MM-DD`.
     - _Valid:_ Menyusun _Start Date_ pada jam `00:00:00` dan _End Date_ pada `23:59:59` dari tanggal input.
     - _Tidak valid (error parsing):_ Secara otomatis fallback ke **hari ini** (`time.Now()`).
   - **Jika `date` kosong:** Secara proaktif menentukan rentang waktu berdasarkan tanggal hari ini (`00:00:00` sampai `23:59:59`).
2. Setelah rentang (range) waktu _start_ dan _end_ hari direkatkan, Use Case memanggil **Repository Layer**, yaitu `OrderLogRepo.FindTimelineByDateRange(startOfDay, endOfDay)`.
3. Setelah menerima data berupa _Entity Array_ dari Repository, Use Case melakukan perhutungan/ mapping ulang (Data Transfer Object / DTO). Ini bertujuan membatasi data spesifik yang hanya diperlukan oleh UI dengan format struct `OrderLogTimelineDTO`.
4. Mengembalikan DTO _timeline list_ ke Handler.

---

## 4. Repository Layer (Database Access)

_File: `internal/infrastructure/persistance/gorm/order_log_repository.go`_

Ini adalah layer di mana pemanggilan database SQL dilakukan menggunakan objek GORM.

1. `FindTimelineByDateRange(startDate, endDate)` mengeksekusi _raw query builder_ yang melibatkan penggabungan relasi (JOIN).
   - `FROM order_logs`
   - `JOIN pesanans ON pesanans.id = order_logs.order_id` (untuk mendapatkan id pesanan, kode pesan, dan status pesan)
   - `JOIN customers ON customers.id = pesanans.id_pelanggan` (untuk seketika mendapatkan nama pelanggan)
2. Dilakukan _Filtering_ rentang waktu:
   - `WHERE order_logs.started_at BETWEEN ? AND ?` dengan nilai parameter `startDate` awal hari dan `endDate` batas hari (23:59).
3. Hasil diurutkan secara **Descending** atau menurun: `ORDER BY order_logs.started_at DESC`, untuk memastikan urutan UI secara timeline vertikal yang benar.
4. Hasil query di petakan ke dalam Custom Struct `domainLog.OrderLogTimeline` (Entity).
5. Data dikembalikan ke Use Case Layer.

---

## 5. Struktur Data Response Timeline (DTO JSON)

_File: `internal/usecase/orderlog/dto.go`_

Berikut ini adalah format struktur JSON balikan `/api/order/timeline`, yang bisa dipetakan langsung pada Frontend:

```json
{
    "data": [
        {
            "id": 105,
            "order_id": 412,
            "kode_pesan": "ORD-260301-001",
            "status": "cuci",
            "customer_name": "Budi Santoso",
            "proses": "cuci",
            "machine_id": 3,
            "operator_id": 1,
            "keterangan": "pesanan dengan kode pesan ORD-260301-001 sedang dalam proses cuci ",
            "started_at": "2026-03-01T10:15:30Z",
            "finished_at": "2026-03-01T11:45:00Z"
        },
        ...
    ]
}
```

### Keterangan Data:

- `kode_pesan`, `order_id`: Identifikasi pesanan
- `customer_name`: Nama Pelanggan _real-time_
- `status`: Status pada tiket/nota utama (contoh: _cuci, setrika, selesai_)
- `proses`: Task order di mesin pada log ini (berbentuk string tipe _cuci, drying, setrika, selesai_).
- `machine_id`: Mesin yang mengeksekusi proses.
- `started_at` & `finished_at`: Tanggal/jam timestamp proses dikerjakan oleh mesin log tersebut.
