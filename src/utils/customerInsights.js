/* ================================================================
   Customer Insights — presentational helpers + contoh data
   ----------------------------------------------------------------
   Sumber utama insight sekarang adalah backend:
   - GET /api/v2/customer/insights?ids=...  (hasil pencarian)
   - GET /api/v2/customer/:id/insights      (pelanggan terpilih)
   Data contoh di file ini hanya cadangan saat CUSTOMER_INSIGHTS_DUMMY
   dinyalakan lagi untuk pengembangan UI tanpa backend.
   ================================================================ */
import dayjs from 'dayjs';

/* ── Metadata preferensi layanan ─────────────────────────────── */
export const PREFERENCE_META = {
  REGULER: {
    label: 'Reguler',
    icon: 'fas fa-tshirt',
    color: '#5e72e4',
    bg: 'rgba(94,114,228,0.10)',
  },
  EXPRESS: {
    label: 'Express',
    icon: 'fas fa-bolt',
    color: '#fb6340',
    bg: 'rgba(251,99,64,0.10)',
  },
  KILAT: {
    label: 'Kilat',
    icon: 'fas fa-stopwatch',
    color: '#8965e0',
    bg: 'rgba(137,101,224,0.10)',
  },
  CAMPURAN: {
    label: 'Campuran',
    icon: 'fas fa-layer-group',
    color: '#f5a623',
    bg: 'rgba(245,166,35,0.12)',
  },
  SAMPEL_KECIL: {
    label: 'Data sedikit',
    icon: 'fas fa-seedling',
    color: '#8898aa',
    bg: 'rgba(136,152,170,0.12)',
  },
  LAINNYA: {
    label: 'Lainnya',
    icon: 'fas fa-ellipsis-h',
    color: '#8898aa',
    bg: 'rgba(136,152,170,0.12)',
  },
};

export const CONFIDENCE_META = {
  tinggi: { label: 'Pola jelas', color: '#2dce89', level: 3 },
  sedang: { label: 'Pola cukup jelas', color: '#f5a623', level: 2 },
  rendah: { label: 'Data masih sedikit', color: '#fb6340', level: 1 },
};

/* Data contoh hanya dipakai saat backend insight tidak tersedia. */
export const CUSTOMER_INSIGHTS_DUMMY = false;

const EMPTY_INSIGHT = {
  orders_total: 0,
  orders_30d: 0,
  orders_90d: 0,
  avg_order_value: 0,
  last_order_at: null,
  days_since_last_order: null,
  preferred_class: 'SAMPEL_KECIL',
  preferred_confidence: 0,
  preferred_sample_size: 0,
  confidence_label: 'rendah',
  outstanding_amount: 0,
  unpaid_orders: 0,
  oldest_unpaid_days: 0,
  behavior_note: '',
  is_dummy: true,
};

/* ── Format angka ────────────────────────────────────────────── */
export const formatRupiah = (value) => {
  const n = Number(value) || 0;
  return `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(n))}`;
};

export const formatCompactRupiah = (value) => {
  const n = Number(value) || 0;
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',').replace(',0', '')} jt`;
  if (n >= 1_000) return `Rp ${Math.round(n / 1_000)} rb`;
  return `Rp ${n}`;
};

export const formatDaysAgo = (days) => {
  if (days === null || days === undefined) return 'belum pernah';
  if (days <= 0) return 'hari ini';
  if (days === 1) return 'kemarin';
  if (days < 30) return `${days} hari lalu`;
  if (days < 60) return 'sekitar 1 bulan lalu';
  return `${Math.round(days / 30)} bulan lalu`;
};

/* Satu kalimat manusiawi untuk bar pelanggan & hasil pencarian. */
export const describeCustomerInsights = (insights) => {
  if (!insights) return '';

  const orders = insights.orders_total || 0;
  if (!orders) return 'Pelanggan baru · belum ada riwayat cuci';

  const pref = PREFERENCE_META[insights.preferred_class];
  const hasClearPreference =
    pref &&
    ['REGULER', 'EXPRESS', 'KILAT'].includes(insights.preferred_class) &&
    (insights.preferred_sample_size || 0) >= 3;

  const parts = [];

  if (hasClearPreference) {
    parts.push(`Biasanya ${pref.label}`);
  } else if (insights.preferred_class === 'CAMPURAN') {
    parts.push('Layanan campur');
  } else if (orders < 3) {
    parts.push(`Baru ${orders}x cuci`);
  } else {
    parts.push(`Sudah ${orders}x cuci`);
  }

  if (hasClearPreference || insights.preferred_class === 'CAMPURAN') {
    parts.push(`${orders}x cuci`);
  }

  if (insights.days_since_last_order !== null && insights.days_since_last_order !== undefined) {
    parts.push(`terakhir ${formatDaysAgo(insights.days_since_last_order)}`);
  }

  return parts.join(' · ');
};

/* Warna status untuk garis kiri kartu pelanggan. */
export const getCustomerStatusColor = (insights) => {
  if (!insights || !insights.orders_total) return '#8898aa';
  if ((insights.outstanding_amount || 0) > 0) return '#f5365c';
  if ((insights.orders_30d || 0) > 0) return '#2dce89';
  return '#5e72e4';
};

export const getConfidenceMeta = (insights) =>
  CONFIDENCE_META[insights?.confidence_label] || CONFIDENCE_META.rendah;

/* ── Badge ringkas untuk daftar customer ─────────────────────── */
export const buildInsightBadges = (insights) => {
  if (!insights) return [];

  const badges = [];

  if (!insights.orders_total) {
    return [{
      key: 'baru',
      label: 'Pelanggan baru',
      icon: 'fas fa-user-plus',
      color: '#8898aa',
      bg: 'rgba(136,152,170,0.12)',
      title: 'Belum ada riwayat cuci di outlet ini',
    }];
  }

  // Prioritas kasir: tagihan yang belum dibayar selalu paling terlihat.
  if ((insights.outstanding_amount || 0) > 0) {
    badges.push({
      key: 'tunggakan',
      label: `Belum lunas ${formatCompactRupiah(insights.outstanding_amount)}`,
      icon: 'fas fa-exclamation-triangle',
      color: '#f5365c',
      bg: 'rgba(245,54,92,0.10)',
      title: `${insights.unpaid_orders || 0} tagihan belum dibayar`,
    });
  }

  const pref = PREFERENCE_META[insights.preferred_class];
  const hasClearPreference =
    pref &&
    ['REGULER', 'EXPRESS', 'KILAT'].includes(insights.preferred_class) &&
    (insights.preferred_sample_size || 0) >= 3;

  if (hasClearPreference) {
    badges.push({
      key: 'preferensi',
      label: `Sering ${pref.label}`,
      icon: pref.icon,
      color: pref.color,
      bg: pref.bg,
      title: `${insights.preferred_sample_size} dari 10 cucian terakhir`,
    });
  } else if (insights.preferred_class === 'CAMPURAN') {
    badges.push({
      key: 'campuran',
      label: 'Layanan campur',
      icon: PREFERENCE_META.CAMPURAN.icon,
      color: PREFERENCE_META.CAMPURAN.color,
      bg: PREFERENCE_META.CAMPURAN.bg,
      title: 'Tidak ada layanan yang benar-benar dominan',
    });
  }

  if ((insights.orders_total || 0) >= 10) {
    badges.push({
      key: 'setia',
      label: `${insights.orders_total}x cuci`,
      icon: 'fas fa-award',
      color: '#5e72e4',
      bg: 'rgba(94,114,228,0.10)',
      title: 'Pelanggan setia',
    });
  }

  if ((insights.orders_30d || 0) > 0) {
    badges.push({
      key: 'aktif',
      label: `${insights.orders_30d}x bulan ini`,
      icon: 'fas fa-bolt',
      color: '#2dce89',
      bg: 'rgba(45,206,137,0.10)',
      title: 'Ada cucian dalam 30 hari terakhir',
    });
  }

  return badges;
};

/* ── Profil contoh (mengikuti data dump nyata) ───────────────── */
const DEMO_PROFILES = {
  edo: {
    orders_total: 89,
    orders_30d: 3,
    orders_90d: 12,
    avg_order_value: 45000,
    last_order_days_ago: 8,
    preferred_class: 'EXPRESS',
    preferred_confidence: 0.9,
    preferred_sample_size: 10,
    confidence_label: 'tinggi',
    outstanding_amount: 144000,
    unpaid_orders: 3,
    oldest_unpaid_days: 45,
    behavior_note: 'Biasanya Express, 9 dari 10 order terakhir. Ada tunggakan Rp144.000.',
  },
  bruno: {
    orders_total: 196,
    orders_30d: 8,
    orders_90d: 34,
    avg_order_value: 38000,
    last_order_days_ago: 2,
    preferred_class: 'REGULER',
    preferred_confidence: 0.95,
    preferred_sample_size: 10,
    confidence_label: 'tinggi',
    outstanding_amount: 0,
    unpaid_orders: 0,
    oldest_unpaid_days: 0,
    behavior_note: 'Langganan Reguler, hampir tiap minggu. Tidak ada tunggakan.',
  },
  sumiyati: {
    orders_total: 28,
    orders_30d: 1,
    orders_90d: 5,
    avg_order_value: 52000,
    last_order_days_ago: 21,
    preferred_class: 'REGULER',
    preferred_confidence: 0.7,
    preferred_sample_size: 7,
    confidence_label: 'sedang',
    outstanding_amount: 22325500,
    unpaid_orders: 4,
    oldest_unpaid_days: 180,
    behavior_note: 'Sering Reguler dengan tunggakan besar yang perlu ditagih.',
  },
  isti: {
    orders_total: 45,
    orders_30d: 5,
    orders_90d: 18,
    avg_order_value: 41000,
    last_order_days_ago: 4,
    preferred_class: 'EXPRESS',
    preferred_confidence: 0.95,
    preferred_sample_size: 10,
    confidence_label: 'tinggi',
    outstanding_amount: 69500,
    unpaid_orders: 2,
    oldest_unpaid_days: 30,
    behavior_note: 'Selalu Express, 10 dari 10 order terakhir.',
  },
  pinkan: {
    orders_total: 21,
    orders_30d: 2,
    orders_90d: 8,
    avg_order_value: 36000,
    last_order_days_ago: 12,
    preferred_class: 'EXPRESS',
    preferred_confidence: 0.8,
    preferred_sample_size: 8,
    confidence_label: 'sedang',
    outstanding_amount: 86000,
    unpaid_orders: 2,
    oldest_unpaid_days: 33,
    behavior_note: 'Sering Express (8 dari 10 order), ada tunggakan Rp86.000.',
  },
  diana: {
    orders_total: 19,
    orders_30d: 2,
    orders_90d: 7,
    avg_order_value: 39000,
    last_order_days_ago: 15,
    preferred_class: 'EXPRESS',
    preferred_confidence: 1,
    preferred_sample_size: 10,
    confidence_label: 'tinggi',
    outstanding_amount: 72500,
    unpaid_orders: 2,
    oldest_unpaid_days: 25,
    behavior_note: 'Selalu Express, 10 dari 10 order terakhir.',
  },
  lala: {
    orders_total: 29,
    orders_30d: 2,
    orders_90d: 9,
    avg_order_value: 44000,
    last_order_days_ago: 9,
    preferred_class: 'KILAT',
    preferred_confidence: 0.6,
    preferred_sample_size: 6,
    confidence_label: 'sedang',
    outstanding_amount: 33500,
    unpaid_orders: 1,
    oldest_unpaid_days: 12,
    behavior_note: 'Cukup sering Kilat (6 dari 10 order), ada tunggakan kecil.',
  },
  campur: {
    orders_total: 34,
    orders_30d: 3,
    orders_90d: 11,
    avg_order_value: 48000,
    last_order_days_ago: 6,
    preferred_class: 'CAMPURAN',
    preferred_confidence: 0.45,
    preferred_sample_size: 5,
    confidence_label: 'rendah',
    outstanding_amount: 0,
    unpaid_orders: 0,
    oldest_unpaid_days: 0,
    behavior_note: 'Pilihan layanan berganti-ganti, belum ada pola yang kuat.',
  },
  'pelanggan baru': {
    ...EMPTY_INSIGHT,
    behavior_note: 'Belum ada histori order di outlet ini.',
  },
};

/* ── Hash deterministik supaya data dummy stabil per customer ── */
const hashString = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
};

const normalizeName = (name = '') => name.trim().toLowerCase();

const hydrateProfile = (profile) => {
  const lastDays = profile.last_order_days_ago;
  const hasOrder = (profile.orders_total || 0) > 0;
  return {
    ...EMPTY_INSIGHT,
    ...profile,
    last_order_at:
      hasOrder && lastDays !== undefined
        ? dayjs().subtract(lastDays, 'days').toISOString()
        : null,
    days_since_last_order: hasOrder ? (lastDays ?? null) : null,
    is_dummy: true,
  };
};

const buildGeneratedInsight = (customer) => {
  const seed = `${customer?.id ?? ''}|${customer?.nama ?? ''}|${customer?.telpon ?? ''}`;
  const h = hashString(seed);

  const bucket = h % 100;
  let ordersTotal = 0;

  if (bucket < 18) ordersTotal = 0;
  else if (bucket < 40) ordersTotal = 1 + (h % 2);
  else if (bucket < 65) ordersTotal = 3 + (h % 7);
  else if (bucket < 86) ordersTotal = 10 + (h % 50);
  else ordersTotal = 60 + (h % 140);

  if (ordersTotal === 0) {
    return hydrateProfile({
      ...EMPTY_INSIGHT,
      behavior_note: 'Belum ada histori order di outlet ini.',
    });
  }

  const prefPool = ['REGULER', 'REGULER', 'REGULER', 'EXPRESS', 'EXPRESS', 'KILAT', 'CAMPURAN'];
  let preferredClass = 'SAMPEL_KECIL';
  let confidenceLabel = 'rendah';
  let preferredConfidence = 0;

  if (ordersTotal >= 3) {
    preferredClass = prefPool[h % prefPool.length];
    if (preferredClass === 'CAMPURAN') {
      confidenceLabel = 'rendah';
      preferredConfidence = 0.45;
    } else {
      const score = 60 + (h % 35); // 60–94
      confidenceLabel = score >= 80 ? 'tinggi' : 'sedang';
      preferredConfidence = score / 100;
    }
  }

  const hasDebt = h % 9 === 0;
  const orders30 = Math.min(ordersTotal, h % 9);
  const orders90 = Math.min(ordersTotal, orders30 + (h % 12));

  return hydrateProfile({
    orders_total: ordersTotal,
    orders_30d: orders30,
    orders_90d: orders90,
    avg_order_value: 25000 + (h % 30) * 2500,
    last_order_days_ago: 1 + (h % 90),
    preferred_class: preferredClass,
    preferred_confidence: preferredConfidence,
    preferred_sample_size: Math.min(10, ordersTotal),
    confidence_label: confidenceLabel,
    outstanding_amount: hasDebt ? 25000 + (h % 40) * 12500 : 0,
    unpaid_orders: hasDebt ? 1 + (h % 3) : 0,
    oldest_unpaid_days: hasDebt ? 15 + (h % 150) : 0,
    behavior_note: '',
  });
};

/* Resolver tunggal — nanti ganti isi fungsi ini dengan data API. */
export const resolveCustomerInsights = (customer) => {
  if (!customer) return null;

  // Kalau backend sudah mengirim insights, pakai itu.
  if (customer.insights) return customer.insights;

  // Saklar untuk mematikan data contoh saat backend asli sudah siap.
  if (!CUSTOMER_INSIGHTS_DUMMY) return null;

  const profile = DEMO_PROFILES[normalizeName(customer.nama)];
  if (profile) return hydrateProfile(profile);

  return buildGeneratedInsight(customer);
};

export const attachDummyInsights = (customer) => {
  if (!customer || customer.insights) return customer;
  const insights = resolveCustomerInsights(customer);
  return insights ? { ...customer, insights } : customer;
};
