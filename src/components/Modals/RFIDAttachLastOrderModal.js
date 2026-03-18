import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Badge, Spinner
} from 'reactstrap';
import { toast } from 'react-toastify';
import axios from 'services/axios-instance';
import { useMQTTRFID } from 'hooks/useMQTTRFID';

/**
 * RFIDAttachLastOrderModal
 *
 * Membuka modal yang:
 *  1. Fetch last order dari server
 *  2. Menampilkan info order (kode, nama pelanggan)
 *  3. Menunggu scan RFID via MQTT → auto-attach ke order itu
 *
 * Props:
 *   isOpen   - boolean
 *   toggle   - fn to close
 */
const RFIDAttachLastOrderModal = ({ isOpen, toggle }) => {
  const [lastOrder, setLastOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [attachedRFIDs, setAttachedRFIDs] = useState([]);

  /* ── Fetch last order saat modal dibuka ─────────────────── */
  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      setLastOrder(null);
      setAttachedRFIDs([]);
      return;
    }
    const fetchLast = async () => {
      setLoading(true);
      try {
        const res = await axios.get('api/pesanan/last-order');
        setLastOrder(res.data?.data || null);
      } catch (err) {
        toast.error('Gagal mengambil last order');
        toggle();
      } finally {
        setLoading(false);
      }
    };
    fetchLast();
  }, [isOpen]);

  /* ── RFID scan handler ─────────────────────────────────── */
  const handleRFIDScan = useCallback(async (uid) => {
    if (!isOpen || !lastOrder || attaching) return;

    // Skip if already attached in this session
    if (attachedRFIDs.includes(uid)) {
      toast.warn(`RFID ${uid} sudah dipasang di sesi ini.`);
      return;
    }

    setAttaching(true);
    try {
      await axios.post('api/rfid/attach', {
        order_id: lastOrder.id,
        rfid_code: uid,
      });
      setAttachedRFIDs(prev => [...prev, uid]);
      toast.success(`✅ RFID ${uid} dipasang ke ${lastOrder.kode_pesan}`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Gagal attach RFID ${uid}`);
    } finally {
      setAttaching(false);
    }
  }, [isOpen, lastOrder, attaching, attachedRFIDs]);

  /* ── Subscribe ke MQTT scan (global context) ───────────── */
  const { connected: mqttConnected } = useMQTTRFID({
    enabled: isOpen,
    onUID: handleRFIDScan,
  });

  const customer = lastOrder?.pelanggan || lastOrder?.customer || {};
  const customerName = customer?.nama || lastOrder?.nama || '—';

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader
        toggle={toggle}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: '#fff',
          borderBottom: 'none',
        }}
      >
        <i className="fas fa-tag mr-2" style={{ color: '#2dce89' }} />
        Attach RFID ke Last Order
        <small style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontWeight: 400, fontSize: 12, marginTop: 2 }}>
          F4 · Tekan ESC untuk tutup
        </small>
      </ModalHeader>

      <ModalBody style={{ padding: '24px 28px' }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" style={{ width: 36, height: 36 }} />
            <p className="text-muted mt-3">Mengambil last order…</p>
          </div>
        ) : !lastOrder ? (
          <div className="text-center py-5 text-muted">
            <i className="fas fa-inbox fa-2x d-block mb-2" />
            Tidak ada order terakhir ditemukan.
          </div>
        ) : (
          <>
            {/* Order info card */}
            <div style={{
              background: '#f8f9fe',
              borderRadius: 12,
              padding: '16px 18px',
              border: '1px solid #e4e8f0',
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#32325d' }}>{lastOrder.kode_pesan}</span>
                <Badge color="success" pill>{lastOrder.status || 'baru'}</Badge>
              </div>
              <div style={{ fontSize: 13, color: '#6b7a99', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span><i className="fas fa-user mr-2" />{customerName}</span>
                {lastOrder.telpon && <span><i className="fas fa-phone mr-2" />{lastOrder.telpon}</span>}
                {lastOrder.sub_total && (
                  <span><i className="fas fa-money-bill mr-2" />
                    Rp {parseInt(lastOrder.sub_total).toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>

            {/* RFID scan area */}
            <div
              style={{
                borderRadius: 12,
                border: `2px dashed ${mqttConnected ? '#2dce89' : '#dee2e6'}`,
                padding: '24px 16px',
                textAlign: 'center',
                background: mqttConnected ? 'rgba(45,206,137,0.04)' : '#fbfbfb',
                transition: 'all 0.2s',
                marginBottom: attachedRFIDs.length > 0 ? 16 : 0,
              }}
            >
              {attaching ? (
                <>
                  <Spinner color="success" style={{ width: 28, height: 28 }} />
                  <p className="mt-2 mb-0 text-muted" style={{ fontSize: 13 }}>Menyambungkan RFID…</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>
                    {mqttConnected ? '🏷️' : '📵'}
                  </div>
                  <p style={{ fontWeight: 600, color: mqttConnected ? '#1a9e6a' : '#aaa', marginBottom: 4, fontSize: 14 }}>
                    {mqttConnected
                      ? 'Tempelkan kartu RFID ke reader'
                      : 'Reader RFID tidak terhubung'}
                  </p>
                  <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
                    {mqttConnected
                      ? 'Attach otomatis saat kartu terdeteksi'
                      : 'Pastikan perangkat RFID menyala'}
                  </p>
                </>
              )}
            </div>

            {/* Attached list */}
            {attachedRFIDs.length > 0 && (
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#8898aa', marginBottom: 8 }}>
                  RFID Terpasang ({attachedRFIDs.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {attachedRFIDs.map(rfid => (
                    <div key={rfid} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'rgba(45,206,137,0.08)',
                      border: '1px solid rgba(45,206,137,0.25)',
                      borderRadius: 8, padding: '8px 12px',
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dce89', display: 'inline-block' }} />
                      <code style={{ fontSize: 12, color: '#2dce89', fontWeight: 600 }}>{rfid}</code>
                      <i className="fas fa-check-circle ml-auto" style={{ color: '#2dce89' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </ModalBody>

      <ModalFooter style={{ borderTop: '1px solid #f0f0f5', padding: '12px 20px' }}>
        <small className="text-muted mr-auto">
          {attachedRFIDs.length > 0 && `${attachedRFIDs.length} RFID terpasang`}
        </small>
        <Button color="secondary" size="sm" onClick={toggle}>
          <i className="fas fa-times mr-1" />Tutup (ESC)
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RFIDAttachLastOrderModal;
