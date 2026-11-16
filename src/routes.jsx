/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creativetimofficial/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { lazy } from "react";
import Profile from "views/examples/Profile";
import Login from "views/pages/Login";

// Halaman berat di-lazy-load agar bundle awal kasir tetap ringan.
const Dashboard = lazy(() => import("views/pages/Dashboard"));
const RiwayatPesan = lazy(() => import("views/pages/RiwayatPesan").then(m => ({ default: m.RiwayatPesan })));
const Pesan = lazy(() => import("views/pages/Pesan"));
const DetailPesanan = lazy(() => import("views/pages/DetailPesanan"));
const Pembayaran = lazy(() => import("views/pages/Pembayaran"));
const Bayar = lazy(() => import("views/pages/Bayar"));
const Deposit = lazy(() => import("views/pages/Deposit"));
const Message = lazy(() => import("views/pages/Message"));
const OrderLogTimelinePage = lazy(() => import("views/pages/OrderLogTimelinePage"));
const RFIDManage = lazy(() => import("views/pages/RFIDManage"));
const RFIDCardManagement = lazy(() => import("views/pages/RFIDCardManagement"));
const BlogManagement = lazy(() => import("views/pages/BlogManagement"));
const EmployeeManagement = lazy(() => import("views/pages/EmployeeManagement"));
const ServiceRevenueManagement = lazy(() => import("views/pages/ServiceRevenueManagement"));
const PurchaseManagement = lazy(() => import("views/pages/PurchaseManagement"));
const InventoryManagement = lazy(() => import("views/pages/InventoryManagement"));
const WhatsAppPayloadSettings = lazy(() => import("views/pages/WhatsAppPayloadSettings"));
const OperationalReport = lazy(() => import("views/pages/OperationalReport"));
const AccountingReport = lazy(() => import("views/pages/AccountingReport"));
const AffiliateManagement = lazy(() => import("views/pages/AffiliateManagement"));
const SupplierManagement = lazy(() => import("views/pages/SupplierManagement"));
const CustomerManagement = lazy(() => import("views/pages/CustomerManagement"));
const CustomerInsightDemo = lazy(() => import("views/pages/CustomerInsightDemo"));
const SystemSettings = lazy(() => import("views/pages/SystemSettings"));
const AiChat = lazy(() => import("views/pages/AiChat"));
const WebhookLogs = lazy(() => import("views/pages/WebhookLogs"));
const IoTDeviceManagement = lazy(() => import("views/pages/IoTDeviceManagement"));
const KostManagement = lazy(() => import("views/pages/KostManagement"));
const CompetitorLaundry = lazy(() => import("views/pages/CompetitorLaundry"));
const ActivityLogs = lazy(() => import("views/pages/ActivityLogs"));
const BillingManagement = lazy(() => import("views/pages/BillingManagement"));
const CashierAudit = lazy(() => import("views/pages/CashierAudit"));

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
    component: RiwayatPesan,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/bills",
    name: "Tagihan (Billing)",
    icon: "fas fa-file-invoice text-indigo",
    component: BillingManagement,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/bayar",
    name: "Customer Bayar",
    icon: "fas fa-money-check-alt text-blue",
    component: Bayar,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/deposit",
    name: "Saldo / Deposit",
    icon: "fas fa-piggy-bank text-red",
    component: Deposit,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/cashier-audit",
    name: "Audit & Laci Kasir",
    icon: "fas fa-cash-register text-warning",
    component: CashierAudit,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/messages",
    name: "Customer Chat",
    icon: "fab fa-whatsapp text-success",
    component: Message,
    layout: "/admin",
    sidebarGroup: "operasional",
  },
  {
    path: "/rfid",
    name: "RFID Attach/Detach",
    icon: "fas fa-id-card text-info",
    component: RFIDManage,
    layout: "/admin",
    sidebarGroup: "operasional",
  },

  // ── Manajemen & Laporan ──────────────────────────────────────────
  {
    path: "/dashboard",
    name: "Dashboard Utama",
    icon: "fas fa-tachometer-alt text-primary",
    component: Dashboard,
    layout: "/admin",
    sidebarGroup: "manajemen",
  },
  {
    path: "/ai-chat",
    name: "AI Assistant",
    icon: "fas fa-robot text-purple",
    component: AiChat,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/customers",
    name: "Manajemen Pelanggan",
    icon: "fas fa-users text-primary",
    component: CustomerManagement,
    layout: "/admin",
    sidebarGroup: "manajemen",
  },
  {
    // Halaman preview UI — sengaja tanpa sidebarGroup agar tersembunyi dari menu.
    // Hapus route + views/pages/CustomerInsightDemo.jsx setelah backend siap.
    path: "/customer-insight-demo",
    name: "Preview Insight Customer",
    icon: "fas fa-flask text-primary",
    component: CustomerInsightDemo,
    layout: "/admin",
  },
  {
    path: "/operational-report",
    name: "Laporan Operasional",
    icon: "fas fa-chart-line text-info",
    component: OperationalReport,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/accounting-report",
    name: "Laporan Akuntansi",
    icon: "fas fa-file-invoice-dollar text-emerald",
    component: AccountingReport,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/suppliers",
    name: "Supplier & Vendor",
    icon: "fas fa-truck-loading text-yellow",
    component: SupplierManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/purchases",
    name: "Belanja Kebutuhan",
    icon: "fas fa-shopping-basket text-danger",
    component: PurchaseManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/inventory",
    name: "Stok Inventaris",
    icon: "fas fa-boxes text-info",
    component: InventoryManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/employees",
    name: "Manajemen Pegawai",
    icon: "fas fa-users text-primary",
    component: EmployeeManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/kost-management",
    name: "Manajemen Kost",
    icon: "fas fa-building text-teal",
    component: KostManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/competitor-laundry",
    name: "Kompetitor Laundry",
    icon: "fas fa-store-alt text-orange",
    component: CompetitorLaundry,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/affiliates",
    name: "Afiliasi & Partner",
    icon: "fas fa-handshake text-purple",
    component: AffiliateManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "manajemen",
  },
  {
    path: "/order-timeline",
    name: "Log Mesin Aktif",
    icon: "fas fa-microchip text-success",
    component: OrderLogTimelinePage,
    layout: "/admin",
    sidebarGroup: "manajemen",
  },
  {
    path: "/activities",
    name: "Log Aktivitas",
    icon: "fas fa-stream text-primary",
    component: ActivityLogs,
    layout: "/admin",
    sidebarGroup: "manajemen",
    role: ["admin", "owner"],
  },

  // ── Pengaturan Sistem ────────────────────────────────────────────
  {
    path: "/blog",
    name: "Blog & Artikel",
    icon: "fas fa-newspaper text-primary",
    component: BlogManagement,
    layout: "/admin",
    sidebarGroup: "settings",
  },
  {
    path: "/service-revenue",
    name: "Service & Revenue",
    icon: "fas fa-file-invoice-dollar text-success",
    component: ServiceRevenueManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },
  {
    path: "/whatsapp-payload",
    name: "WhatsApp Payload",
    icon: "fab fa-whatsapp text-success",
    component: WhatsAppPayloadSettings,
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
    component: WebhookLogs,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },
  {
    path: "/rfid-cards",
    name: "RFID Kartu Master",
    icon: "fas fa-credit-card text-purple",
    component: RFIDCardManagement,
    layout: "/admin",
    sidebarGroup: "settings",
  },
  {
    path: "/iot-management",
    name: "IoT & Device",
    icon: "fas fa-robot text-primary",
    component: IoTDeviceManagement,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },
  {
    path: "/system-settings",
    name: "Konfigurasi Inti",
    icon: "fas fa-cogs text-blue",
    component: SystemSettings,
    layout: "/admin",
    role: ["admin", "owner"],
    sidebarGroup: "settings",
  },

  // ── Tersembunyi dari sidebar (tanpa sidebarGroup) ────────────────
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "fas fa-user-circle text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
];
export default routes;
export {
  Pesan,
  DetailPesanan,
};
