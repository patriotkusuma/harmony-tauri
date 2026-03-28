/* ================================================================
   Customer Management — Organism: CustomerDetailView
   Panel detail customer: info + active orders.
   ================================================================ */
import React, { useEffect } from 'react';
import { useCustomerStore } from 'store/customerStore';
import CustomerAvatar from 'components/atoms/customer/CustomerAvatar';
import { CustomerTypeBadge, OrderStatusBadge } from 'components/atoms/customer/StatusBadge';
import StatChip from 'components/atoms/customer/StatChip';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const customMarker = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const fmt = (val) => val != null
  ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
  : '-';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const InfoRow = ({ icon, label, value }) => (
  <div className="cust-detail-row">
    <i className={`${icon} cust-detail-row__icon`} />
    <div>
      <div className="cust-detail-row__label">{label}</div>
      <div className="cust-detail-row__value">{value ?? <span style={{ opacity: 0.4 }}>-</span>}</div>
    </div>
  </div>
);

const CustomerDetailView = () => {
  const { selected, detailLoading, detailError, fetchDetail } = useCustomerStore();

  // Re-fetch fresh detail saat modal dibuka
  useEffect(() => {
    if (selected?.id) fetchDetail(selected.id);
  }, [selected?.id]);

  if (detailLoading) return (
    <div className="cust-detail-loading">
      <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#5e72e4' }} />
      <p>Memuat detail...</p>
    </div>
  );

  if (detailError) return (
    <div className="cust-error"><i className="fas fa-exclamation-triangle" /> {detailError}</div>
  );

  if (!selected) return null;

  const activeOrders = selected.active_orders ?? [];

  return (
    <div className="cust-detail">
      {/* Header */}
      <div className="cust-detail__header">
        <CustomerAvatar customer={selected} size={56} />
        <div className="cust-detail__header-info">
          <h4 className="cust-detail__name">{selected.nama}</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <CustomerTypeBadge tipe={selected.tipe} />
            <StatChip icon="fas fa-shopping-basket" value={selected.total_order ?? 0} label="total order" color="#5e72e4" />
            {activeOrders.length > 0 && (
              <StatChip icon="fas fa-clock" value={activeOrders.length} label="aktif" color="#fb6340" />
            )}
            {selected.saldo > 0 && (
              <StatChip icon="fas fa-wallet" value={fmt(selected.saldo)} label="saldo" color="#2dce89" />
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="cust-detail__grid">
        <InfoRow icon="fas fa-phone" label="Telepon" value={selected.telpon} />
        <InfoRow icon="fas fa-map-marker-alt" label="Alamat" value={selected.alamat} />
        <InfoRow icon="fas fa-sticky-note" label="Keterangan" value={selected.keterangan} />
        <InfoRow
          icon="fas fa-home"
          label="Residen Aktif"
          value={selected.is_active_resident
            ? <span style={{ color: '#2dce89', fontWeight: 700 }}>Ya</span>
            : <span style={{ color: '#f5365c', fontWeight: 700 }}>Tidak</span>
          }
        />
        {selected.id_affiliate && (
          <InfoRow icon="fas fa-handshake" label="Afiliasi ID" value={`#${selected.id_affiliate}`} />
        )}
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="cust-detail__orders">
          <div className="cust-detail__section-title">
            <i className="fas fa-clock me-2" style={{ color: '#fb6340' }} />
            Order Aktif ({activeOrders.length})
          </div>
          <div className="cust-order-list">
            {activeOrders.map(order => (
              <div key={order.id} className="cust-order-item">
                <div className="cust-order-item__left">
                  <div className="cust-order-item__code">{order.kode_pesan}</div>
                  <div className="cust-order-item__date">{fmtDate(order.tanggal_pesan)}</div>
                </div>
                <div className="cust-order-item__right">
                  <OrderStatusBadge status={order.status} />
                  <div className="cust-order-item__price">{fmt(order.total_harga)}</div>
                </div>
                <div className="cust-order-item__flags">
                  {order.antar === 1 && (
                    <span className="cust-flag cust-flag--antar" title="Diantar"><i className="fas fa-motorcycle" /></span>
                  )}
                  {order.paid === 0 && (
                    <span className="cust-flag cust-flag--unpaid" title="Belum bayar"><i className="fas fa-exclamation-circle" /></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Segment */}
      {selected.latitude && selected.longitude && selected.latitude !== 0 && selected.longitude !== 0 ? (
        <div className="cust-detail__map" style={{ marginTop: 24 }}>
          <div className="cust-detail__section-title">
            <i className="fas fa-map-marked-alt me-2" style={{ color: '#2dce89' }} />
            Lokasi Pelanggan
          </div>
          <div style={{ height: 260, width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #e9ecef', zIndex: 1 }}>
            <MapContainer center={[selected.latitude, selected.longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[selected.latitude, selected.longitude]} icon={customMarker}>
                <Popup>{selected.nama}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      ) : null}

      {/* Quick Action Footer */}
      <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid var(--cust-border, #e9ecef)' }}>
        <button 
          onClick={() => window.location.href = '#/admin/deposit'}
          style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #11cdef 0%, #1171ef 100%)',
            color: '#fff', fontWeight: 800, fontSize: '0.9rem',
            boxShadow: '0 4px 15px rgba(17, 205, 239, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-coins" />
          <span>Kelola Saldo / Top-up</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailView;
