import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HarmonyLogo from "assets/img/brand/harmony-blue.png";
// reactstrap components
import {
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";

const THEME_KEY = "theme";

const AuthNavbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const { pathname } = useLocation();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [isDark]);

  return (
    <>
      <Navbar
        className="navbar-top navbar-horizontal navbar-dark border-bottom-0 py-3"
        expand="md"
        style={{ position: "absolute", width: "100%", zIndex: 10 }}
      >
        <Container className="px-3 px-md-4 d-flex justify-content-between align-items-center">
          {/* ── Brand / Logo ───────────────────────── */}
          <NavbarBrand to="/" tag={Link} className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            <img
              alt="Harmony Laundry"
              src={HarmonyLogo}
              style={{ height: "36px" }}
            />
            <span
              className="text-white font-weight-bold d-none d-sm-block text-uppercase"
              style={{ letterSpacing: "1px", fontSize: "1rem" }}
            >
              Harmony System
            </span>
          </NavbarBrand>

          {/* ── Right Nav ──────────────────────────── */}
          <Nav className="ms-auto align-items-center d-flex flex-row" navbar style={{ gap: "0.25rem" }}>
            {user !== null ? (
              <>
                {/* Dashboard — desktop only */}
                <NavItem className="d-none d-md-block">
                  <NavLink
                    className="nav-kasir-link px-3 py-2 text-white font-weight-bold"
                    to="/admin/dashboard"
                    tag={Link}
                  >
                    <i className="ni ni-tv-2 me-2 text-primary" />
                    <span className="nav-link-inner--text">Dashboard</span>
                  </NavLink>
                </NavItem>

                {/* Pesanan */}
                <NavItem>
                  <NavLink
                    className={`nav-kasir-link px-2 px-md-3 py-2 text-white font-weight-bold${pathname === "/pesanan" ? " nav-kasir-active" : ""}`}
                    to="/pesanan"
                    tag={Link}
                  >
                    <i className="fas fa-bag-shopping me-1 me-md-2 text-info" />
                    <span className="nav-link-inner--text d-none d-sm-inline">Pesanan</span>
                  </NavLink>
                </NavItem>

                {/* Pembayaran */}
                <NavItem>
                  <NavLink
                    className={`nav-kasir-link px-2 px-md-3 py-2 text-white font-weight-bold${pathname === "/pembayaran" ? " nav-kasir-active" : ""}`}
                    to="/pembayaran"
                    tag={Link}
                  >
                    <i className="fas fa-cash-register me-1 me-md-2 text-success" />
                    <span className="nav-link-inner--text d-none d-sm-inline">Pembayaran</span>
                  </NavLink>
                </NavItem>

                {/* Admin / Back to dashboard — icon only on mobile */}
                <NavItem>
                  <NavLink
                    className="nav-kasir-link px-2 py-2 text-white font-weight-bold"
                    to="/admin/riwayat"
                    tag={Link}
                    title="Riwayat"
                  >
                    <i className="fas fa-history text-warning" />
                    <span className="nav-link-inner--text ms-1 d-none d-lg-inline">Riwayat</span>
                  </NavLink>
                </NavItem>

                {/* Dark Mode toggle */}
                <NavItem>
                  <button
                    type="button"
                    className="nav-kasir-btn text-white"
                    onClick={() => setIsDark(!isDark)}
                    title={isDark ? "Light Mode" : "Dark Mode"}
                    aria-label={isDark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
                  >
                    <i className={`fas ${isDark ? "fa-sun text-warning" : "fa-moon"}`} />
                  </button>
                </NavItem>

                {/* Profile — shows initial on mobile, name on desktop */}
                <NavItem>
                  <NavLink
                    className="nav-kasir-link nav-kasir-profile px-2 px-md-3 py-2 text-white font-weight-bold"
                    to="/admin/user-profile"
                    tag={Link}
                  >
                    <span className="nav-kasir-avatar d-md-none">
                      {(user?.name || "U").charAt(0).toUpperCase()}
                    </span>
                    <i className="ni ni-single-02 me-2 d-none d-md-inline" />
                    <span className="nav-link-inner--text d-none d-md-inline">{user?.name || "Profile"}</span>
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                {/* Not logged in */}
                <NavItem className="d-none d-md-block">
                  <NavLink
                    className="nav-kasir-link px-3 py-2 text-white font-weight-bold"
                    to="/auth/help"
                    tag={Link}
                  >
                    <i className="ni ni-support-16 me-2" />
                    <span>Panduan</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <button
                    type="button"
                    className="nav-kasir-btn text-white"
                    onClick={() => setIsDark(!isDark)}
                    title={isDark ? "Light Mode" : "Dark Mode"}
                  >
                    <i className={`fas ${isDark ? "fa-sun text-warning" : "fa-moon"}`} />
                  </button>
                </NavItem>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* ── Mobile Bottom Quick Nav (Kasir pages) ─── */}
      {user !== null && (
        <nav className="kasir-bottom-nav" aria-label="Navigasi kasir bawah">
          <Link
            to="/admin/dashboard"
            className={`kasir-bottom-item${pathname.startsWith("/admin") ? " active" : ""}`}
          >
            <i className="fas fa-tachometer-alt" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/pesanan"
            className={`kasir-bottom-item${pathname === "/pesanan" ? " active" : ""}`}
          >
            <i className="fas fa-bag-shopping" />
            <span>Kasir</span>
          </Link>
          <Link
            to="/pembayaran"
            className={`kasir-bottom-item${pathname === "/pembayaran" ? " active" : ""}`}
          >
            <i className="fas fa-cash-register" />
            <span>Bayar</span>
          </Link>
          <Link
            to="/admin/riwayat"
            className={`kasir-bottom-item${pathname.startsWith("/admin/riwayat") ? " active" : ""}`}
          >
            <i className="fas fa-history" />
            <span>Riwayat</span>
          </Link>
        </nav>
      )}

      <style>{`
        /* ── Kasir Navbar Links ─────────────────────────────── */
        .nav-kasir-link {
          display: flex;
          align-items: center;
          border-radius: 8px;
          text-decoration: none !important;
          opacity: 0.85;
          transition: opacity 0.15s, background 0.15s;
        }
        .nav-kasir-link:hover,
        .nav-kasir-active {
          opacity: 1 !important;
          background: rgba(255,255,255,0.12) !important;
        }

        /* Dark-mode icon button */
        .nav-kasir-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem 0.6rem;
          border-radius: 8px;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          opacity: 0.85;
          transition: opacity 0.15s, background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-kasir-btn:hover { opacity: 1; background: rgba(255,255,255,0.12); }
        .nav-kasir-btn:focus { outline: none; }

        /* Profile avatar circle - mobile */
        .nav-kasir-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          border: 2px solid rgba(255,255,255,0.35);
        }

        /* ── Kasir Bottom Navigation Bar — mobile only ─────── */
        .kasir-bottom-nav {
          display: none; /* shown via media query below */
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1050;
          height: 62px;
          padding-bottom: env(safe-area-inset-bottom, 0px);
          background: rgba(22, 28, 45, 0.97);
          border-top: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          align-items: stretch;
          justify-content: space-around;
        }

        .kasir-bottom-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          text-decoration: none !important;
          color: rgba(255,255,255,0.45);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          padding: 0.4rem 0.25rem;
          position: relative;
          overflow: hidden;
          transition: color 0.15s ease, background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
        }
        .kasir-bottom-item i {
          font-size: 1.2rem;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
        }
        .kasir-bottom-item.active {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .kasir-bottom-item.active i {
          transform: translateY(-2px) scale(1.1);
        }
        .kasir-bottom-item.active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 3px;
          background: #5e72e4;
          border-radius: 0 0 4px 4px;
          animation: kasir-pill-in 0.2s ease forwards;
        }
        @keyframes kasir-pill-in {
          from { width: 0; opacity: 0; }
          to   { width: 28px; opacity: 1; }
        }
        .kasir-bottom-item:hover { color: rgba(255,255,255,0.8); }

        /* Ripple on tap */
        .kasir-bottom-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.1);
          opacity: 0;
          transform: scale(0);
        }
        .kasir-bottom-item:active::after {
          transform: scale(3);
          opacity: 1;
          transition: 0s;
        }

        /* Dark mode adjustments */
        body.dark-mode .kasir-bottom-nav {
          background: rgba(15, 20, 35, 0.97);
          border-top-color: rgba(255,255,255,0.07);
        }

        /* ── Show on mobile only ───────────────────────────── */
        @media (max-width: 767.98px) {
          .kasir-bottom-nav { display: flex; }
        }

        /* ── Navbar spacing helpers ────────────────────────── */
        .bg-white-10 { background: rgba(255, 255, 255, 0.15) !important; }
        .hover-bg-white-05:hover { background: rgba(255, 255, 255, 0.25) !important; color: white !important; }
        .transition-all { transition: all 0.2s ease; }
        .hover-opacity-10:hover { opacity: 1 !important; }
      `}</style>
    </>
  );
};

export default AuthNavbar;
