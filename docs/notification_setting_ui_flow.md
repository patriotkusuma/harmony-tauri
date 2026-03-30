# Flow UI & Integrasi API: Pengaturan Notifikasi Outlet (Notification Settings)

Dokumen ini memandu perancangan User Interface (UI) untuk fitur **Pengaturan Notifikasi (Notification Settings)** pada master Outlet dan bagaimana frontend berinteraksi dengan API backend.

---

## 1. Konsep Dasar

- Pengaturan notifikasi (seperti dikirim/tidaknya struk, notifikasi lunas, setingan quiet hours, template pesan, dsb) kini dibuat spesifik per-**Outlet**.
- Terdapat fungsi sakelar (toggle ON/OFF) global dan juga per-jenis layanan: **Antar Jemput** & **Ambil Di Toko**.
- Secara backend, tabel `outlet_notification_settings` akan _auto-create_ (insert baris default) pertama kali pengaturan outlet tersebut diakses bila belum ada di database.

---

## 2. Alur UI (User Flow)

### Halaman Pengaturan Outlet (Tab Notifikasi)

**Akses:** `Menu Sidebar -> Master Data -> Outlet -> Pilih sebuah Outlet -> Tab "Notifikasi"`

**Isi Halaman/Tab:**
Ketika komponen _Tab Notifikasi_ dimuat, **Frontend harus memanggil API GET Settings** by `outletId`.

Pada UI, tampilkan kelompo-kelompok sakelar dan inputan berikut:

1. **Global Switch:**
   - `[Toggle]` Aktifkan Sistem Notifikasi Keseluruhan (`enabled`)

2. **Kondisi Layanan (Filter Notif):**
   - `[Toggle]` Kirim Notif untuk Pesanan **Antar Jemput** (`enabled_antar_jemput`)
   - `[Toggle]` Kirim Notif untuk Pesanan **Ambil Di Toko** (`enabled_ambil_di_toko`)

3. **Status Transaksi:**
   - `[Toggle]` Kirim Invoice (Struk Pembayaran) (`send_invoice_enabled`)
   - `[Toggle]` Kirim Bukti jika Lunas (`send_invoice_on_paid`)

4. **Kanal Pengiriman:**
   - `[Toggle]` Kirim melalui WhatsApp (`whatsapp_enabled`)

5. **Pengaturan Tagihan Belum Dibayar (Unpaid Reminder):**
   - `[Toggle]` Aktifkan Pengingat Tagihan (`unpaid_reminder_enabled`)
   - `[Number Input]` Waktu mulai ingatkan (Menit) setelah nota terbit (`unpaid_reminder_start_after_minutes`)
   - `[Number Input]` Jarak/Interval antar pengingat (Menit) (`unpaid_reminder_interval_minutes`)
   - `[Number Input]` Maksimal percobaan ingatkan (Kali) (`unpaid_reminder_max_times`)

6. **Jam Tenang (Quiet Hours):**
   _(Fitur agar pesanan lewat jam malam yang otomatis baru akan dikirim pagi harinya)_
   - `[Toggle]` Aktifkan Jam Tenang (`quiet_hours_enabled`)
   - `[Time Picker]` Mulai Jam (`quiet_start`) format: `HH:MM:SS`
   - `[Time Picker]` Akhir Jam (`quiet_end`) format: `HH:MM:SS`

7. **Template Pesan Teks (Textarea):**
   - `[Textarea]` Template Pesanan Masuk / Dibuat (`template_order_created`)
   - `[Textarea]` Template Pesanan Selesai (`template_order_done`)
   - `[Textarea]` Template Invoice Lunas (`template_invoice`)
   - `[Textarea]` Template Tagihan Belum Dibayar (`template_unpaid_reminder`)

> _Setiap kali State Form berubah (user nge-klik toggle atau Save form), kumpulkan State ke dalam Object dan Panggil `PUT Update Setting`._

---

## 3. Dokumentasi API (Request & Response)

### A. Mengambil Setting (GET)

Endpoint ini digunakan saat komponen dimuat pertama kali. **Jika setting kosong di DB, sistem Backend otomatis akan men-defaultkan nilai-nilai tersebut dengan status True**.

**Endpoint:** `GET /api/v1/notification-settings/:outletId`  
**Auth:** Bearer Token

**Contoh Response Sukses (200 OK):**

```json
{
  "enabled": true,
  "enabled_antar_jemput": true,
  "enabled_ambil_di_toko": true,
  "whatsapp_enabled": true,
  "send_invoice_enabled": true,
  "send_invoice_on_paid": true,
  "unpaid_reminder_enabled": true,
  "unpaid_reminder_start_after_minutes": 1440,
  "unpaid_reminder_interval_minutes": 1440,
  "unpaid_reminder_max_times": 3,
  "quiet_hours_enabled": true,
  "quiet_start": "21:00:00",
  "quiet_end": "07:00:00"
}
```

### B. Mengubah / Menyimpan Setting (PUT)

Gunakan ini untuk menyimpan preferensi. Karena sifatnya parsial (`PATCH-like`), value apa saja di-_pass_ via body JSON **akan menimpa data aslinya (Nilai yg tidak dikirim di body, takkan berubah)**.

**Endpoint:** `PUT /api/v1/notification-settings/:outletId`  
**Auth:** Bearer Token

**Contoh Payload Request:**

```json
{
  "enabled": true,
  "enabled_antar_jemput": true,
  "enabled_ambil_di_toko": false,
  "quiet_hours_enabled": true,
  "quiet_start": "22:00:00",
  "template_order_done": "Halo Kak, laundry atas nama {{nama}} sudah semerbak melati! 🙏 Silahkan diambil di cabang kami."
}
```

_(Ingat, setiap value harus sama tipe datanya. Toggle=Boolean, Angka=Integer, Template/Jam=String)_

**Contoh Response Sukses (200 OK):**

```json
{
  "message": "success update notification setting"
}
```

---

## 4. Model State Frontend (Zustand/Types)

Contoh interface dari Payload Request ini agar mudah dikirimkan:

```typescript
export interface NotificationSetting {
  enabled?: boolean;

  enabled_antar_jemput?: boolean;
  enabled_ambil_di_toko?: boolean;

  whatsapp_enabled?: boolean;
  send_invoice_enabled?: boolean;
  send_invoice_on_paid?: boolean;

  unpaid_reminder_enabled?: boolean;
  unpaid_reminder_start_after_minutes?: number; // Menit
  unpaid_reminder_interval_minutes?: number; // Menit
  unpaid_reminder_max_times?: number;

  quiet_hours_enabled?: boolean;
  quiet_start?: string; // "21:00:00"
  quiet_end?: string; // "07:00:00"

  template_order_created?: string;
  template_order_done?: string;
  template_invoice?: string;
  template_unpaid_reminder?: string;
}
```

_(Pro tips: di Frontend `PUT` request gunakan function Debounce atau Save Buton untuk menghindari spam update ke backend saat user sekedar merubah TimePicker)._
