# Alur Integrasi Frontend: Modul Purchases (Migrasi dari Belanja Kebutuhan)

Dokumen ini menjelaskan alur (flow) yang harus diimplementasikan pada sisi frontend (React Native / Expo) untuk menggunakan API `Purchases` baru, yang terintegrasi dengan otomatisasi Accounting (Jurnal) dan Inventory.

---

## 1. Pembaruan Types & Store (Zustand)

Karena skema data berubah dari `belanja_kebutuhans` menjadi `purchases`, Anda perlu memperbarui _TypeScript interfaces_ dan _Zustand store_.

### 1.1. TypeScript Interfaces Baru

Buat/update interface untuk form dan response:

```typescript
// types/purchase.ts
export type PurchaseType =
  | "Operasional"
  | "Investasi"
  | "Persediaan"
  | "Lainnya";

export interface Purchase {
  id: string;
  id_supplier: string;
  supplier_name?: string;
  id_transaction: string;
  purchase_date: string; // YYYY-MM-DD
  item_name: string;
  quantity: number;
  id_unit: string;
  unit_name?: string;
  total_amount: number;
  type: PurchaseType;
  description?: string;
  id_account_expense?: string;
  id_account_cash?: string;
}

export interface CreatePurchasePayload {
  id_supplier: string;
  purchase_date: string;
  item_name: string;
  quantity: number;
  id_unit: string;
  total_amount: number;
  type: PurchaseType;
  id_account_expense: string;
  id_account_cash: string;
  description?: string;
  proof_document?: string;
  inventory_id?: string; // Pilih inventory existing jika tipe = "Persediaan"
}
```

### 1.2. Kebutuhan Data Referensi (Dropdown)

Store Anda juga perlu mengambil data dari endpoint referensi baru untuk mengisi _Dropdown/Select_ di form:

- **Suppliers:** `GET /api/v2/suppliers`
- **Units/Satuans:** `GET /api/v2/satuans`
- **Account Kas (Assets):** `GET /api/v2/accounts?type=Assets`
- **Account Beban (Expense):** `GET /api/v2/accounts?type=Expense`
- **Inventory Items:** `GET /api/v2/inventory` (Digunakan jika tipe = "Persediaan")

---

## 2. Alur Halaman (Screens Flow)

### A. Halaman Daftar Pembelian (Purchase List Screen)

_File: `app/expense/index.tsx` (atau serupa)_

1.  **Inisialisasi & Fetching:**
    Panggil endpoint `GET /api/v2/purchases?page=1&limit=10` pada saat _component mount_.
2.  **Filter & Search:**
    Tambahkan UI filter tipe belanja (`?type=Persediaan`, dll) dan search bar (`?search=nama_barang`).
3.  **Card List:**
    Tampilkan `item_name`, `purchase_date`, `type`, dan format `total_amount` menjadi Rupiah.
4.  **Action:**
    Sediakan tombol/FAB "Tambah Pembelian" yang mengarah ke Halaman Form Tambah. Sediakan juga mekanisme geser (swipe) atau menu untuk "Hapus".

### B. Halaman Form Tambah (Create Purchase Screen)

_File: `app/expense/create.tsx` (atau serupa)_

Halaman ini membutuhkan dropdown dinamis. Saat loading awal halaman, pastikan store melakukan fetch data _Suppliers_, _Satuans_, dan _Accounts_.

**Struktur Form:**

1.  **Pilih Supplier:** Dropdown dari list `/api/v2/suppliers`.
2.  **Tanggal Pembelian:** DatePicker komponen (format menjadi `YYYY-MM-DD`).
3.  **Nama Barang:** Text Input standar.
4.  **Qty (Jumlah):** Number Input.
5.  **Satuan/Unit:** Dropdown dari list `/api/v2/satuans`.
6.  **Total Harga:** Nominal input (Currency format). (Perkiraan `cost_per_unit = total / qty` di backend).
7.  **Tipe Pembelian:** Dropdown statis (`Operasional`, `Investasi`, `Persediaan`, `Lainnya`).
    > 💡 **Penting:** Jika user memilih `"Persediaan"`, sistem backend akan otomatis menambahkan data ke Gudang (Inventory). Berikan UI helper text seperti: _"Item ini akan ditambahkan ke Stok Inventory otomatis."_
8.  **Link ke Inventory (Khusus Tipe "Persediaan"):**
    - Jika user memilih tipe **"Persediaan"**, tampilkan opsi pencarian/dropdown dari list `GET /api/v2/inventory`.
    - **User dapat memilih item lama:** Masukkan `uuid` inventory tersebut ke field `inventory_id`. Ini akan memperbarui stok yang sudah ada.
    - **User dapat menambahkan item baru:** Biarkan `inventory_id` kosong. Backend akan membuat data inventory baru secara otomatis.
    - _💡 Tips UI:_ Gunakan Searchable Dropdown. Jika item tidak ditemukan, izinkan user mengetik nama baru secara manual.
9.  **Akun Kas/Bank (Kredit):** Dropdown sumber dana keluar (Kas/Bank) dari `/api/v2/accounts?type=Assets`.
10. **Akun Beban/Persediaan (Debit):** Dropdown jenis pengeluaran dari `/api/v2/accounts?type=Expense`.
11. **Catatan (Opsional):** Text Area.

**Aksi Submit:**

- Validasi data kosong (semua wajib kecuali catatan/dokumen).
- Kirim POST request ke `/api/v2/purchases` dengan format JSON `CreatePurchasePayload`.
- Tampilkan indikator _Loading_, dan navigasi kembali ke List (+ refresh state) saat sukses. Tampilkan Global Alert sukses.

### C. Hapus Pembelian (Delete Action)

- Dapat diakses dari menu di list atau halaman detail.
- Tampilkan Confirmation Dialog Alert: _"Yakin ingin menghapus rekaman pembelian ini? Jurnal akuntansi dan penyesuaian inventory yang terikat akan otomatis di-revert."_
- Panggil `DELETE /api/v2/purchases/:id`.
- Refresh list pada state Zustand jika berhasil.

---

## 3. Catatan Integrasi Lanjutan & UX Alerts

- **State Management:** Karena struktur app Anda menggunakan `Zustand`, pindahkan pemanggilan axios ke dalam _actions_ di store `usePurchaseStore` (atau ekuivalen struktur `expense` sebelumnya).
- **Error Handling:** Jangan lupa tangkap `error.response?.data?.error` dari backend dan munculkan `Alert` menggunakan implementasi Global Alert yang Anda selesaikan beberapa hari lalu (`useAlertStore`).
- Panggilan backend `/api/v2/belanja-kebutuhan` yang lama harus **sepenuhnya diganti** dengan `/api/v2/purchases` karena backend route lama telah diamputasi.
