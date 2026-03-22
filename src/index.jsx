/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AuthLayout from "layouts/Auth";
import Dashboard from "views/pages/Dashboard";
import Admin from "layouts/Admin";
import Order from "layouts/Order";
import Pesan from "views/pages/Pesan";
import DetailPesanan from "views/pages/DetailPesanan";
import Pembayaran from "views/pages/Pembayaran";
import Login from "views/pages/Login";
import Deposit from "views/pages/Deposit";
import Message from "views/pages/Message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MQTTRFIDProvider } from "hooks/useMQTTRFID";
import FloatingRFIDStatus from "components/FloatingRFIDStatus";
import { ToastContainer } from "react-toastify";
import "assets/css/custom-ui.css";
import "react-toastify/dist/ReactToastify.css";
import { isElectronRuntime } from "services/runtime";
import { RawWebSocketProvider } from "services/RawWebSocketContext";

// Electron package dibuka via file://, jadi pakai HashRouter agar routing tidak gagal.
const Router = isElectronRuntime() ? HashRouter : BrowserRouter;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 menit fresh
      gcTime: 10 * 60 * 1000,       // gctime menggantikan cacheTime di v5
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
    <MQTTRFIDProvider>
      <RawWebSocketProvider>
        <Router>
          <FloatingRFIDStatus />
          <ToastContainer closeButton={true} />
          <Routes>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="/pesanan" element={<Pesan/>}/>
            <Route path="/pembayaran" element={<Pembayaran/>}/>

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Router>
      </RawWebSocketProvider>
    </MQTTRFIDProvider>
  </QueryClientProvider>
);
