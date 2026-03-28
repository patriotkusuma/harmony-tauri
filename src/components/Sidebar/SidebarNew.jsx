/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";
import axios from "../../services/axios-instance";
import Cookies from "js-cookie";
import "../../assets/css/sidebar-new.css";

const THEME_KEY = "theme";

/* ── Micro components ─────────────────────────────────────────── */

const SbItem = ({ to, icon, label, onClick }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(to + "/");
  return (
    <Link to={to} onClick={onClick} className={`sb-item${isActive ? " active" : ""}`}>
      <span className="sb-item-icon"><i className={icon} /></span>
      <span className="sb-item-label">{label}</span>
    </Link>
  );
};

const SbHeading = ({ text }) => (
  <div className="sb-heading">{text}</div>
);

const SbDivider = () => <div className="sb-divider" />;

/* ── Main Component ───────────────────────────────────────────── */

const SidebarNew = ({ logo, user, token, isCollapsed, toggleSidebar, mobileOpen, setMobileOpen }) => {
  const [isDark, setIsDark] = useState(localStorage.getItem(THEME_KEY) === "dark");

  // Internal fallback if mobileOpen is not controlled from outside
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const isMobileOpen   = mobileOpen   !== undefined ? mobileOpen   : internalMobileOpen;
  const setIsMobileOpen = setMobileOpen !== undefined ? setMobileOpen : setInternalMobileOpen;

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Close sidebar on route change (mobile)
  const { pathname } = useLocation();
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

  const logout = async () => {
    if (token) {
      try { await axios.post("/user-logout"); } catch (_) {}
      localStorage.clear();
      Cookies.remove();
      window.location.reload();
    }
  };

  const isAdminOrOwner = user && (user.role === "admin" || user.role === "owner");

  return (
    <>
      {/* ── Backdrop overlay ───────────────────────────────────── */}
      <div
        className={`sb-overlay${isMobileOpen ? " show" : ""}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <nav className={`sb-wrap${isCollapsed ? " sb-collapsed" : ""}${isMobileOpen ? " sb-open" : ""}`}
           role="navigation"
           aria-label="Sidebar navigasi utama"
      >
        {/* Mobile close button (inside sidebar, top right) */}
        <button
          className="sb-mobile-close d-md-none"
          onClick={closeMobile}
          aria-label="Tutup menu"
        >
          <i className="fas fa-times" />
        </button>

        {/* ── Brand / Logo ─────────────────────────────────────── */}
        <Link to="/admin/dashboard" className="sb-brand" onClick={closeMobile}>
          {logo && <img src={logo.imgSrc} alt={logo.imgAlt} />}
        </Link>

        {/* ── Scrollable body ──────────────────────────────────── */}
        <div className="sb-scroll">

          {/* POS Button */}
          <Link to="/pesanan" className="sb-pos-btn" onClick={closeMobile} style={{ marginTop: "1rem" }}>
            <i className="fas fa-shopping-basket" />
            <span className="sb-pos-label">Buka Kasir POS</span>
          </Link>

          {/* ── Section: Kasir & Operasional */}
          <SbHeading text="Kasir & Operasional" />
          <SbItem to="/pembayaran"       icon="fas fa-cash-register"       label="Pembayaran Selesai"     onClick={closeMobile} />
          <SbItem to="/admin/riwayat"    icon="fas fa-history"             label="Riwayat Transaksi"      onClick={closeMobile} />
          <SbItem to="/admin/bayar"      icon="fas fa-money-check-alt"     label="Customer Bayar"         onClick={closeMobile} />
          <SbItem to="/admin/deposit"    icon="fas fa-piggy-bank"          label="Saldo / Deposit"        onClick={closeMobile} />

          <SbDivider />

          {/* ── Section: Manajemen & Laporan */}
          <SbHeading text="Manajemen & Laporan" />
          <SbItem to="/admin/dashboard"          icon="fas fa-tachometer-alt"        label="Dashboard Utama"        onClick={closeMobile} />
          {isAdminOrOwner && <SbItem to="/admin/ai-chat"            icon="fas fa-robot"                label="AI Assistant"           onClick={closeMobile} />}
          <SbItem to="/admin/customers"          icon="fas fa-users"                 label="Manajemen Pelanggan"    onClick={closeMobile} />
          {isAdminOrOwner && <SbItem to="/admin/operational-report" icon="fas fa-chart-line"     label="Laporan Operasional"    onClick={closeMobile} />}
          {isAdminOrOwner && <SbItem to="/admin/suppliers"          icon="fas fa-truck-loading"   label="Supplier & Vendor"      onClick={closeMobile} />}
          {isAdminOrOwner && <SbItem to="/admin/purchases"          icon="fas fa-shopping-basket" label="Belanja Kebutuhan"      onClick={closeMobile} />}
          {isAdminOrOwner && <SbItem to="/admin/inventory"          icon="fas fa-boxes"           label="Stok Inventaris"        onClick={closeMobile} />}
          {isAdminOrOwner && <SbItem to="/admin/employees"          icon="fas fa-users"           label="Manajemen Pegawai"      onClick={closeMobile} />}
          {isAdminOrOwner && <SbItem to="/admin/affiliates"         icon="fas fa-handshake"       label="Afiliasi & Partner"     onClick={closeMobile} />}
          <SbItem to="/admin/order-timeline"     icon="fas fa-microchip"             label="Log Mesin Aktif"        onClick={closeMobile} />

          <SbDivider />

          {/* ── Section: Pengaturan Sistem */}
          <SbHeading text="Pengaturan Sistem" />
          <SbItem to="/admin/messages"            icon="fas fa-comments"             label="Broadcast Messages"     onClick={closeMobile} />
          <SbItem to="/admin/blog"                icon="fas fa-newspaper"            label="Blog & Artikel"         onClick={closeMobile} />
          {isAdminOrOwner && <SbItem to="/admin/service-revenue"   icon="fas fa-file-invoice-dollar" label="Service & Revenue"   onClick={closeMobile} />}
          <SbItem to="/admin/whatsapp-payload"    icon="fab fa-whatsapp"             label="WhatsApp Payload"       onClick={closeMobile} />
          <SbItem to="/admin/notification-setting" icon="fas fa-bell"               label="Pengaturan Notifikasi"  onClick={closeMobile} />
          <SbItem to="/admin/rfid"                icon="fas fa-id-card"              label="RFID Attach/Detach"     onClick={closeMobile} />
          <SbItem to="/admin/rfid-cards"          icon="fas fa-credit-card"          label="RFID Kartu Master"      onClick={closeMobile} />
          {isAdminOrOwner && <SbItem to="/admin/system-settings"  icon="fas fa-cogs"                 label="Konfigurasi Inti"       onClick={closeMobile} />}

        </div>

        {/* ── Footer Actions ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid var(--sb-border)", padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          {/* Collapse Toggle — hidden on mobile since we hide sidebar by default */}
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="d-none d-md-flex"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.5rem", height: "38px", borderRadius: "8px", border: "1px solid var(--sb-border)",
              background: "transparent", cursor: "pointer", color: "var(--sb-text)", fontSize: "0.8rem",
              fontWeight: 600, transition: "background 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <i className={`fas fa-${isCollapsed ? "angles-right" : "angles-left"}`} />
            {!isCollapsed && <span>Ciutkan</span>}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            title={isDark ? "Light Mode" : "Dark Mode"}
            style={{
              width: "38px", height: "38px", borderRadius: "8px", border: "1px solid var(--sb-border)",
              background: "transparent", cursor: "pointer", color: isDark ? "#f59e0b" : "var(--sb-text)",
              fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, color 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`} />
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            title="Logout"
            style={{
              width: "38px", height: "38px", borderRadius: "8px", border: "1px solid rgba(245,54,92,0.3)",
              background: "rgba(245,54,92,0.07)", cursor: "pointer", color: "#f5365c",
              fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(245,54,92,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(245,54,92,0.07)"}
          >
            <i className="fas fa-power-off" />
          </button>
        </div>

      </nav>

      {/* ── Mobile Bottom Nav Bar ─────────────────────────────── */}
      <nav className="sb-bottom-nav d-md-none" aria-label="Navigasi bawah mobile">
        <Link to="/pesanan" className={`sb-bottom-item${pathname === '/pesanan' ? ' active' : ''}`}>
          <i className="fas fa-shopping-basket" />
          <span>Kasir</span>
        </Link>
        <Link to="/admin/dashboard" className={`sb-bottom-item${pathname === '/admin/dashboard' ? ' active' : ''}`}>
          <i className="fas fa-tachometer-alt" />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/riwayat" className={`sb-bottom-item${pathname.startsWith('/admin/riwayat') ? ' active' : ''}`}>
          <i className="fas fa-history" />
          <span>Riwayat</span>
        </Link>
        <button
          className={`sb-bottom-item sb-bottom-menu-btn${isMobileOpen ? " sb-menu-open" : ""}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Buka menu lengkap"
          aria-expanded={isMobileOpen}
        >
          <i className={`fas ${isMobileOpen ? "fa-times" : "fa-bars"}`} />
          <span>{isMobileOpen ? "Tutup" : "Menu"}</span>
        </button>
      </nav>
    </>
  );
};

SidebarNew.defaultProps = { routes: [{}] };
SidebarNew.propTypes = {
  logo: PropTypes.shape({ innerLink: PropTypes.string, imgSrc: PropTypes.string.isRequired, imgAlt: PropTypes.string.isRequired }),
  user: PropTypes.object,
  token: PropTypes.string,
  isCollapsed: PropTypes.bool,
  toggleSidebar: PropTypes.func,
  mobileOpen: PropTypes.bool,
  setMobileOpen: PropTypes.func,
};

export default SidebarNew;
