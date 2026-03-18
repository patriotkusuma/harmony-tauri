import { useEffect, useState } from "react";
import axios from "../../services/axios-instance";
import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import Cookies from "js-cookie";
import { useRawWebSocket } from "../../services/RawWebSocketContext";

const THEME_KEY = "theme";


const AdminNavbar = (props) => {
  // const [token, setToken] = useState(localStorage.getItem('token')||null)

  // const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const {auth, token, outlets, selectCabang, selectedOutlet} = props
  const { unreadCount, wsConnected, markAsRead, notifications, clearNotifications } = useRawWebSocket();
  const headers = {
    'Authorization' : `Bearer ${token}`
  }

  console.log(outlets)
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


  // const selectCabang = async (id) => {
  //   await axios.post('/outlet', {
  //     id:id
  //   }, {headers}).then(res => {
  //     localStorage.setItem('outlet', JSON.stringify(res.data.data))
  //     window.location.reload()
  //   })
  // }
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          { auth !== null && auth.role !== "pegawai" && (  
            <Nav className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle nav className="nav-link-icon" style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '30px',
                  padding: '8px 20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="ni ni-shop mr-2" style={{ color: '#ffd600' }} />
                  <span className="text-white text-sm font-weight-bold" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedOutlet?.nama || 'Pilih Cabang'}
                  </span>
                  <i className="fas fa-chevron-down ml-2 text-white" style={{ fontSize: '0.7rem', opacity: 0.7 }} />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right style={{ minWidth: '220px', borderRadius: '12px' }}>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Pilih Cabang</h6>
                  </DropdownItem>
                  {outlets !== null && outlets.map((olt, index) => (
                    <DropdownItem 
                      key={index} 
                      onClick={() => selectCabang(olt.id)}
                      className="py-2 d-flex align-items-center"
                      style={{
                        backgroundColor: olt.id === selectedOutlet?.id ? 'rgba(94, 114, 228, 0.1)' : 'transparent',
                        borderRadius: '8px',
                        margin: '2px 8px'
                      }}
                    >
                      <i className={`ni ni-shop mr-3 ${olt.id === selectedOutlet?.id ? 'text-primary' : 'text-muted'}`} />
                      <span className={`flex-grow-1 ${olt.id === selectedOutlet?.id ? 'font-weight-bold text-primary' : ''}`}>
                        {olt.nama}
                      </span>
                      {olt.id === selectedOutlet?.id && (
                        <i className="fas fa-check text-primary ml-2" style={{ fontSize: '0.8rem' }} />
                      )}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          )}

          <Nav className="align-items-center d-none d-md-flex" navbar>
          <li className="nav-item">
            <button
              type="button"
              className="btn btn-link nav-link"
              onClick={() => setIsLowContrast(!isLowContrast)}
              title={isLowContrast ? "Kontras Normal" : "Kontras Rendah (Monitor Lama)"}
              style={{
                fontSize: "0.95rem",
                color: isLowContrast ? "#ffd600" : "rgba(255,255,255,0.6)",
                transition: "color 0.2s"
              }}
            >
              <i className="fas fa-adjust" />
            </button>
          </li>
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
          {/* WebSocket Notification Icon */}
          <li className="nav-item">
            <UncontrolledDropdown nav>
              <DropdownToggle nav className="nav-link-icon pr-0" onClick={markAsRead}>
                <div style={{ position: 'relative' }}>
                   <i className="ni ni-bell-55 text-white" style={{ fontSize: '1.2rem' }} />
                   {unreadCount > 0 && (
                     <span className="badge badge-danger" style={{ 
                       position: 'absolute', 
                       top: '-8px', 
                       right: '-8px', 
                       fontSize: '0.65rem',
                       padding: '2px 5px',
                       borderRadius: '50%'
                     }}>
                       {unreadCount > 9 ? '9+' : unreadCount}
                     </span>
                   )}
                   <div style={{ 
                     position: 'absolute', 
                     bottom: '-2px', 
                     right: '-2px', 
                     width: '8px', 
                     height: '8px', 
                     borderRadius: '50%', 
                     backgroundColor: wsConnected ? '#2dce89' : '#f5365c',
                     border: '1px solid white'
                   }}></div>
                </div>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right style={{ minWidth: '320px', maxHeight: '450px', overflowY: 'auto' }}>
                <DropdownItem className="noti-title d-flex justify-content-between align-items-center" header tag="div">
                  <h6 className="text-overflow m-0">Notifikasi Pesan</h6>
                  {notifications.length > 0 && (
                    <span 
                      style={{ cursor: 'pointer', fontSize: '0.7rem', color: '#f5365c' }} 
                      onClick={(e) => { e.stopPropagation(); clearNotifications(); }}
                    >
                      Hapus Semua
                    </span>
                  )}
                </DropdownItem>
                
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <DropdownItem 
                      key={idx} 
                      to={{
                        pathname: "/admin/messages",
                        state: { phone: notif.from?.split('@')[0] }
                      }} 
                      tag={Link}
                      className="py-3"
                      style={{ borderBottom: '1px solid #f1f3f9' }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="mr-3">
                          <div className="avatar avatar-sm rounded-circle bg-info">
                            <i className="fab fa-whatsapp text-white" />
                          </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 text-sm" style={{ 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              maxWidth: '120px'
                            }}>
                              {notif.from_name || notif.from?.split('@')[0]}
                            </h6>
                            <small className="text-muted" style={{ fontSize: '0.65rem' }}>
                              {new Date(notif.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </div>
                          <p className="mb-0 text-muted" style={{ 
                            fontSize: '0.75rem', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}>
                            {notif.body || 'File/Gambar...'}
                          </p>
                        </div>
                      </div>
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem className="text-center py-4">
                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>Tidak ada pesan baru.</p>
                  </DropdownItem>
                )}
                
                {notifications.length > 0 && (
                  <DropdownItem to="/admin/messages" tag={Link} className="text-center text-primary font-weight-bold py-2" style={{ fontSize: '0.8rem' }}>
                    Lihat Semua Chat
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </li>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {auth != null ? auth.name : "Jessica Jones"}
                    </span>
                  </Media>
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
                <DropdownItem divider />
                <DropdownItem  onClick={logout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
