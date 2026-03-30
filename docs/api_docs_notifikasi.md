# Panduan API System Setting & Notifikasi (Harmony Go)

Dokumen ini berisi detail endpoint yang diperlukan oleh Frontend (FE) untuk mengelola Pengumuman Global dan Pesan Custom per-outlet.

---

## 1. Pengumuman Global (System Settings)

Pengumuman ini disimpan di tabel `system_settings` dengan key `GLOBAL_FINISH_ANNOUNCEMENT`.

### A. Update Pengumuman Global
Karena fitur ini menggunakan tabel setting yang sudah ada, FE bisa menggunakan endpoint **Toggle Auto Close Status** yang sudah tersedia di [AccountingController](file:///home/harmony/Documents/harmony-go/internal/delivery/http/v2/accounting_controller.go#10-14) sebagai referensi, namun untuk pengumuman global ini, backend menggunakan key `GLOBAL_FINISH_ANNOUNCEMENT`.

- **Endpoint**: `GET /api/v2/system-settings/GLOBAL_FINISH_ANNOUNCEMENT`
- **Request (GET)**: No body required.
- **Response (JSON)**:
  ```json
  {
    "success": true,
    "data": {
      "setting_key": "GLOBAL_FINISH_ANNOUNCEMENT",
      "setting_value": "Isi pengumuman global..."
    }
  }
  ```

### B. Update Pengumuman Global
FE dapat mengubah nilai pengumuman global menggunakan endpoint PUT.

- **Endpoint**: `PUT /api/v2/system-settings/GLOBAL_FINISH_ANNOUNCEMENT`
- **Request (PUT)**:
  ```json
  {
    "setting_value": "Kami akan libur pada tanggal 17 Agustus."
  }
  ```

---

## 2. Pesan Custom Per-Outlet (Notification Settings)

Fitur ini sudah memiliki modul khusus di backend (`internal/notification/http`).

### A. Get Setting Outlet (Termasuk Template)
Digunakan untuk mengambil data setting paket notifikasi suatu outlet.

- **Endpoint**: `GET /api/v1/notification-settings/:outletId`
- **Response (JSON)**:
  ```json
  {
    "enabled": true,
    "enabled_antar_jemput": true,
    "enabled_ambil_di_toko": true,
    "whatsapp_enabled": true,
    "send_invoice_enabled": true,
    "send_invoice_on_paid": false,
    "unpaid_reminder_enabled": true,
    "unpaid_reminder_start_after_minutes": 60,
    "unpaid_reminder_interval_minutes": 1440,
    "unpaid_reminder_max_times": 3,
    "quiet_hours_enabled": true,
    "quiet_start": "22:00:00",
    "quiet_end": "07:00:00"
  }
  ```

### B. Update Setting & Template Custom
Gunakan ini untuk mengupdate teks template atau pesan custom.

- **Endpoint**: `PUT /api/v1/notification-settings/:outletId`
- **Payload (JSON)**:
  ```json
  {
    "template_order_done": "Laundry Selesai Kak! Jangan lupa ambil ya. Ada promo khusus hari Jumat lho!",
    "enabled": true,
    "whatsapp_enabled": true
  }
  ```

---

## 3. Pesan Custom di Tabel Outlet (Modul Clean)

Selain modul asinkron di atas, tabel `outlets` utama juga memiliki kolom baru `custom_notif_selesai`.

- **Endpoint**: `PUT /api/v2/outlets/:id`
- **Payload (JSON)**:
  ```json
  {
    "custom_notif_selesai": "Info cabang Gebang: Parkir gratis untuk pelanggan laundry!"
  }
  ```

---

## 4. Prioritas Pesan (Flow Backend)

Backend akan menyusun pesan WhatsApp dengan urutan:
1.  **Template Standar** (Kode Pesanan & Status).
2.  **Pesan Outlet** (Dari kolom `custom_notif_selesai` di tabel `outlets`).
3.  **Pengumuman Global** (Dari tabel `system_settings` key `GLOBAL_FINISH_ANNOUNCEMENT`).
4.  **Footer** (Terima kasih & Nama Brand).

Jika FE mengosongkan salah satu nilainya di database, bagian tersebut otomatis diabaikan oleh Backend.

---

## 5. WhatsApp Auto-Reply (Pesan Libur/Otomatis)

Fitur ini akan mengirimkan pesan otomatis jika ada pelanggan yang mengirim pesan ke WhatsApp Webhook saat fitur diaktifkan. Pesan hanya dikirim **maksimal 1x per nomor** dalam kurun waktu 24 jam untuk menghindari spam.

-  **Switch ON/OFF**: Key `WHATSAPP_AUTOREPLY_ENABLED` (Nilai: `true` atau `false`).
-  **Jadwal Libur (Opsional)**: 
   - `HOLIDAY_START_DATE` (Format: `"YYYY-MM-DD"`)
   - `HOLIDAY_END_DATE` (Format: `"YYYY-MM-DD"`)
   - *Jika tanggal diset, auto-reply akan aktif otomatis pada rentang tersebut meski switch OFF.*
-  **Pesan Custom**: Key `WHATSAPP_AUTOREPLY_MESSAGE` (Nilai: Teks pesan).

### A. Aktifkan/Nonaktifkan Auto-Reply
- **Endpoint**: `PUT /api/v2/system-settings/WHATSAPP_AUTOREPLY_ENABLED`
- **Request**:
  ```json
  {
    "setting_value": "true"
  }
  ```

### B. Update Pesan Auto-Reply (Libur)
- **Endpoint**: `PUT /api/v2/system-settings/WHATSAPP_AUTOREPLY_MESSAGE`
- **Request**:
  ```json
  {
    "setting_value": "Halo! Harmony Laundry sedang libur lebaran. Kami buka kembali tanggal 20. Pesan Anda akan dibalas saat kami aktif kembali. 🙏"
  }
  ```

---

## 6. WhatsApp After-Hours (Otomatis Berdasarkan Jam)

Sistem akan otomatis mengirimkan pesan jika ada pelanggan yang menghubungi di luar jam operasional. Sama seperti fitur libur, pesan dikirim **maksimal 1x per nomor per 24 jam**.

### A. Pengaturan Jam Operasional & Pesan
Gunakan key berikut untuk mengatur:
- `SHOP_OPEN_TIME`: Jam buka (Contoh: `"08:00"`)
- `SHOP_CLOSE_TIME`: Jam tutup (Contoh: `"20:00"`)
- `WHATSAPP_AFTER_HOURS_MESSAGE`: Teks pesan otomatis saat tutup.

**Contoh Update Jam Tutup:**
- **Endpoint**: `PUT /api/v2/system-settings/SHOP_CLOSE_TIME`
- **Request**:
  ```json
  {
    "setting_value": "19:00"
  }
  ```

**Contoh Update Pesan Tutup:**
- **Endpoint**: `PUT /api/v2/system-settings/WHATSAPP_AFTER_HOURS_MESSAGE`
- **Request**:
  ```json
  {
    "setting_value": "Mohon maaf, store kami sudah tutup. CS kami akan membalas pesan Anda besok pagi pukul 08:00. Terima kasih!"
  }
  ```
