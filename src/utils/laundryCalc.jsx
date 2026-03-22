/**
 * Formats and rounds laundry prices according to specific business rules.
 * 
 * Rules:
 * 1. For units: per_kilo, meter, kilo_meter, kg -> (price * qty) / 1000
 * 2. Rounding (Currency):
 *    - Hundreds < 300: Round down to nearest 1000
 *    - Hundreds 300 - 700: Round to 500
 *    - Hundreds > 700: Round up to nearest 1000
 */

const WEIGHT_UNITS = [
    'per_kilo', 'meter', 'kilo_meter', 'kg', 'kilogram', 
    'gr', 'gram', 'grams', 'm', 'km', 'gram/gram', 'kiloan'
];

export const findItemSatuan = (id, categories) => {
    if (!categories || !id) return '';
    const targetId = String(id);
    for (const cat of categories) {
        if (cat.jenis_cucis) {
            const paket = cat.jenis_cucis.find(p => String(p.id) === targetId || String(p.id_jenis_cuci) === targetId);
            if (paket) return paket.satuan || '';
        }
    }
    return '';
};

export const calculateLaundryItemSubtotal = (item, categories = null) => {
    if (!item) return 0;
    const p = Number(item.price || 0);
    const q = Number(item.qty || 0);
    const apiSubTotal = Number(item.sub_total || 0);
    
    // If backend already provides sub_total, use it directly (Priority: API)
    if (apiSubTotal > 0) return apiSubTotal;
    let unit = item.satuan || item.jenis_cuci?.satuan || item.paket?.satuan || '';
    if (!unit && categories && item.id_jenis_cuci) {
        unit = findItemSatuan(item.id_jenis_cuci, categories);
    }
    const u = unit.toString().toLowerCase();

    // 2. Identify if weight/meter-based
    let isWeight = WEIGHT_UNITS.some(wu => u.includes(wu));
    
    // 3. Hybrid Heuristic: If backend sub_total is around 1000x smaller than p*q
    if (!isWeight && apiSubTotal > 0 && q > 0 && p > 0) {
        const expectedFull = p * q;
        const ratio = expectedFull / apiSubTotal;
        if (ratio > 500 && ratio < 1500) {
            isWeight = true;
        }
    }
    
    // 4. Perform calculation
    let rawTotal;
    if (isWeight) {
        rawTotal = (q / 1000) * p;
    } else {
        rawTotal = q * p;
    }

    // 5. Business Rounding Rules
    const base = Math.round(rawTotal); 
    const thousands = Math.floor(base / 1000) * 1000;
    const hundreds = base % 1000;

    if (hundreds < 300) {
        return thousands;
    } else if (hundreds <= 700) {
        return thousands + 500;
    } else {
        return thousands + 1000;
    }
};

export const calculateGrandTotal = (cartItems, categories = null) => {
    if (!cartItems) return 0;
    
    return Object.values(cartItems).reduce((total, itemBatch) => {
        const item = Array.isArray(itemBatch) ? itemBatch[0] : itemBatch;
        if (!item) return total;
        return total + calculateLaundryItemSubtotal(item, categories);
    }, 0);
};
