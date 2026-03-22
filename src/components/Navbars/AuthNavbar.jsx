import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HarmonyLogo from "assets/img/brand/harmony-blue.png";
import ArgonLogo from "assets/img/brand/argon-react.png";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const THEME_KEY = "theme";

const AdminNavbar = () => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))||null)
const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

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
      <Navbar className="navbar-top navbar-horizontal navbar-dark border-bottom-0 py-4" expand="md" style={{ position: 'absolute', width: '100%', zIndex: 10 }}>
        <Container className="px-4 d-flex justify-content-between align-items-center">
          {/* Left/Center Brand */}
          <NavbarBrand to="/" tag={Link} className="d-flex align-items-center">
            <img
              alt="Harmony Laundry"
              src={HarmonyLogo}
              style={{ height: '40px' }}
              className="mr-2"
            />
            <span className="text-white font-weight-bold ms-2 d-none d-sm-block text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.2rem' }}>
              Harmony System
            </span>
          </NavbarBrand>

          {/* Right Navigation */}
          <Nav className="ms-auto align-items-center d-flex flex-row" navbar>
            
            {user !== null ? (
              <div className="d-flex align-items-center me-3">
                <NavItem className="d-none d-md-block">
                  <NavLink className="nav-link-icon px-3 py-2 text-white opacity-8 hover-opacity-10 transition-all font-weight-bold" to="/admin/dashboard" tag={Link}>
                    <i className="ni ni-tv-2 me-2 text-primary" />
                    <span className="nav-link-inner--text">Dashboard</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link-icon px-3 py-2 text-white opacity-8 hover-opacity-10 transition-all font-weight-bold mx-1" to="/pesanan" tag={Link}>
                    <i className="fas fa-bag-shopping me-2 text-info" />
                    <span className="nav-link-inner--text">Pesanan</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link-icon px-3 py-2 text-white opacity-8 hover-opacity-10 transition-all font-weight-bold mx-1" to="/pembayaran" tag={Link}>
                    <i className="fas fa-cash-register me-2 text-success" />
                    <span className="nav-link-inner--text">Pembayaran</span>
                  </NavLink>
                </NavItem>
                <NavItem className="ms-2">
                  <NavLink className="nav-link-icon px-3 py-2 rounded-pill bg-white-10 text-white font-weight-bold transition-all hover-bg-white-05" to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02 me-2" />
                    <span className="nav-link-inner--text d-none d-lg-inline">{user?.name || "Profile"}</span>
                  </NavLink>
                </NavItem>
              </div>
            ) : (
              <NavItem className="me-3 d-none d-md-block">
                <NavLink className="nav-link-icon px-3 py-2 text-white opacity-8 hover-opacity-10 transition-all font-weight-bold" to="/auth/help" tag={Link}>
                  <i className="ni ni-support-16 me-2" />
                  <span className="nav-link-inner--text">Panduan</span>
                </NavLink>
              </NavItem>
            )}

            <NavItem>
              <button
                type="button"
                className="btn btn-link nav-link text-white opacity-8 hover-opacity-10 p-2 transition-all d-flex align-items-center shadow-none"
                onClick={() => setIsDark(!isDark)}
                title={isDark ? "Light Mode" : "Dark Mode"}
                style={{ fontSize: "1.2rem" }}
              >
                <i className={`fas ${isDark ? "fa-sun text-warning" : "fa-moon"}`} />
              </button>
            </NavItem>
          </Nav>
        </Container>

        <style>{`
          .bg-white-10 { background: rgba(255, 255, 255, 0.15) !important; }
          .hover-bg-white-05:hover { background: rgba(255, 255, 255, 0.25) !important; color: white !important; }
          .transition-all { transition: all 0.2s ease; }
          .hover-opacity-10:hover { opacity: 1 !important; }
        `}</style>
      </Navbar>

    </>
  );
};

export default AdminNavbar;
