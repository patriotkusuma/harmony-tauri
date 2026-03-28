/* ================================================================
   Customer Management — Page (Template)
   ================================================================ */
import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { useCustomerStore } from 'store/customerStore';
import CustomerSearchBar from 'components/molecules/customer/CustomerSearchBar';
import CustomerList from 'components/organisms/customer/CustomerList';
import CustomerModal from 'components/organisms/customer/CustomerModal';
import 'assets/css/customer-management.css';

const CustomerManagement = () => {
  const { fetchCustomers, openCreate, total, loading } = useCustomerStore();

  // Load on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      {/* ── Premium Header ──────────────────────────────────────── */}
      <div className="cust-page-header pt-6">
        <Container fluid>
          <div className="cust-page-header__body">
            <div>
              <h1 className="cust-page-header__title">
                <i className="fas fa-users me-3" />
                Manajemen Pelanggan
              </h1>
              <p className="cust-page-header__sub">
                Kelola data pelanggan, riwayat order, dan order yang sedang aktif.
              </p>
            </div>
            <div className="cust-page-header__stats">
              <div className="cust-stat-pill">
                <i className="fas fa-users" />
                <span>{loading ? '...' : total} Pelanggan</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <Container className="cust-page-container " fluid>
        <div className="cust-page-card">
          {/* Toolbar */}
          <div className="cust-page-card__toolbar">
            <CustomerSearchBar onAdd={openCreate} />
          </div>

          {/* List */}
          <CustomerList />
        </div>
      </Container>

      {/* ── Modal (create / edit / detail) ──────────────────────── */}
      <CustomerModal />
    </>
  );
};

export default CustomerManagement;
