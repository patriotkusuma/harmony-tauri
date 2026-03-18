# Alur Integrasi Frontend Mobile: Modul Inventory

Dokumen ini menjelaskan alur yang harus diimplementasikan pada sisi frontend (React Native / Expo) untuk fitur manajemen stok inventory.

> **Catatan:** Data inventory dibuat **otomatis** oleh backend saat purchase bertipe `Persediaan` dibuat. Frontend hanya perlu menampilkan dan mengelola stok yang sudah ada.

---

## 1. Types & Store (Zustand)

### 1.1. TypeScript Interfaces

```typescript
// types/inventory.ts

export type MovementType = "in" | "out" | "adjustment";

export interface InventoryItem {
  id: number;
  uuid: string;
  id_purchase?: string;
  id_unit: string;
  nama: string;
  qty: number;
  initial_stock: number;
  current_stock: number; // ← stok yang terupdate setiap movement
  cost_per_unit: number;
  purcashe_date: string; // YYYY-MM-DD
  expiry_date?: string;
  last_used_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryMovement {
  id: string;
  id_inventory: string;
  movement_date: string; // YYYY-MM-DD
  movement_type: MovementType;
  quantity: number;
  reference_type: string;
  description: string;
  created_at?: string;
}

export interface AdjustStockPayload {
  movement_type: MovementType;
  quantity: number;
  movement_date: string; // YYYY-MM-DD
  reference_type: string;
  description: string;
}
```

### 1.2. Zustand Store

```typescript
// store/useInventoryStore.ts
import { create } from "zustand";

interface InventoryStore {
  items: InventoryItem[];
  total: number;
  page: number;
  isLoading: boolean;
  error: string | null;

  fetchInventory: (page?: number, search?: string) => Promise<void>;
  fetchMovements: (uuid: string) => Promise<InventoryMovement[]>;
  adjustStock: (uuid: string, payload: AdjustStockPayload) => Promise<void>;
}
```

---

## 2. Alur Halaman (Screens Flow)

```
[Tab: Inventory]
      │
      ▼
┌─────────────────────────┐
│  Inventory List Screen  │  GET /api/v2/inventory
│  Daftar stok barang     │
└─────────┬───────────────┘
          │ tap item
          ▼
┌─────────────────────────┐
│  Inventory Detail Screen│  GET /api/v2/inventory/:uuid
│  Info + stok saat ini   │
└──────┬──────────────────┘
       │                  │
   [Sesuaikan]      [Riwayat]
       │                  │
       ▼                  ▼
┌────────────┐   ┌───────────────────┐
│ Adjust     │   │ Movement History  │
│ Stock Modal│   │ Screen            │
│ (bottom    │   │ GET .../movements │
│  sheet)    │   └───────────────────┘
└─────┬──────┘
      │ submit
      ▼
   POST .../adjust
```

---

## 3. Detail Implementasi Tiap Screen

### A. Inventory List Screen

**File:** `app/inventory/index.tsx`

1. **Fetch saat mount:** `GET /api/v2/inventory?page=1&limit=20`
2. **Search bar:** debounce input → tambah `?search=namaBarang`
3. **Card per item:** tampilkan `nama`, `current_stock`, dan badge status stok:
   - 🟢 **Aman** jika `current_stock >= initial_stock * 0.3`
   - 🟡 **Menipis** jika `current_stock > 0 && < 30%`
   - 🔴 **Habis** jika `current_stock <= 0`
4. **Action Button (FAB):** Tambahkan tombol floating "+" untuk "Tambah Barang Baru" yang mengarah ke form pendaftaran barang baru secara manual.
5. **Lazy load / infinite scroll:** load page berikutnya saat scroll ke bawah
6. **Tap card:** navigate ke Inventory Detail Screen

### B. Inventory Detail Screen

**File:** `app/inventory/[uuid].tsx`

1. **Fetch:** `GET /api/v2/inventory/:uuid`
2. **Tampilkan:**

   | Field           | Label                                          |
   | --------------- | ---------------------------------------------- |
   | `nama`          | Nama Barang                                    |
   | `current_stock` | Stok Sekarang (besar, warna berdasarkan level) |
   | `initial_stock` | Stok Awal                                      |
   | `cost_per_unit` | Harga per Unit                                 |
   | `purcashe_date` | Tanggal Beli                                   |
   | `expiry_date`   | Kadaluarsa (jika ada)                          |

3. **Tombol CTA:**
   - 🔵 **"Sesuaikan Stok"** → buka Adjust Stock Bottom Sheet
   - 📋 **"Lihat Riwayat"** → navigate ke Movement History

### C. Adjust Stock Bottom Sheet / Modal

**Trigger:** dari tombol "Sesuaikan Stok" di Detail Screen

**Form:**

```
┌──────────────────────────────────┐
│ Jenis Pergerakan (required)      │
│ ○ Masuk (in)                     │
│ ○ Keluar (out)                   │
│ ○ Koreksi/Opname (adjustment)    │
│                                  │
│ Jumlah (required, min 0.01)      │
│ [___________]                    │
│                                  │
│ Tanggal (required)               │
│ [DatePicker]                     │
│                                  │
│ Sumber (required)                │
│ [manual | penggunaan | opname]   │
│                                  │
│ Keterangan (required)            │
│ [___________________________]    │
│                                  │
│  [Batalkan]   [Simpan Perubahan] │
└──────────────────────────────────┘
```

**Helper text berdasarkan movement_type:**

- `in` → _"Stok akan BERTAMBAH sebesar jumlah yang diinput"_
- `out` → _"Stok akan BERKURANG. Gagal jika stok tidak cukup."_
- `adjustment` → _"Stok akan DISET ke nilai yang diinput (untuk koreksi opname fisik)"_

**Submit:** `POST /api/v2/inventory/:uuid/adjust`

**Error handling response:**

```typescript
try {
  await adjustStock(uuid, payload);
  showAlert("success", "Stok berhasil disesuaikan");
  router.back();
} catch (err) {
  const status = err.response?.status;
  const msg = err.response?.data?.error;

  if (status === 422) {
    // stok tidak cukup atau format invalid
    showAlert("error", msg ?? "Stok tidak cukup");
  } else if (status === 404) {
    showAlert("error", "Item inventory tidak ditemukan");
  } else {
    showAlert("error", msg ?? "Terjadi kesalahan server");
  }
}
```

### D. Form Tambah Barang Baru (Create)

**Trigger:** dari tombol FAB "+" di List Screen. Digunakan untuk stok awal atau barang yang tidak melalui alur pembelian (purchase).

**Endpoint:** `POST /api/v2/inventory`

**Request Body:**

```json
{
  "nama": "Nama Barang Baru",
  "id_unit": "uuid-satuan",
  "qty": 10.5,
  "cost_per_unit": 5000,
  "purchase_date": "2024-03-16",
  "description": "Stok awal saldo"
}
```

**E. Movement History Screen**

**File:** `app/inventory/[uuid]/movements.tsx`

1. **Fetch:** `GET /api/v2/inventory/:uuid/movements?page=1&limit=20`
2. **Timeline list:** tampilkan riwayat dari terbaru
3. **Badge per movement_type:**
   - `in` → 🟢 **Masuk**
   - `out` → 🔴 **Keluar**
   - `adjustment` → 🔵 **Koreksi**
4. **Per baris:** tampilkan `movement_date`, `quantity`, `description`, `reference_type`

---

## 4. Navigasi (Expo Router)

```
app/
├── inventory/
│   ├── index.tsx          ← Inventory List (+ FAB Tambah)
│   ├── create.tsx         ← Form Tambah Barang Baru
│   └── [uuid]/
│       ├── index.tsx      ← Detail + trigger adjust modal
│       └── movements.tsx  ← Movement History
```

---

## 5. UX & Error Handling

- **Global Alert:** gunakan `useAlertStore` (sama seperti modul Purchase) untuk menampilkan feedback sukses/gagal
- **Loading state:** tampilkan skeleton saat fetch data awal
- **Pull to refresh:** pada Inventory List untuk refresh data terbaru
- **Confirm dialog:** tidak diperlukan untuk adjust stok (langsung submit)
- **Empty state:** untuk list inventory yang kosong, tampilkan info bahwa stok akan muncul otomatis setelah pembelian bertipe `Persediaan` dibuat
