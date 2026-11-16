/**
 * Perhitungan struk/nota Harmony Laundry.
 *
 * PENTING: modul ini adalah satu-satunya sumber kebenaran untuk Sub Total,
 * Pembulatan, dan Total. Dipakai oleh preview nota (OrderInvoicePreviewModal)
 * DAN oleh data yang dikirim ke printer, supaya angka di layar tidak pernah
 * berbeda dengan angka yang tercetak.
 *
 * Aturan (sama dengan src-tauri/src/printer.rs):
 *   subTotal   = jumlah total_harga seluruh detail_pesanans
 *   pembulatan = total_harga - Math.round(subTotal)
 *
 * `total_harga` dari server sudah merupakan harga final yang dibulatkan,
 * sehingga pembulatan dihitung sebagai selisih — bukan dihitung ulang.
 */

/** Jumlahkan total seluruh item pesanan. */
export const hitungSubTotal = (order) => {
  const items = Array.isArray(order?.detail_pesanans) ? order.detail_pesanans : [];
  return items.reduce((acc, item) => acc + Number(item?.total_harga || 0), 0);
};

/**
 * Ringkasan angka struk: subTotal, pembulatan, dan total final.
 * Semua nilai dibulatkan ke rupiah penuh agar tidak ada pecahan desimal.
 */
export const ringkasanStruk = (order) => {
  const subTotal = hitungSubTotal(order);
  const total = Number(order?.total_harga || 0);
  const pembulatan = total - Math.round(subTotal);

  return {
    subTotal: Math.round(subTotal),
    pembulatan: Math.round(pembulatan),
    total: Math.round(total),
  };
};

/** QR struk berisi kode pesanan (bukan URL). */
export const qrValueStruk = (order) => String(order?.kode_pesan || "");

export default { hitungSubTotal, ringkasanStruk, qrValueStruk };
