# Webhook Logging System (Clean Architecture)

Dokumen ini merinci arsitektur dan struktur database untuk fitur pencatatan log webhook yang masuk ke dalam sistem Harmony Laundry. Seluruh *incoming request* dari Whatsapp webhook (atau third-party lainnya di masa depan) akan ditampung di sisi backend dan dieksekusi secara *background process*, kemudian hasilnya dicatat dalam tabel `webhook_logs`.

## 1. Arsitektur Sistem

Sistem ini telah menerapkan **Clean Architecture** yang terbagi dalam layer:

1. **Domain (`internal/domains/webhook`)**:
   - `entity.go`: Representasi objek data `WebhookLog`.
   - `repository.go`: Definisi *interface* untuk operasi database.

2. **UseCase (`internal/usecase/webhook`)**:
   - `interface.go`: Kontrak _business logic_.
   - `handle.go`: Mengurus alur logika utama seperti `LogIncoming` (mencatat log awal berstatus `processing`) dan `UpdateLogStatus` (memperbarui keberhasilan/kegagalan eksekusi log).

3. **Infrastructure (`internal/infrastructure/persistance/gorm`)**:
   - `models/webhook_log.go`: Struktur struct untuk migrasi tabel database GORM.
   - `webhook_repository.go`: Implementasi aktual GORM untuk antarmuka *repository*.

4. **Delivery (`internal/delivery/http/webhook/handler.go`)**:
   - Menerima payload HTTP secara asinkron.
   - Memanggil `UseCase.LogIncoming()` sebelum memproses WA event.
   - Menjalankan `goroutine` (background job) untuk proses *event Whatsapp*.
   - Jika berhasil atau gagal, memanggil `UseCase.UpdateLogStatus()`.

## 2. Struktur Tabel Database (`webhook_logs`)

Tabel `webhook_logs` di-*generate* secara otomatis melalui *Auto Migration* GORM saat *startup*.

| Nama Kolom | Tipe Data | Keterangan / Fungsi |
| :--- | :--- | :--- |
| `id` | `BIGINT` (Auto Increment) | Primary key log |
| `event` | `VARCHAR(100)` | Tipe event dari webhook yang diterima (misal: `message.ack`, dll). Berindeks. |
| `device_id` | `VARCHAR(100)` | ID dari Device (Whatsapp) yang menerima log. Berindeks. |
| `payload` | `TEXT` | Struktur lengkap payload JSON yang dikirim sistem sumber. |
| `error_message`| `TEXT` | Akan terisi bila proses *background* WhatsappUseCase gagal dijalankan, berguna untuk *debugging*. |
| `status` | `VARCHAR(20)`| Indikator eksekusi: `processing`, `success`, `failed`. Berindeks untuk memudahkan filtering UI. |
| `created_at` | `DATETIME` | Waktu log masuk ke backend kita. |

## 3. Alur Kerja (Work Flow)

1. **HTTP POST** masuk ke router dengan payload JSON event whatsapp.
2. `HandlerWebhook` memanggil `WebhookUc.LogIncoming()` menyisipkan rekaman ke tabel `webhook_logs` dengan status `processing`.
3. Handler langsung membalas `HTTP 200 OK` ke provider Webhook (*non-blocking* UX).
4. `WhatsappUc.Execute()` dijalankan di dalam **goroutine**.
5. Jika `Execute` gagal (mengembalikan error), `UpdateLogStatus` dipanggil mengubah record menjadi status `failed` dan mengisi kolom `error_message`.
6. Jika `Execute` sukses tanpa error, status berubah menjadi `success`.

## 4. Persiapan Modul Frontend (UI)

Tabel dan arsitektur data di atas telah selesai dan dapat dimanfaatkan untuk mendesain halaman **Webhook UI Logs** pada Frontend dengan acuan *wireframe* sebagai berikut:

- **Filter/Sort Options**: Bisa mem-filter berdasarkan kolom `status`, `event`, maupun `device_id`.
- **List/Grid**: Menampilkan tanggal masuk (`created_at`), `event` name, `status` *badge* (Green=Success, Red=Failed, Yellow=Processing), serta *action buttons* "View".
- **Detail Modal**: Menampilkan `payload` mentah (dalam bentuk JSON formatter block) beserta riwayat `error_message` apabila status gagal.
