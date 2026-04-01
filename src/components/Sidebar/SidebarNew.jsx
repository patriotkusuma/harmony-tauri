/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";
import axios from "../../services/axios-instance";
import Cookies from "js-cookie";
import SidebarNavSection from "components/molecules/sidebar/SidebarNavSection";
import "../../assets/css/sidebar-new.css";

const THEME_KEY = "theme";

/* ── Main Component ───────────────────────────────────────────── */

const SidebarNew = ({ logo, user, token, isCollapsed, toggleSidebar, mobileOpen, setMobileOpen }) => {
  const [isDark, setIsDark] = useState(localStorage.getItem(THEME_KEY) === "dark");

  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const isMobileOpen   = mobileOpen   !== undefined ? mobileOpen   : internalMobileOpen;
  const setIsMobileOpen = setMobileOpen !== undefined ? setMobileOpen : setInternalMobileOpen;

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const { pathname } = useLocation();
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

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

  const userRole = user?.role || "";

  const sectionOperasional = [
    { to: "/pembayaran", icon: "fas fa-cash-register", label: "Pembayaran Selesai" },
    { to: "/admin/riwayat", icon: "fas fa-history", label: "Riwayat Transaksi" },
    { to: "/admin/bayar", icon: "fas fa-money-check-alt", label: "Customer Bayar" },
    { to: "/admin/deposit", icon: "fas fa-piggy-bank", label: "Saldo / Deposit" },
  ];

  const sectionManajemen = [
    { to: "/admin/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard Utama" },
    { to: "/admin/ai-chat", icon: "fas fa-robot", label: "AI Assistant", role: ["admin", "owner"] },
    { to: "/admin/customers", icon: "fas fa-users", label: "Manajemen Pelanggan" },
    { to: "/admin/operational-report", icon: "fas fa-chart-line", label: "Laporan Operasional", role: ["admin", "owner"] },
    { to: "/admin/accounting-report", icon: "fas fa-file-invoice-dollar", label: "Laporan Akuntansi", role: ["admin", "owner"] },
    { to: "/admin/suppliers", icon: "fas fa-truck-loading", label: "Supplier & Vendor", role: ["admin", "owner"] },
    { to: "/admin/purchases", icon: "fas fa-shopping-basket", label: "Belanja Kebutuhan", role: ["admin", "owner"] },
    { to: "/admin/inventory", icon: "fas fa-boxes", label: "Stok Inventaris", role: ["admin", "owner"] },
    { to: "/admin/employees", icon: "fas fa-users", label: "Manajemen Pegawai", role: ["admin", "owner"] },
    { to: "/admin/affiliates", icon: "fas fa-handshake", label: "Afiliasi & Partner", role: ["admin", "owner"] },
    { to: "/admin/order-timeline", icon: "fas fa-microchip", label: "Log Mesin Aktif" },
  ];

  const sectionSettings = [
    { to: "/admin/messages", icon: "fas fa-comments", label: "Broadcast Messages" },
    { to: "/admin/blog", icon: "fas fa-newspaper", label: "Blog & Artikel" },
    { to: "/admin/service-revenue", icon: "fas fa-file-invoice-dollar", label: "Service & Revenue", role: ["admin", "owner"] },
    { to: "/admin/whatsapp-payload", icon: "fab fa-whatsapp", label: "WhatsApp Payload" },
    { to: "/admin/notification-setting", icon: "fas fa-bell", label: "Pengaturan Notifikasi" },
    { to: "/admin/webhook-logs", icon: "fas fa-plug", label: "Webhook Logs", role: ["admin", "owner"] },
    { to: "/admin/rfid", icon: "fas fa-id-card", label: "RFID Attach/Detach" },
    { to: "/admin/rfid-cards", icon: "fas fa-credit-card", label: "RFID Kartu Master" },
    { to: "/admin/iot-management", icon: "fas fa-robot", label: "IoT & Device", role: ["admin", "owner"] },
    { to: "/admin/system-settings", icon: "fas fa-cogs", label: "Konfigurasi Inti", role: ["admin", "owner"] },
  ];

  return (
    <>
      <div
        className={`sb-overlay${isMobileOpen ? " show" : ""}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <nav className={`sb-wrap${isCollapsed ? " sb-collapsed" : ""}${isMobileOpen ? " sb-open" : ""}`}
           role="navigation"
           aria-label="Sidebar navigasi utama"
      >
        <button
          className="sb-mobile-close d-md-none"
          onClick={closeMobile}
          aria-label="Tutup menu"
        >
          <i className="fas fa-times" />
        </button>

        <Link to="/admin/dashboard" className="sb-brand" onClick={closeMobile}>
          {logo && <img src={logo.imgSrc} alt={logo.imgAlt} />}
        </Link>

        <div className="sb-scroll">
          <Link to="/pesanan" className="sb-pos-btn" onClick={closeMobile} style={{ marginTop: "1rem" }}>
            <i className="fas fa-shopping-basket" />
            <span className="sb-pos-label">Buka Kasir POS</span>
          </Link>

          <SidebarNavSection 
            heading="Kasir & Operasional" 
            items={sectionOperasional} 
            userRole={userRole} 
            onClick={closeMobile} 
          />

          <SidebarNavSection 
            heading="Manajemen & Laporan" 
            items={sectionManajemen} 
            userRole={userRole} 
            onClick={closeMobile} 
          />

          <SidebarNavSection 
            heading="Pengaturan Sistem" 
            items={sectionSettings} 
            userRole={userRole} 
            onClick={closeMobile} 
          />
        </div>

        <div style={{ borderTop: "1px solid var(--sb-border)", padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", flexShrink: 0 }}>
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
