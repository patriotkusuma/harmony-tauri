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
import Index from "views/Index";
import Profile from "views/examples/Profile";
import Maps from "views/examples/Maps";
import Login from "views/pages/Login";
import Icons from "views/examples/Icons";
import Dashboard from "views/pages/Dashboard";
import { RiwayatPesan } from "views/pages/RiwayatPesan";
import Order from "layouts/Order";
import Pesan from "views/pages/Pesan";
import DetailPesanan from "views/pages/DetailPesanan";
import Pembayaran from "views/pages/Pembayaran";
import Bayar from "views/pages/Bayar";
import Deposit from "views/pages/Deposit";
import Message from "views/pages/Message";
import NotificationSetting from "views/pages/NotificationSetting";
import OrderLogTimelinePage from "views/pages/OrderLogTimelinePage";
import RFIDManage from "views/pages/RFIDManage";
import RFIDCardManagement from "views/pages/RFIDCardManagement";
import BlogManagement from "views/pages/BlogManagement";
import EmployeeManagement from "views/pages/EmployeeManagement";
import ServiceRevenueManagement from "views/pages/ServiceRevenueManagement";
import PurchaseManagement from "views/pages/PurchaseManagement";
import InventoryManagement from "views/pages/InventoryManagement";
import WhatsAppPayloadSettings from "views/pages/WhatsAppPayloadSettings";
import OperationalReport from "views/pages/OperationalReport";
import AffiliateManagement from "views/pages/AffiliateManagement";
import SupplierManagement from "views/pages/SupplierManagement";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fas fa-tachometer-alt text-primary",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/operational-report",
    name: "Laporan Operasional",
    icon: "fas fa-chart-line text-info",
    component: <OperationalReport />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/affiliates",
    name: "Afiliasi & Partner",
    icon: "fas fa-handshake text-purple",
    component: <AffiliateManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/employees",
    name: "Manajemen Pegawai",
    icon: "fas fa-users text-primary",
    component: <EmployeeManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/riwayat",
    name: "Riwayat Pesan",
    icon: "fas fa-history text-info",
    component: <RiwayatPesan/>,
    layout: "/admin"
  },
  {
    path: "/order-timeline",
    name: "Log Mesin",
    icon: "fas fa-microchip text-success",
    component: <OrderLogTimelinePage />,
    layout: "/admin",
  },
  {
    path: "/rfid",
    name: "RFID Attach/Detach",
    icon: "fas fa-id-card text-info",
    component: <RFIDManage />,
    layout: "/admin",
  },
  {
    path: "/rfid-cards",
    name: "RFID Kartu Master",
    icon: "fas fa-credit-card text-purple",
    component: <RFIDCardManagement />,
    layout: "/admin",
  },
  {
    path: "/blog",
    name: "Blog / Artikel",
    icon: "fas fa-newspaper text-primary",
    component: <BlogManagement />,
    layout: "/admin",
  },
  {
    path: "/service-revenue",
    name: "Service & Revenue",
    icon: "fas fa-file-invoice-dollar text-success",
    component: <ServiceRevenueManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/purchases",
    name: "Belanja Kebutuhan",
    icon: "fas fa-shopping-basket text-danger",
    component: <PurchaseManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/inventory",
    name: "Stok Inventaris",
    icon: "fas fa-boxes text-info",
    component: <InventoryManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/whatsapp-payload",
    name: "WhatsApp Payload Settings",
    icon: "fab fa-whatsapp text-success",
    component: <WhatsAppPayloadSettings />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/suppliers",
    name: "Supplier & Vendor",
    icon: "fas fa-truck-loading text-yellow",
    component: <SupplierManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "fas fa-user-circle text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/bayar",
    name:"Customer Bayar",
    icon: "fas fa-money-check-alt text-blue",
    component:  <Bayar/>,
    layout: "/admin",
  },
  {
    path: "/deposit",
    name: "Saldo / Deposit",
    icon: "fas fa-piggy-bank text-red",
    component: <Deposit />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  }
];
export default routes;
