/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import axios from "../../services/axios-instance";
import Cookies from "js-cookie";
import "../../assets/css/sidebar-new.css";

const THEME_KEY = "theme";

const SidebarNew = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const { routes, logo, user, token, toggleSidebar, isCollapsed } = props;

  const logout = async () => {
    if (token !== null) {
      try {
        await axios.post('https://api.harmonylaundry.my.id/user-logout');
      } catch (err) {
        console.error(err);
      }
      localStorage.clear();
      Cookies.remove();
      navigate('/auth/login');
    }
  };

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
    <Navbar
      className="navbar-vertical fixed-left navbar-light sidebar-new"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand */}
        {logo && (
          <NavbarBrand className="pt-0" to={logo.innerLink} tag={Link}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        )}

        {/* User Mobile */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                   <i className="fas fa-user-circle fa-2x" />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem onClick={logout}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col className="collapse-brand" xs="6">
                {logo && <Link to={logo.innerLink}><img alt={logo.imgAlt} src={logo.imgSrc} /></Link>}
              </Col>
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* POS Super Button - Fixed at Top */}
          <div className="pos-wrapper-fixed">
            <Link to="/pesanan" onClick={closeCollapse} className="pos-card-new">
              <div className="icon-box">
                <i className="fas fa-shopping-basket" />
              </div>
              <div className="text-content">
                <span className="title">POS</span>
                {/* <span className="sub">Mulai Antrian POS</span> */}
              </div>
            </Link>
          </div>

          {/* Section: Kasir & Operasional */}
          <h6 className="heading-new">Kasir & Operasional</h6>
          <Nav navbar>
            <NavItem>
              <NavLink to="/pembayaran" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-cash-register text-success" />
                <span>Pembayaran Selesai</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/riwayat" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-history text-info" />
                <span>Riwayat Transaksi</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/bayar" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-money-check-alt text-blue" />
                <span>Customer Bayar</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/deposit" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-piggy-bank text-red" />
                <span>Saldo / Deposit</span>
              </NavLink>
            </NavItem>
          </Nav>

          <hr className="sidebar-divider-new" />

          {/* Section: Manajemen & Laporan */}
          <h6 className="heading-new">Manajemen & Laporan</h6>
          <Nav navbar>
            <NavItem>
              <NavLink to="/admin/dashboard" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-tachometer-alt text-primary" />
                <span>Dashboard Utama</span>
              </NavLink>
            </NavItem>
            {user && (user.role === "admin" || user.role === "owner") && (
              <NavItem>
                <NavLink to="/admin/operational-report" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                  <i className="fas fa-chart-line text-info" />
                  <span>Laporan Operasional</span>
                </NavLink>
              </NavItem>
            )}

            {user && (user.role === "admin" || user.role === "owner") && (
              <>
                <NavItem>
                  <NavLink to="/admin/purchases" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                    <i className="fas fa-shopping-basket text-danger" />
                    <span>Belanja Kebutuhan</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/admin/inventory" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                    <i className="fas fa-boxes text-info" />
                    <span>Stok Inventaris</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/admin/employees" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                    <i className="fas fa-users text-primary" />
                    <span>Manajemen Pegawai</span>
                  </NavLink>
                </NavItem>
              </>
            )}
            <NavItem>
              <NavLink to="/admin/order-timeline" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-microchip text-success" />
                <span>Log Mesin Aktif</span>
              </NavLink>
            </NavItem>
          </Nav>

          <hr className="sidebar-divider-new" />

          {/* Section: Pengaturan Sistem */}
          <h6 className="heading-new">Pengaturan Sistem</h6>
          <Nav navbar>
            <NavItem>
              <NavLink to="/admin/messages" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-comments text-cyan" />
                <span>Broadcast Messages</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/blog" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-newspaper text-primary" />
                <span>Blog & Artikel</span>
              </NavLink>
            </NavItem>
            {user && (user.role === "admin" || user.role === "owner") && (
              <NavItem>
                <NavLink to="/admin/service-revenue" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                  <i className="fas fa-file-invoice-dollar text-success" />
                  <span>Service & Revenue</span>
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <NavLink to="/admin/whatsapp-payload" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fab fa-whatsapp text-success" />
                <span>WhatsApp Payload</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/notification-setting" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-bell text-warning" />
                <span>Pengaturan Notifikasi</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/rfid" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-id-card text-indigo" />
                <span>RFID Attach/Detach</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/rfid-cards" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-new" activeClassName="active">
                <i className="fas fa-credit-card text-purple" />
                <span>RFID Kartu Master</span>
              </NavLink>
            </NavItem>
          </Nav>

          {/* Theme Toggle & Logout at Bottom */}
          <div className="mt-auto mb-4 px-3">
             <button
              className="btn btn-outline-primary btn-block btn-sm mb-2"
              onClick={() => setIsDark(!isDark)}
            >
              <i className={`fas ${isDark ? "fa-sun" : "fa-moon"} mr-2`} />
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            <button className="btn btn-outline-danger btn-block btn-sm" onClick={logout}>
              <i className="fas fa-sign-out-alt mr-2" /> Logout
            </button>
          </div>
        </Collapse>
      </Container>
    </Navbar>
  );
};

SidebarNew.defaultProps = {
  routes: [{}],
};

SidebarNew.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
  user: PropTypes.object,
};

export default SidebarNew;
