# Dokumentasi Device Management & IoT

Dokumen ini menjelaskan pengelolaan perangkat fisik (IoT Devices) yang digunakan dalam ekosistem Harmony Laundry, termasuk pendaftaran perangkat sentral dan integrasinya dengan mesin laundry serta kartu RFID.

---

## 1. Arsitektur Perangkat

Sistem Harmony Laundry mendukung dua jenis perangkat IoT:
1.  **Central IoT Station**: Perangkat pembaca RFID yang memantau beberapa mesin sekaligus atau berfungsi sebagai gerbang (gateway) data.
2.  **Embedded Machine IoT**: Perangkat yang terpasang langsung pada mesin tertentu untuk mencatat aktivitas penggunaan.

Setiap perangkat harus didaftarkan di sistem agar dapat melakukan request ke endpoint `/api/order/start` dan `/api/order/finish`.

---

## 2. Pengelolaan IoT Device (Admin API)

Admin dapat mengelola daftar perangkat melalui endpoint berikut. Data ini digunakan untuk otentikasi perangkat dan mapping lokasi (outlet).

### A. Daftar Perangkat
Mengambil semua perangkat IoT yang terdaftar.

**Endpoint:** `GET /api/v2/iot-device`  
**Query Params:**
- `outlet_id` (optional): Filter berdasarkan ID outlet.

**Contoh Respons:**
```json
{
  "data": [
    {
      "id": 1,
      "outlet_id": "a4af2976-2f44-4099-84a3-636ee763e3ce",
      "device_code": "IOT-MAIN-001",
      "name": "Station Sentral Lantai 1",
      "is_active": true,
      "created_at": "2026-03-30T20:00:00Z"
    }
  ]
}
```

### B. Registrasi Perangkat Baru
Mendaftarkan kode unik perangkat (mac address atau serial) ke dalam sistem.

**Endpoint:** `POST /api/v2/iot-device`  
**Payload:**
```json
{
  "outlet_id": "a4af2976-2f44-4099-84a3-636ee763e3ce",
  "device_code": "IOT-MAIN-002",
  "name": "Station Cuci Basah",
  "is_active": true
}
```

---

## 3. Integrasi Mesin & RFID

Agar IoT Device dapat bekerja, mesin fisik harus dipetakan ke dalam sistem dan (opsional) ditempeli RFID Machine Tag untuk mempermudah identifikasi oleh operator.

### A. Mapping Mesin ke RFID
Setiap mesin memiliki ID unik. Untuk mesin yang tidak memiliki keypad, operator menempelkan kartu mesin (`type: machine`) ke IoT device terlebih dahulu, baru kemudian menempelkan kartu keranjang (`type: basket`).

**Endpoint:** `POST /api/mesin/:id/rfid`  
**Payload:**
```json
{
  "rfid_code": "M-123456"
}
```

---

## 4. Alur Kerja Operasional IoT

### Skenario: Memulai Cuci (Order Start)
1.  Operator menempelkan kartu **Pegawai** (Login).
2.  Operator menempelkan kartu **Mesin** (Identifikasi Mesin).
3.  Operator menempelkan kartu **Keranjang** (Identifikasi Order).
4.  IoT mengirim request ke backend.

**Request ke Backend:**
```http
POST /api/order/start
Authorization: Bearer <token_operator>
Content-Type: application/json

{
  "machine_id": 15,
  "rfid_code": "B-998877"
}
```

---

## 5. Ringkasan Endpoint Iot Management

| Method | Endpoint | Deskripsi | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v2/iot-device` | List semua perangkat IoT | Tersedia |
| `POST` | `/api/v2/iot-device` | Registrasi perangkat baru | Tersedia |
| `PUT` | `/api/v2/iot-device/:id` | Update data perangkat | Tersedia |
| `DELETE` | `/api/v2/iot-device/:id` | Hapus perangkat | Tersedia |
| `POST` | `/api/mesin/:id/rfid` | Link kartu RFID ke mesin | Tersedia |
| `GET` | `/api/mesin/rfid/:rfid_code` | Cari data mesin via RFID | Tersedia |

---

## 6. Keamanan Perangkat
1.  **API Key / JWT**: Perangkat harus melakukan login menggunakan RFID Operator untuk mendapatkan JWT atau menggunakan static API Key (jika dikonfigurasi).
2.  **Validation**: Backend memvalidasi apakah `device_code` aktif (is_active: true) sebelum memproses log pengerjaan order.
