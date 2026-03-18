import React, { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import {
  Col,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  InputGroup,
  Media,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  Row,
  UncontrolledDropdown,
} from "reactstrap";

const MySidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const { bgColor, routes, logo } = props;

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
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
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0">
            <img
              alt="Harmony Laundry"
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}

        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-label="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something Else Here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="User Pofile"
                    src={require("../../assets/img/theme/team-1-800x800.jpg")}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-aroow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome !</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse Header */}
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

          <Nav navbar>
            <NavItem>
              <NavLink
                to="/admin/dashboard"
                tag={NavLinkRRD}
                onClick={closeCollapse}
              >
                <i className="ni ni-tv-2 text-primary"></i>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/admin/riwayat"
                tag={NavLinkRRD}
                onClick={closeCollapse}
              >
                <i className="fa-solid fa-clock-rotate-left text-primary"></i>
                Riwayat Pesan
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/admin/order-timeline"
                tag={NavLinkRRD}
                onClick={closeCollapse}
              >
                <i className="fas fa-stream text-primary"></i>
                Log Mesin
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/pesanan" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="fa-solid fa-bag-shopping"></i>
                Pesanan
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/pembayaran"
                tag={NavLinkRRD}
                onClick={closeCollapse}
              >
                <i className="fa-solid fa-cash-register" />
                Pembayaran
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default MySidebar;
