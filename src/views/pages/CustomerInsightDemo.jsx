/* ================================================================
   Customer Insight — UI Preview (DUMMY)
   ----------------------------------------------------------------
   Halaman ini hanya untuk review desain sebelum backend siap.
   Buka: /admin/customer-insight-demo
   Hapus halaman ini (dan route-nya) setelah endpoint asli tersedia.
   ================================================================ */
import React, { useCallback, useMemo, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import CustomerInsightSummary from 'components/molecules/customer/CustomerInsightSummary';
import CustomerInsightBadges from 'components/molecules/customer/CustomerInsightBadges';
import CustomerInsightLine from 'components/molecules/customer/CustomerInsightLine';
import InitialsAvatar from 'components/atoms/customer/InitialsAvatar';
import OrderCustomerBar from 'components/organisms/OrderCustomerBar';
import CustomerModal from 'components/Modals/CustomerModal';
import { attachDummyInsights } from 'utils/customerInsights';

const DEMO_CUSTOMERS = [
  { id: 822, nama: 'edo', telpon: '6281234500822' },
  { id: 588, nama: 'Bruno', telpon: '6281234500588' },
  { id: 603, nama: 'sumiyati', telpon: '6281234500603' },
  { id: 1054, nama: 'isti', telpon: '6281234501054' },
  { id: 1155, nama: 'Lala', telpon: '6281234501155' },
  { id: 999, nama: 'campur', telpon: '6281234500999' },
  { id: 1001, nama: 'pelanggan baru', telpon: '6281234501001' },
  { id: 1002, nama: 'Rina', telpon: '6281234501002' },
];

const SectionTitle = ({ children, sub }) => (
  <div className="mb-3">
    <h4 className="mb-1 font-weight-900" style={{ color: '#32325d' }}>{children}</h4>
    {sub && <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>{sub}</p>}
  </div>
);

const CustomerInsightDemo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);

  const customers = useMemo(() => DEMO_CUSTOMERS.map(attachDummyInsights), []);

  // Pencarian palsu untuk preview: cukup filter data dummy.
  const handleSearch = useCallback((queryNama = '', queryTelpon = '') => {
    const name = queryNama.trim().toLowerCase();
    const phone = queryTelpon.replace(/\D/g, '');

    setResults(
      customers.filter((customer) => {
        const matchName = !name || customer.nama.toLowerCase().includes(name);
        const matchPhone = !phone || customer.telpon.includes(phone);
        return matchName && matchPhone;
      })
    );
  }, [customers]);

  const handleSelect = (customer) => {
    setSelected(customer);
    setModalOpen(false);
  };

  const handleUseNew = ({ nama, telpon }) => {
    setSelected({ id: null, nama, telpon, insights: null });
    setModalOpen(false);
  };

  const handleReset = () => setSelected(null);

  return (
    <Container fluid className="pt-4 pb-5">
      {/* Header */}
      <div
        className="p-4 mb-4 text-white position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)', borderRadius: 18 }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="d-inline-flex align-items-center mb-2"
            style={{
              gap: 6,
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              background: 'rgba(255,255,255,0.16)',
              padding: '3px 10px',
              borderRadius: 20,
            }}
          >
            <i className="fas fa-flask" /> UI PREVIEW · DATA DUMMY
          </div>
          <h2 className="font-weight-900 mb-1" style={{ color: '#fff' }}>Ringkasan Pelanggan di Kasir</h2>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 720 }}>
            Contoh tampilan bar pelanggan, satu baris riwayat, dan panel riwayat lengkap.
            Semua angka masih dummy dan akan diganti dengan agregasi SQL dari <code style={{ color: '#fff' }}>pesanans</code>.
          </p>
        </div>
      </div>

      {/* Bar pelanggan */}
      <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <SectionTitle sub="Tampil paling atas di rail kanan. Detail riwayat hanya dibuka kalau perlu.">
            1. Bar Pelanggan
          </SectionTitle>
          <div style={{ maxWidth: 420 }}>
            {selected ? (
              <OrderCustomerBar
                nama={selected.nama}
                telpon={selected.telpon}
                customerInsights={selected.insights}
                isExistingCustomer={Boolean(selected.id)}
                onChoose={() => setModalOpen(true)}
              />
            ) : (
              <OrderCustomerBar
                nama=""
                telpon=""
                customerInsights={null}
                onChoose={() => setModalOpen(true)}
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* Daftar pelanggan */}
      <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <SectionTitle sub="Satu baris ringkas dengan bahasa sehari-hari, bukan istilah teknis.">
            2. Ringkasan Satu Baris
          </SectionTitle>
          <Row className="gx-3 gy-3">
            {customers.map((customer) => (
              <Col md="6" key={customer.id}>
                <div
                  className="d-flex align-items-center p-3"
                  style={{ border: '1px solid #eef0f5', borderRadius: 12, gap: 12 }}
                >
                  <InitialsAvatar name={customer.nama} size={42} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="font-weight-bold text-truncate" style={{ color: '#32325d' }}>
                      {customer.nama}
                    </div>
                    <CustomerInsightLine insights={customer.insights} showDebt className="mt-1" />
                    <CustomerInsightBadges insights={customer.insights} max={2} className="mt-1" />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>

      {/* Panel riwayat */}
      <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <SectionTitle sub="Dibuka lewat “Lihat riwayat” di bar pelanggan.">
            3. Panel Riwayat Lengkap
          </SectionTitle>
          <Row className="gx-3 gy-3">
            {customers.slice(0, 6).map((customer) => (
              <Col lg="4" md="6" key={customer.id}>
                <div className="mb-1 small font-weight-bold text-uppercase" style={{ color: '#8898aa', letterSpacing: '0.06em' }}>
                  {customer.nama}
                </div>
                <CustomerInsightSummary insights={customer.insights} />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>

      {/* Live modal preview */}
      <Card className="border-0 shadow-sm">
        <CardBody>
          <SectionTitle sub="Klik baris pelanggan untuk langsung memilih. Nama baru memakai tombol “Pakai Nama Ini”.">
            4. Coba Pemilih Pelanggan
          </SectionTitle>
          <div className="d-flex flex-wrap align-items-center" style={{ gap: 10 }}>
            <Button color="primary" className="rounded-pill px-4" onClick={() => setModalOpen(true)}>
              <i className="fas fa-user-search me-2" /> Buka Pilih Pelanggan
            </Button>
            {selected && (
              <div className="d-flex align-items-center" style={{ gap: 8 }}>
                <span className="text-muted small">
                  Terpilih: <strong style={{ color: '#32325d' }}>{selected.nama}</strong>
                </span>
                <Button color="link" size="sm" className="text-danger p-0" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <CustomerModal
        isOpen={modalOpen}
        toggle={() => setModalOpen((prev) => !prev)}
        pelanggan={results}
        isSearchingCustomers={false}
        onSearch={handleSearch}
        onSelectCustomer={handleSelect}
        onUseNewCustomer={handleUseNew}
      />
    </Container>
  );
};

export default CustomerInsightDemo;
