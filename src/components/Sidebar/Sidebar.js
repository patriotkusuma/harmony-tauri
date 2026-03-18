/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import Auth from "layouts/Auth";
import axios from "../../services/axios-instance";
import Cookies from "js-cookie";

var ps;

const THEME_KEY = "theme";


const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      return (
        <React.Fragment key={key}>
        {prop.path !== '/login' &&   prop.path !=='/user-profile' && (
          
          <NavItem>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
          <i className={prop.icon} />
          <span className="ml-2">{prop.name}</span>
          </NavLink>
        </NavItem>
          )}
          </React.Fragment>
      );
    });
  };

  const { bgColor, routes, logo, user, token, outlets, isCollapsed, toggleSidebar } = props;

  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  const headers = {
    'Authorization' : `Bearer ${token}`
  }

  const navigate = useNavigate();
  const logout = async() => {
    if(token !== null){
      await axios.post('https://api.harmonylaundry.my.id/user-logout', {headers})
        .then((res)=> {
          localStorage.clear()
          navigate('/auth/login')
         
        })
        .catch((res) => {
          console.log(res)
        })
        Cookies.remove()
        localStorage.clear()
      navigate('/auth/login')

    }
  }

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
      className={`navbar-vertical fixed-left navbar-light bg-white ${isCollapsed ? 'navbar-collapsed' : ''}`}
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggle Sidebar Button for Desktop - Positioned Top Right */}
        <div className="sidebar-toggle-btn d-none d-md-flex" onClick={toggleSidebar}>
          <i className={`fas ${isCollapsed ? 'fa-angle-right' : 'fa-angle-left'}`} />
        </div>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={isCollapsed ? process.env.PUBLIC_URL + "/logoku.svg" : logo.imgSrc}
            />
            {!isCollapsed && (
              <h4 className="mb-0 pb-0 pt-2">
                {/* Text logo or branch name here */}
              </h4>
            )}
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link nav-link text-white"
                onClick={() => setIsDark(!isDark)}
                title={isDark ? "Light Mode" : "Dark Mode"}
                style={{ fontSize: "1.1rem" }}
              >
                <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`} />
              </button>
            </li>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/team-1-800x800.jpg")}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-calendar-grid-58" />
                <span>Activity</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-support-16" />
                <span>Support</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={logout}>
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
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
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
          {/* Form */}
          {user !== null && user.role !== "pegawai" && (
            <Form className="mt-4 mb-3 d-md-none" key={user.id}>
              <InputGroup className="input-group-rounded input-group-merge">
                <Input
                  aria-label="Search"
                  className="form-control-rounded form-control-prepended"
                  placeholder="Search"
                  type="search"
                  />
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <span className="fa fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Form>
          )}
          {/* Main POS Action Card */}
          <Nav navbar className="mt-4 mb-2">
            <NavItem>
              <NavLink to="/pesanan" tag={NavLinkRRD} onClick={closeCollapse} className="nav-link-pos shadow-premium-orange">
                <div className="d-flex align-items-center">
                  <div className="icon-container mr-3">
                    <i className="fas fa-shopping-basket" />
                  </div>
                  <div>
                    <span className="title d-block">Teras Kasir</span>
                    <span className="subtitle">Mulai Antrian Baru</span>
                  </div>
                </div>
              </NavLink>
            </NavItem>
          </Nav>

          {/* Navigation */}
          <h6 className="navbar-heading text-muted">Kasir & Operasional</h6>
          <Nav navbar className="mb-md-3">
            <NavItem>
              <NavLink to="/pembayaran" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-cash-register text-success" />
                <span className="ml-2">Pembayaran Selesai</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/bayar" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-money-check-alt text-blue" />
                <span className="ml-2">Customer Bayar</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/deposit" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-piggy-bank text-red" />
                <span className="ml-2">Saldo / Deposit</span>
              </NavLink>
            </NavItem>
          </Nav>

          <hr className="my-3" />

          {/* Heading */}
          <h6 className="navbar-heading text-muted">Manajemen & Laporan</h6>
          <Nav navbar className="mb-md-3">
            <NavItem>
              <NavLink to="/admin/dashboard" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-tachometer-alt text-primary" />
                <span className="ml-2">Dashboard Utama</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/riwayat" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-history text-info" />
                <span className="ml-2">Riwayat Transaksi</span>
              </NavLink>
            </NavItem>
            {user !== null && (user.role === "admin" || user.role === "owner") && (
              <>
                <NavItem>
                  <NavLink to="/admin/purchases" tag={NavLinkRRD} onClick={closeCollapse}>
                    <i className="fas fa-shopping-basket text-danger" />
                    <span className="ml-2">Belanja Kebutuhan</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/admin/inventory" tag={NavLinkRRD} onClick={closeCollapse}>
                    <i className="fas fa-boxes text-info" />
                    <span className="ml-2">Stok Inventaris</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/admin/employees" tag={NavLinkRRD} onClick={closeCollapse}>
                    <i className="fas fa-users text-primary" />
                    <span className="ml-2">Manajemen Pegawai</span>
                  </NavLink>
                </NavItem>
              </>
            )}
            <NavItem>
              <NavLink to="/admin/order-timeline" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-microchip text-success" />
                <span className="ml-2">Log Mesin Aktif</span>
              </NavLink>
            </NavItem>
          </Nav>

          <hr className="my-3" />

          {/* Heading */}
          <h6 className="navbar-heading text-muted">Pengaturan Sistem</h6>
          <Nav navbar className="mb-md-3">
            <NavItem>
              <NavLink to="/admin/messages" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-comments text-cyan" />
                <span className="ml-2">Broadcast Messages</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/blog" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-newspaper text-primary" />
                <span className="ml-2">Blog & Artikel</span>
              </NavLink>
            </NavItem>
            {user !== null && (user.role === "admin" || user.role === "owner") && (
              <NavItem>
                <NavLink to="/admin/service-revenue" tag={NavLinkRRD} onClick={closeCollapse}>
                  <i className="fas fa-file-invoice-dollar text-success" />
                  <span className="ml-2">Service & Revenue</span>
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <NavLink to="/admin/rfid" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-id-card text-indigo" />
                <span className="ml-2">RFID Attach/Detach</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/rfid-cards" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-credit-card text-purple" />
                <span className="ml-2">RFID Kartu Master</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/whatsapp-payload" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fab fa-whatsapp text-success" />
                <span className="ml-2">WhatsApp Payload</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/admin/notification-setting" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fas fa-bell-slash text-gray" />
                <span className="ml-2">Pengaturan Notifikasi</span>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
  user: PropTypes.object,
};

export default Sidebar;
