# 🤖 AI Conversational Dashboard API (V2)

Dokumentasi ini menjelaskan cara kerja sistem **Conversational AI** yang didukung oleh Gemini 2.0 Flash untuk Harmony Laundry. Sistem ini memungkinkan pengguna untuk melakukan percakapan interaktif, mendapatkan laporan, hingga melakukan investigasi data operasional (seperti RFID) melalui chat.

---

## 📡 Base Endpoint
`POST /api/v2/chat`

Semua request memerlukan Header **Authorization** (JWT Token) karena data yang diakses bersifat sensitif terhadap outlet.

---

## 💬 1. Mengirim Pesan (Send Message)
Endpoint ini digunakan untuk mengirim pesan baru atau melanjutkan percakapan yang sudah ada.

*   **URL:** `/api/v2/chat/send`
*   **Method:** `POST`
*   **Auth Required:** Yes

### Request Payload
```json
{
  "session_id": "optional-uuid-here",
  "content": "Cek omset hari ini dong?"
}
```
> [!NOTE]
> Jika `session_id` kosong, sistem akan otomatis membuatkan UUID sesi baru.

### Response Sukses (200 OK)
```json
{
  "success": true,
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "messages": [
    {
      "id": 123,
      "session_id": "...",
      "role": "user",
      "content": "Cek omset hari ini dong?",
      "created_at": "2026-03-26T21:05:00Z"
    },
    {
      "id": 124,
      "session_id": "...",
      "role": "assistant",
      "content": "Berdasarkan data omset hari ini tanggal 2026-03-26, total pendapatan adalah Rp 1.500.000 dari 45 pesanan.",
      "created_at": "2026-03-26T21:05:05Z"
    }
  ]
}
```

---

## 📜 2. Daftar Sesi Chat (List Sessions)
Mendapatkan riwayat percakapan pengguna saat ini (Berdasarkan User ID dalam Token).

*   **URL:** `/api/v2/chat/sessions`
*   **Method:** `GET`
*   **Auth Required:** Yes

### Response Sukses (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-...",
      "user_id": 1,
      "title": "Analisa Omset Hari Ini",
      "updated_at": "2026-03-26T21:00:00Z"
    }
  ]
}
```

---

## 🕵️‍♂️ Alat Investigasi (AI Tools / Function Calling)
Gemini memiliki kemampuan untuk memanggil "Tools" di Backend secara otomatis jika pertanyaan pengguna relevan.

| Tool Name | Kegunaan | Contoh Pertanyaan |
| :--- | :--- | :--- |
| `check_rfid_status` | Mencari data pendaftaran RFID & pesanan aktif | *"Kenapa rfid f55dc440 tidak bisa dipakai?"* |
| `get_daily_sales_summary` | Mengambil omset & jumlah order harian | *"Berapa omset hari ini?"* |
| `get_financial_summary` | Statistik Omset, COGS, dan Profit | *"Bantu analisa strategi profit laundry saya"* |
| `get_material_trends` | Mendeteksi kenaikan harga bahan baku | *"Bahan baku apa saja yang harganya naik?"* |

---

## 🛡️ Error Handling
Sistem ini dilengkapi dengan pengaman jika Database mati di lingkungan lokal:
*   Jika DB tidak terhubung, AI akan tetap merespon namun menyatakan bahwa *"Data operasional saat ini tidak dapat diakses"*.

---

## 🚀 Panduan Integrasi Frontend
1.  Frontend harus menyimpan `session_id` agar User bisa melanjutkan obrolan.
2.  Gunakan `Zustand` atau State Manager lainnya untuk menyimpan riwayat `messages` yang dikembalikan oleh API.
3.  Implementasikan UI Chat (Bubble User/Assistant) untuk pengalaman pengguna yang maksimal.
