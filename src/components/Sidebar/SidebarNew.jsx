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
  // active when path starts with the route (handles /admin/* sub-paths)
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

const SidebarNew = ({ logo, user, token, isCollapsed, toggleSidebar }) => {
  const [isDark, setIsDark] = useState(localStorage.getItem(THEME_KEY) === "dark");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const closeMobile = () => setMobileOpen(false);

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
      {/* ── Mobile Hamburger (renders in AdminNavbar via portal, see below) ─ */}
      {/* We expose a toggle button for mobile via the overlay mechanism */}
      <div className={`sb-overlay${mobileOpen ? " show" : ""}`} onClick={closeMobile} />

      <nav className={`sb-wrap${isCollapsed ? " sb-collapsed" : ""}${mobileOpen ? " sb-open" : ""}`}>
        
        {/* ── Brand / Logo ─────────────────────────────────────── */}
        <Link to="/admin/dashboard" className="sb-brand" onClick={closeMobile}>
          {logo && <img src={logo.imgSrc} alt={logo.imgAlt} />}
          {/* <span className="sb-brand-title">
            Harmony
            <span className="sb-brand-sub">Laundry System</span>
          </span> */}
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

        </div>

        {/* ── Footer Actions ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid var(--sb-border)", padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          {/* Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
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
};

export default SidebarNew;
