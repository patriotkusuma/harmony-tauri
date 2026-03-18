# Alur Implementasi Notifikasi Custom & Global (Harmony Go)

Dokumen ini menjelaskan bagaimana Frontend (FE) dapat berinteraksi dengan fitur pesan custom per-outlet dan pengumuman global yang akan disisipkan ke dalam notifikasi WhatsApp "Selesai".

---

## 1. Struktur Database & Model

### A. Pesan Custom Per-Outlet
Fitur ini digunakan untuk informasi spesifik cabang (misal: "Titik jemput di depan lobi").
- **Tabel**: `outlets`
- **Kolom Baru**: `custom_notif_selesai` (Type: `TEXT`, Nullable)

### B. Pengumuman Global
Fitur ini digunakan untuk informasi yang berlaku di seluruh cabang (misal: "Libur Nasional" atau "Maintenance Sistem").
- **Tabel**: `system_settings`
- **Key**: `GLOBAL_FINISH_ANNOUNCEMENT`
- **Value**: Isi pengumuman (Type: `TEXT`)

---

## 2. Integrasi Frontend (FE)

### A. Mengelola Pesan Per-Outlet
FE perlu menyediakan kolom input pada halaman **Pengaturan Outlet** atau **Profil Outlet**.

- **Endpoint (Update)**: `PUT /api/v1/outlets/:id` (atau endpoint outlet yang sudah ada)
- **Field yang dikirim**:
  ```json
  {
    "id": "uuid-outlet",
    "nama": "Harmony Gebang",
    "custom_notif_selesai": "Jangan lupa ambil struk fisik saat pengambilan!"
  }
  ```

### B. Mengelola Pengumuman Global
FE perlu menyediakan input di halaman **Admin/System Setting** (Hanya untuk Role Owner/Admin).

- **Endpoint**: FE bisa membuat handler baru atau menggunakan endpoint setting yang ada.
- **Payload**:
  ```json
  {
    "setting_key": "GLOBAL_FINISH_ANNOUNCEMENT",
    "setting_value": "Kami akan libur pada tanggal 17 Agustus."
  }
  ```

---

## 3. Logika Flow Backend (WhatsApp)

Ketika sistem memicu notifikasi selesai (baik via manual klik atau IoT/RFID), flow yang berjalan adalah:

1.  **Trigger**: Endpoint `/api/notification/send-notif` dipanggil.
2.  **Fetch Data**:
    - Backend mengambil data [Pesanan](file:///home/harmony/Documents/harmony-go/models/pesanan_model.go#7-38).
    - Backend melakukan *Preload* ke tabel [Outlet](file:///home/harmony/Documents/harmony-go/internal/infrastructure/persistance/gorm/models/outlet.go#8-27) untuk mengambil `custom_notif_selesai`.
    - Backend mencari ke tabel `system_settings` untuk key `GLOBAL_FINISH_ANNOUNCEMENT`.
3.  **Template Building**:
    - Backend menyusun pesan utama (Kode Pesanan, Status Selesai).
    - **IF** `outlet.custom_notif_selesai` ada -> Sisipkan teks tersebut.
    - **IF** `global_announcement` ada -> Tambahkan section `*Informasi Penting:*` di bagian bawah.
4.  **Send**: Pesan dikirim melalui WhatsApp API.

---

## 4. Contoh Format Pesan Hasil Akhir

```text
Halo Kak [Nama Pelanggan] 😊

Laundry dengan kode pesanan *HMY-12345* sudah *selesai dikerjakan* dan sudah dapat diambil.

[PESAN CUSTOM OUTLET ANDA AKAN MUNCUL DISINI]

*Informasi Penting:* 
[PENGUMUMAN GLOBAL/INFO LIBUR AKAN MUNCUL DISINI]

Terima kasih sudah mempercayakan cucian kepada kami. Kami selalu berusaha memberikan layanan terbaik! 🙏

*Harmony Laundry*
```

---

## 5. Tips untuk Frontend
- **Karakter**: Berikan batasan karakter (misal 500 karakter) pada input agar pesan WhatsApp tidak terlalu panjang (bisa menyebabkan spam filter).
- **Preview**: Sangat disarankan untuk membuat "Live Preview" di FE sehingga user bisa melihat bagaimana kira-kira pesan tersebut akan tampil di WhatsApp pelanggan.
- **Null Handling**: Jika FE mengirim string kosong atau `null`, sistem secara otomatis tidak akan menampilkan bagian tersebut dalam notifikasi.
