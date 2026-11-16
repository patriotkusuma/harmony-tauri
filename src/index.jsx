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
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AuthLayout from "layouts/Auth";
import Admin from "layouts/Admin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MQTTRFIDProvider } from "hooks/useMQTTRFID";
import FloatingRFIDStatus from "components/FloatingRFIDStatus";
import { ToastContainer } from "react-toastify";
import "assets/css/custom-ui.css";
import "react-toastify/dist/ReactToastify.css";
import { isElectronRuntime } from "services/runtime";
import { RawWebSocketProvider } from "services/RawWebSocketContext";

// Halaman kasir dimuat saat rutenya dibuka, bukan di bundle awal.
const Pesan = lazy(() => import("views/pages/Pesan"));
const Pembayaran = lazy(() => import("views/pages/Pembayaran"));

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
            <Route path="/pesanan" element={<Suspense fallback={<div className="route-loading">Memuat…</div>}><Pesan/></Suspense>}/>
            <Route path="/pembayaran" element={<Suspense fallback={<div className="route-loading">Memuat…</div>}><Pembayaran/></Suspense>}/>

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Router>
      </RawWebSocketProvider>
    </MQTTRFIDProvider>
  </QueryClientProvider>
);
