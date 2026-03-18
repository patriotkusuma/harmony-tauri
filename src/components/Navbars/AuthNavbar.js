import { useEffect, useState } from "react";
import { Link, json } from "react-router-dom";
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
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/harmony-blue.png")}
            />
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/">
                    <img
                      alt="..."
                      src={require("../../assets/img/brand/argon-react.png")}
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
                

              {user !== null && (
                <>
                <NavItem>
                  <NavLink className="nav-link-icon" to="/" tag={Link}>
                    <i className="ni ni-planet" />
                    <span className="nav-link-inner--text">Dashboard</span>
                  </NavLink>
                </NavItem>
                <NavItem >
                    <NavLink className='nav-link-icon' to="/pesanan" tag={Link}>
                        {/* <i className='ni ni-planet'/> */}
                        <i class="fa-solid fa-bag-shopping"></i>

                        <span className="nav-link-inner--text">Pesanan</span>
                    </NavLink>
                </NavItem>
                <NavItem >
                    <NavLink className='nav-link-icon' to="/pembayaran" tag={Link}>
                        {/* <i className='ni ni-planet'/> */}
                        <i class="fa-solid fa-cash-register"></i>

                        <span className="nav-link-inner--text">Pembayaran</span>
                    </NavLink>
                </NavItem>
              <NavItem>
              <NavLink
                className="nav-link-icon"
                to="/admin/user-profile"
                tag={Link}
              >
                <i className="ni ni-single-02" />
                <span className="nav-link-inner--text">Profile</span>
              </NavLink>
              </NavItem>
                </>


            )}

              {user == null && (
                <>

              <NavItem>
                <NavLink className="nav-link-icon" to="/login" tag={Link}>
                  <i className="ni ni-key-25" />
                  <span className="nav-link-inner--text">Login</span>
                </NavLink>
              </NavItem>
                  </>
              )}

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
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
