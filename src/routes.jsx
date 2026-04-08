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
import AccountingReport from "views/pages/AccountingReport";
import AffiliateManagement from "views/pages/AffiliateManagement";
import SupplierManagement from "views/pages/SupplierManagement";
import CustomerManagement from "views/pages/CustomerManagement";
import SystemSettings from "views/pages/SystemSettings";
import AiChat from "views/pages/AiChat";
import WebhookLogs from "views/pages/WebhookLogs";
import IoTDeviceManagement from "views/pages/IoTDeviceManagement";
import KostManagement from "views/pages/KostManagement";
import CompetitorLaundry from "views/pages/CompetitorLaundry";
import ActivityLogs from "views/pages/ActivityLogs";
import BillingManagement from "views/pages/BillingManagement";

/**
 * sidebarGroup — menentukan di section mana menu ini muncul di SidebarNew:
 *   "operasional" → Kasir & Operasional
 *   "manajemen"   → Manajemen & Laporan
 *   "settings"    → Pengaturan Sistem
 *   (tidak ada)   → tersembunyi dari sidebar
 *
 * role — jika diisi, hanya role tersebut yang dapat melihat menu ini.
 */
var routes = [
  // ── Kasir & Operasional ──────────────────────────────────────────
  {
    path: "/riwayat",
    name: "Riwayat Transaksi",
    icon: "fas fa-history text-info",
    component: <RiwayatPesan/>,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/bills",
    name: "Tagihan (Billing)",
    icon: "fas fa-file-invoice text-indigo",
    component: <BillingManagement />,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/bayar",
    name: "Customer Bayar",
    icon: "fas fa-money-check-alt text-blue",
    component: <Bayar/>,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/deposit",
    name: "Saldo / Deposit",
    icon: "fas fa-piggy-bank text-red",
    component: <Deposit />,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/messages",
    name: "Customer Chat",
    icon: "fab fa-whatsapp text-success",
    component: <Message />,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/rfid",
    name: "RFID Attach/Detach",
    icon: "fas fa-id-card text-info",
    component: <RFIDManage />,
    layout: "/admin",
    sidebarGroup: "operasional",
  },

  // ── Manajemen & Laporan ──────────────────────────────────────────
  {
    path: "/dashboard",
    name: "Dashboard Utama",
    icon: "fas fa-tachometer-alt text-primary",
    component: <Dashboard />,
    layout: "/admin",
    sidebarGroup: "manajemen",
  },
  {
    path: "/ai-chat",
    name: "AI Assistant",
    icon: "fas fa-robot text-purple",
    component: <AiChat />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/customers",
    name: "Manajemen Pelanggan",
    icon: "fas fa-users text-primary",
    component: <CustomerManagement />,
    layout: "/admin",
    sidebarGroup: "manajemen",
  },
  {
    path: "/operational-report",
    name: "Laporan Operasional",
    icon: "fas fa-chart-line text-info",
    component: <OperationalReport />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/accounting-report",
    name: "Laporan Akuntansi",
    icon: "fas fa-file-invoice-dollar text-emerald",
    component: <AccountingReport />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/suppliers",
    name: "Supplier & Vendor",
    icon: "fas fa-truck-loading text-yellow",
    component: <SupplierManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/purchases",
    name: "Belanja Kebutuhan",
    icon: "fas fa-shopping-basket text-danger",
    component: <PurchaseManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/inventory",
    name: "Stok Inventaris",
    icon: "fas fa-boxes text-info",
    component: <InventoryManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/employees",
    name: "Manajemen Pegawai",
    icon: "fas fa-users text-primary",
    component: <EmployeeManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/kost-management",
    name: "Manajemen Kost",
    icon: "fas fa-building text-teal",
    component: <KostManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/competitor-laundry",
    name: "Kompetitor Laundry",
    icon: "fas fa-store-alt text-orange",
    component: <CompetitorLaundry />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/affiliates",
    name: "Afiliasi & Partner",
    icon: "fas fa-handshake text-purple",
    component: <AffiliateManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/order-timeline",
    name: "Log Mesin Aktif",
    icon: "fas fa-microchip text-success",
    component: <OrderLogTimelinePage />,
    layout: "/admin",
    sidebarGroup: "manajemen",
  },
  {
    path: "/activities",
    name: "Log Aktivitas",
    icon: "fas fa-stream text-primary",
    component: <ActivityLogs />,
    layout: "/admin",
    sidebarGroup: "manajemen",
    role: ["admin", "owner"],
  },

  // ── Pengaturan Sistem ────────────────────────────────────────────
  {
    path: "/blog",
    name: "Blog & Artikel",
    icon: "fas fa-newspaper text-primary",
    component: <BlogManagement />,
    layout: "/admin",
    sidebarGroup: "settings",
  },
  {
    path: "/service-revenue",
    name: "Service & Revenue",
    icon: "fas fa-file-invoice-dollar text-success",
    component: <ServiceRevenueManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },
  {
    path: "/whatsapp-payload",
    name: "WhatsApp Payload",
    icon: "fab fa-whatsapp text-success",
    component: <WhatsAppPayloadSettings />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },
  {
    path: "/notification-setting",
    name: "Pengaturan Notifikasi",
    icon: "fas fa-bell text-warning",
    component: null,
    layout: "/admin",
    sidebarGroup: "settings",
  },
  {
    path: "/webhook-logs",
    name: "Webhook Logs",
    icon: "fas fa-plug text-danger",
    component: <WebhookLogs />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },
  {
    path: "/rfid-cards",
    name: "RFID Kartu Master",
    icon: "fas fa-credit-card text-purple",
    component: <RFIDCardManagement />,
    layout: "/admin",
    sidebarGroup: "settings",
  },
  {
    path: "/iot-management",
    name: "IoT & Device",
    icon: "fas fa-robot text-primary",
    component: <IoTDeviceManagement />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },
  {
    path: "/system-settings",
    name: "Konfigurasi Inti",
    icon: "fas fa-cogs text-blue",
    component: <SystemSettings />,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },

  // ── Tersembunyi dari sidebar (tanpa sidebarGroup) ────────────────
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "fas fa-user-circle text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
];
export default routes;
