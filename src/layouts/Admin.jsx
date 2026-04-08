import React, { useContext, useEffect, useState } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import HarmonyLogo from "assets/img/brand/harmony-blue.png";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar";
import AdminFooter from "components/Footers/AdminFooter";
import Sidebar from "components/Sidebar/SidebarNew";

import routes from "routes";
import axios from "../services/axios-instance";
import DetailPesanan from "views/pages/DetailPesanan";
import Cookies from "js-cookie";
import { Bounce, toast } from "react-toastify";
import Deposit from "views/pages/Deposit";
import { useRawWebSocket } from "services/RawWebSocketContext";
import { useMQTTRFID } from "hooks/useMQTTRFID";

import Message from "views/pages/Message";
import NotificationSetting from "views/pages/NotificationSetting";
import RFIDManage from "views/pages/RFIDManage";

import "assets/css/sidebar-collapse.css";

const Admin = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("sidebar-collapsed", !isCollapsed);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);


  const [authenticated, setAuthenticated] = useState(localStorage.getItem("token")||null);
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (e) {
      return null;
    }
  });
  const [outlets, setOutlets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('outlet')) || null;
    } catch (e) {
      return null;
    }
  });
  const [selectedOutlet, setSelectedOutlet] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("selected-outlet")) || null;
    } catch (e) {
      return null;
    }
  });

  const { reconnect } = useRawWebSocket();

  // Global RFID Navigation Logic
  useMQTTRFID({
    enabled: true,
    onUID: (uid) => {
      const scanned = (uid || "").trim().toUpperCase();
      const storedRfid = localStorage.getItem("active_rfid");
      const userRfid = (auth?.rfid_code || auth?.pegawai?.rfid_code || storedRfid || "").trim().toUpperCase();
      
      console.log(`[RFID-Debug] Scanned: "${scanned}" | Stored: "${userRfid}"`);

      if (!userRfid) {
          // Jika sistem tidak punya referensi RFID user ini
          toast.warning("Akun Anda belum terikat ke RFID. Login ulang melalui RFID dulu.", { position: "top-center" });
          return;
      }

      // 2. Security Check: Harus sama persis
      if (scanned !== userRfid) {
        console.warn(`[RFID-Shortcut] Mismatch: Scanned ${scanned} vs Expected ${userRfid}`);
        // Tampilkan pesan error agar user tahu kenapa tidak pindah
        toast.error(`Akses Ditolak: Kartu ${scanned} bukan milik ${auth?.name || 'Anda'}.`, {
            position: "top-center",
            autoClose: 3000
        });
        return;
      }

      // 3. Cek apakah sudah di halaman kasir atau halaman khusus rfid
      const currentPath = location.pathname;
      const isRfidPage = currentPath.startsWith('/pesanan') || 
                         currentPath.startsWith('/admin/rfid') || 
                         currentPath.startsWith('/admin/rfid-cards') ||
                         currentPath.startsWith('/admin/employees');
      
      if (!isRfidPage) {
        toast.success(`🚀 Menuju Kasir...`, {
          position: "top-center",
          autoClose: 1500
        });
        // Paksa navigasi
        setTimeout(() => {
            navigate('/pesanan', { state: { scannedRFID: scanned } });
        }, 100);
      }
    }
  });

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authenticated}`,
    };
  const navigate = useNavigate();


  // const socket = io("https://jutra.my.id/",{
  //   withCredentials:true,
  //   extraHeaders:{
  //     'my-custom-headers': 'abcd'
  //   },
  //   forceNew: true
  // })




  const checkUser = async () => {
      await axios.get('api/me', {headers})
      .then((res) => {
        setAuth(res.data)
        Cookies.set('user', JSON.stringify(res.data))
        localStorage.setItem('user', JSON.stringify(res.data.user))
        getOutlet()
      })
      .catch((err)=>{
          console.log(err)
          localStorage.removeItem("token");
          navigate('/auth/login');
      })
  }

  const waToast = (msg) => {
    toast.info(`${msg.phone} \n${msg.message}`, {
      transition: Bounce,
      autoClose: 10000,
    })
  }

  const getOutlet = async () => {
    await axios.get('api/outlet/get-outlet', {
      headers
    }).then(res=>{
      console.log(res)
      localStorage.setItem('outlet', JSON.stringify(res.data.outlets))
    })
  }
  useEffect(()=>{
   if(auth === null && authenticated !== null){
    checkUser();
    // getOutlet()
   }
   
   if(outlets === null){
    getOutlet()
   }
    if(authenticated == null){
      navigate('/auth/login')
    }
  },[authenticated, auth, outlets]);

  const selectCabang = async (id) => {
    await axios.post('api/outlet/set-selected-outlet', {
      id_outlet:id
    }, {headers}).then(res => {
      localStorage.setItem('selected-outlet', JSON.stringify(res.data.outlet));
      setSelectedOutlet(res.data.outlet);
      // Force reload to refresh all data and reset states for the new outlet
      window.location.reload();
    })
  }


  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        if (prop.role && auth && !prop.role.includes(auth.role)) {
          return null;
        }
        if (!prop.component) return null; // skip routes handled inline (e.g. NotificationSetting)
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (
        location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        location={location}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: HarmonyLogo,
          imgAlt: "...",
        }}
        token={authenticated}
        user={auth}
        outlets={outlets || null}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={`main-content ${isCollapsed ? 'main-content-collapsed' : ''}`} ref={mainContent}>
        <AdminNavbar
          {...props}
          auth={auth}
          token={authenticated}
          outlets={outlets}
          selectCabang={selectCabang}
          selectedOutlet={selectedOutlet}
          brandText={getBrandText()}
          onToggleMobile={() => setMobileOpen(prev => !prev)}
          mobileOpen={mobileOpen}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="/riwayat/:kodePesan" element={<DetailPesanan />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/pesanan/:kodePesan" element={<Navigate to="/pesanan/:pesanan" replace/>}/>
          <Route path="/deposit" element={<Deposit/>} exact/>
          <Route path="/messages" element={<Message/>} exact/>
          <Route path="/notification-setting" element={<NotificationSetting selectedOutlet={selectedOutlet}/>} exact/>
          <Route path="/rfid" element={<RFIDManage/>} exact/>


        </Routes>
        <Container fluid>
          {/* <AdminFooter /> */}
        </Container>
      </div>
    </>
  );
};

export default Admin;
