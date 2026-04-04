import React, { useEffect, useState } from "react";
import axios from "../../services/axios-instance";
import { Link, useNavigate } from "react-router-dom";
import Team4Logo from "assets/img/theme/team-4-800x800.jpg";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
} from "reactstrap";
import Cookies from "js-cookie";
import { useRawWebSocket } from "../../services/RawWebSocketContext";

const THEME_KEY = "theme";


const AdminNavbar = (props) => {
  const {auth, token, outlets, selectCabang, selectedOutlet, onToggleMobile, mobileOpen} = props
  const { unreadCount, wsConnected, markAsRead, notifications, clearNotifications } = useRawWebSocket();
  const headers = {
    'Authorization' : `Bearer ${token}`
  }

  const navigate = useNavigate();
  
  const handleLogout = async(e) => {
    e.preventDefault();
    if(token !== null){
      try {
        await axios.post('https://api.harmonylaundry.my.id/user-logout', {}, {headers});
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        localStorage.clear();
        Cookies.remove();
        navigate('/auth/login');
      }
    } else {
      localStorage.clear();
      navigate('/auth/login');
    }
  }

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [isLowContrast, setIsLowContrast] = useState(
    localStorage.getItem("contrast") === "low"
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

  useEffect(() => {
    if (isLowContrast) {
      document.body.classList.add("low-contrast");
      localStorage.setItem("contrast", "low");
    } else {
      document.body.classList.remove("low-contrast");
      localStorage.setItem("contrast", "normal");
    }
  }, [isLowContrast]);


  return (
    <>
      <Navbar className="navbar-top navbar-dark border-bottom-0" expand="md" id="navbar-main" style={{ minHeight: '80px' }}>
        <Container fluid className="d-flex align-items-center justify-content-between">
          {/* Hamburger toggle - mobile only (hidden on desktop since sidebar is always visible) */}
          <button
            type="button"
            className="d-md-none btn btn-link text-white p-2 me-1"
            onClick={onToggleMobile}
            aria-label="Buka / tutup menu"
            style={{ fontSize: '1.3rem', lineHeight: 1 }}
          >
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>

          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block font-weight-700"
            to="/"
          >
            {props.brandText}
          </Link>
          
          <div className="d-flex align-items-center">
            {/* Cabang/Outlet Selection - Simple & Clean */}
            { auth !== null && auth.role !== "pegawai" && (  
              <div className="me-3">
                <UncontrolledDropdown nav>
                  <DropdownToggle nav className="nav-link-icon py-0 px-0">
                    <div className="d-flex align-items-center px-3 py-2 rounded bg-white-10 transition-all">
                      <i className="ni ni-shop me-2 text-warning" />
                      <span className="text-white text-sm font-weight-bold d-none d-lg-block">
                        {selectedOutlet?.nama || 'Pilih Cabang'}
                        {selectedOutlet?.is_demo && (
                          <span className="badge badge-pill badge-info ms-2 py-1 px-2" style={{ fontSize: '0.5rem', background: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>DEMO</span>
                        )}
                      </span>
                      <i className="fas fa-search ms-2 text-white opacity-5" style={{ fontSize: '0.7rem' }} />
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow mt-3 border-0 shadow-lg" end style={{ minWidth: '220px', borderRadius: '8px' }}>
                    <DropdownItem className="noti-title bg-secondary" header tag="div">
                      <h6 className="text-overflow m-0 text-muted small text-uppercase font-weight-bold">Daftar Cabang</h6>
                    </DropdownItem>
                    {outlets !== null && outlets.map((olt, index) => (
                      <DropdownItem 
                        key={index} 
                        onClick={() => selectCabang(olt.id)}
                        className="py-2"
                        style={{
                          backgroundColor: olt.id === selectedOutlet?.id ? 'rgba(94, 114, 228, 0.1)' : 'transparent',
                        }}
                      >
                        <i className={`ni ni-shop me-2 ${olt.id === selectedOutlet?.id ? 'text-primary' : 'text-muted'}`} />
                        <span className={olt.id === selectedOutlet?.id ? 'text-primary font-weight-bold' : ''}>
                          {olt.nama}
                        </span>
                        {olt.is_demo && (
                          <span className="badge badge-pill badge-info ms-2 py-1 px-2" style={{ fontSize: '0.6rem', background: 'rgba(17, 201, 240, 0.2)', color: '#11cdef' }}>DEMO</span>
                        )}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            )}

            {/* Utility Buttons */}
            <div className="d-flex align-items-center me-3">
              <button
                type="button"
                className="btn btn-link text-white opacity-8 p-2"
                onClick={() => setIsLowContrast(!isLowContrast)}
              >
                <i className="fas fa-adjust" />
              </button>
              <button
                type="button"
                className="btn btn-link text-white opacity-8 p-2"
                onClick={() => setIsDark(!isDark)}
              >
                <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`} />
              </button>
            </div>

            {/* WhatsApp Notifications */}
            <div className="me-3">
              <UncontrolledDropdown nav>
                <DropdownToggle nav className="nav-link-icon p-2" onClick={markAsRead}>
                  <div className="position-relative">
                    <i className="ni ni-bell-55 text-white opacity-9" style={{ fontSize: '1.2rem' }} />
                    {unreadCount > 0 && (
                      <span className="badge badge-danger position-absolute" style={{ top: '-4px', right: '-4px', borderRadius: '50%', padding: '2px 5px', fontSize: '0.6rem' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow mt-3 border-0 shadow-lg" end style={{ width: '300px', maxWidth: '90vw', borderRadius: '12px', padding: '0', overflow: 'hidden' }}>
                  <DropdownItem className="noti-title bg-secondary py-3 px-3 d-flex align-items-center justify-content-between" header tag="div">
                    <h6 className="text-overflow m-0 text-muted small text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Notifikasi Pesan</h6>
                    {notifications.length > 0 && (
                      <button 
                        className="btn btn-link p-0 text-danger text-xs font-weight-bold border-0" 
                        onClick={clearNotifications}
                        style={{ background: 'transparent' }}
                      >
                        Hapus Semua
                      </button>
                    )}
                  </DropdownItem>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <DropdownItem key={idx} to="/admin/messages" tag={Link} className="py-2 px-3 border-bottom border-light">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', flexShrink: 0, boxShadow: '0 4px 10px rgba(45, 206, 137, 0.3)' }}>
                              <i className="fab fa-whatsapp text-white" style={{ fontSize: '0.9rem' }} />
                            </div>
                            <div className="notif-item-content">
                              <div className="notif-title-text text-dark font-weight-bold" style={{ fontSize: '0.8rem' }}>
                                {notif.from_name || notif.from?.split('@')[0]}
                              </div>
                              <div className="notif-body-text">
                                {notif.body || 'Pesan gambar/file'}
                              </div>
                            </div>
                          </div>
                        </DropdownItem>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                          <i className="ni ni-bell-55 text-muted opacity-3" style={{ fontSize: '1.5rem' }} />
                        </div>
                        <p className="mb-0 text-muted small px-4" style={{ fontSize: '0.75rem' }}>Hening... Tidak ada notifikasi baru untuk hari ini.</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                     <DropdownItem to="/admin/messages" tag={Link} className="text-center text-primary text-xs font-weight-bold py-3 bg-light border-0">
                        Ke Pusat Pesan <i className="fas fa-arrow-right ms-1" />
                     </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            {/* Profile Menu */}
            <Nav className="align-items-center" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pe-0 py-0" nav>
                  <div className="d-flex align-items-center">
                    <div className="text-end me-3 d-none d-lg-block">
                        <span className="mb-0 text-white font-weight-700 small d-block">
                          {auth != null ? auth.name : "Manager"}
                        </span>
                        <small className="text-white opacity-8 text-uppercase" style={{ fontSize: '0.6rem' }}>
                          Online
                        </small>
                    </div>
                    <span className="avatar avatar-sm rounded-circle shadow-sm border border-2 border-white">
                      <img
                        alt="..."
                        src={Team4Logo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </span>
                  </div>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow mt-3 border-0 shadow-lg" end style={{ borderRadius: '8px', minWidth: '200px' }}>
                  <DropdownItem className="noti-title bg-secondary" header tag="div">
                    <h6 className="text-overflow m-0 text-muted small text-uppercase font-weight-bold">Pilihan Akun</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02 text-primary me-2" />
                    <span>Profil</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={(e) => handleLogout(e)} className="text-danger font-weight-bold">
                    <i className="ni ni-user-run me-2" />
                    <span>Keluar</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>

      <style>{`
        .bg-white-10 { background: rgba(255, 255, 255, 0.1) !important; }
        .font-weight-700 { font-weight: 700 !important; }
        .transition-all { transition: all 0.2s ease; }
        .text-xs { font-size: 0.75rem !important; }
      `}</style>
    </>
  );
};

export default AdminNavbar;
