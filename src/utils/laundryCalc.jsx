/**
 * Perhitungan harga cucian — disamakan dengan aturan backend.
 *
 * Aturan backend (lihat laundryutil.CalculateItemSubTotal):
 * - tipe per_kilo / kilo_meter / meter : qty disimpan dalam gram,
 *   jadi subtotal = (qty / 1000) * harga
 * - tipe satuan (dan lainnya)          : subtotal = qty * harga
 *
 * Pembulatan hanya dilakukan pada total akhir, bukan per item.
 */

const WEIGHT_TIPES = ['per_kilo', 'kilo_meter', 'meter'];

const WEIGHT_UNITS = [
    'per_kilo', 'meter', 'kilo_meter', 'kg', 'kilogram',
    'gr', 'gram', 'grams', 'm', 'km', 'gram/gram', 'kiloan',
];

const findPackageInCategories = (id, categories) => {
    if (!categories || !id) return null;
    const targetId = String(id);
    for (const cat of categories) {
        if (cat.jenis_cucis) {
            const paket = cat.jenis_cucis.find(
                (p) => String(p.id) === targetId || String(p.id_jenis_cuci) === targetId
            );
            if (paket) return paket;
        }
    }
    return null;
};

// Backend cart V2 sudah mengirim `tipe` pada setiap item.
// Cache lengkap dari localStorage hanya dipakai sebagai cadangan untuk item
// lama yang belum memiliki `tipe` (misalnya cart yang dibuat sebelum update).
const getCachedCategories = () => {
    try {
        if (typeof localStorage === 'undefined') return [];
        const raw = localStorage.getItem('harmony_categories_cache');
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
};

export const isWeightTipe = (tipe) =>
    WEIGHT_TIPES.includes(String(tipe || '').toLowerCase().trim());

export const findItemTipe = (id, categories) => {
    const paket =
        findPackageInCategories(id, categories) ||
        findPackageInCategories(id, getCachedCategories());
    return paket?.tipe || '';
};

export const findItemSatuan = (id, categories) => {
    const paket =
        findPackageInCategories(id, categories) ||
        findPackageInCategories(id, getCachedCategories());
    return paket?.satuan || '';
};

export const calculateLaundryItemSubtotal = (item, categories = null) => {
    if (!item) return 0;

    const price = Number(item.price || 0);
    const qty = Number(item.qty || 0);
    const apiSubTotal = Number(item.sub_total || 0);

    // Kalau backend sudah mengirim subtotal, pakai angkanya.
    if (apiSubTotal > 0) return Math.round(apiSubTotal);

    // Tipe utama berasal langsung dari cart backend.
    // Fallback ke daftar kategori / cache hanya untuk item lama.
    let tipe = item.tipe || item.jenis_cuci?.tipe || item.paket?.tipe || '';
    if (!tipe && item.id_jenis_cuci) {
        tipe = findItemTipe(item.id_jenis_cuci, categories);
    }

    // Cadangan kalau data lama hanya punya label satuan.
    let isWeight = isWeightTipe(tipe);
    if (!tipe) {
        const unit = String(
            item.satuan || item.jenis_cuci?.satuan || item.paket?.satuan || ''
        ).toLowerCase();
        isWeight = WEIGHT_UNITS.some((weightUnit) => unit === weightUnit);
    }

    const rawTotal = isWeight ? (qty / 1000) * price : qty * price;
    return Math.round(rawTotal);
};

/** Pembulatan total, sama seperti backend. */
export const roundSubTotal = (value) => {
    const total = Math.round(Number(value) || 0);
    const thousands = Math.floor(total / 1000) * 1000;
    const hundreds = total % 1000;

    if (hundreds >= 700) return thousands + 1000;
    if (hundreds >= 300) return thousands + 500;
    return thousands;
};

export const calculateGrandTotal = (cartItems, categories = null) => {
    if (!cartItems) return 0;

    const total = Object.values(cartItems).reduce((sum, itemBatch) => {
        const item = Array.isArray(itemBatch) ? itemBatch[0] : itemBatch;
        if (!item) return sum;
        return sum + calculateLaundryItemSubtotal(item, categories);
    }, 0);

    return roundSubTotal(total);
};
