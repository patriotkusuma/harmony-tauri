import React, { useEffect, useState } from "react";
import { Card, CardBody, Row, Col, Container } from "reactstrap";
import axios from "../../services/axios-instance";
import { toast } from "react-toastify";

// Atomic Design Components
import NotifHeader from "../../components/organisms/notif/NotifHeader";
import NotifSettingsTemplate from "../../components/templates/notif/NotifSettingsTemplate";
import GeneralSettings from "../../components/organisms/notif/GeneralSettings";
import ReminderSettings from "../../components/organisms/notif/ReminderSettings";
import TemplateSettings from "../../components/organisms/notif/TemplateSettings";
import GlobalAnnouncementSettings from "../../components/organisms/notif/GlobalAnnouncementSettings";
import NotifPreview from "../../components/organisms/notif/NotifPreview";

const NotificationSetting = ({ selectedOutlet }) => {
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);

  const [outlet, setOutlet] = useState(selectedOutlet);

  useEffect(() => {
    setOutlet(selectedOutlet);
  }, [selectedOutlet]);

  const [settings, setSettings] = useState({
    enabled: true,
    enabled_antar_jemput: true,
    enabled_ambil_di_toko: true,
    whatsapp_enabled: true,
    send_invoice_enabled: true,
    send_invoice_on_paid: true,
    unpaid_reminder_enabled: true,
    unpaid_reminder_start_after_minutes: 1440,
    unpaid_reminder_interval_minutes: 1440,
    unpaid_reminder_max_times: 3,
    quiet_hours_enabled: true,
    quiet_start: "21:00:00",
    quiet_end: "07:00:00",
    template_order_created: "",
    template_order_done: "",
    template_invoice: "",
    template_unpaid_reminder: "",
    // New fields
    custom_notif_selesai: "",
    global_finish_announcement: "",
    whatsapp_autoreply_enabled: false,
    whatsapp_autoreply_message: "",
    holiday_start_date: "",
    holiday_end_date: "",
    shop_open_time: "08:00",
    shop_close_time: "20:00",
    whatsapp_after_hours_message: "",
  });

  const fetchSettings = async () => {
    if (!outlet?.id) return;
    setLoading(true);
    try {
      // 1. Fetch Notification Settings (Includes Templates)
      const res = await axios.get(`api/v1/notification-settings/${outlet.id}`);

      // 2. Fetch Outlet specific custom message (from outlets table v2)
      let customNotif = "";
      try {
        const resOutlet = await axios.get(`api/v2/outlets/${outlet.id}`);
        customNotif = resOutlet.data.custom_notif_selesai || resOutlet.data.data?.custom_notif_selesai || "";
      } catch (e) {
        console.warn("Outlet custom notif not found");
      }

      // 3. Fetch Global System Settings (if user is admin/owner)
      let globalAnnouncement = "";
      let waAutoreplyEnabled = false;
      let waAutoreplyMessage = "";

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && (user.role === "admin" || user.role === "owner")) {
        try {
          // Fetch settings in parallel
          const [resGlobal, resWaEnabled, resWaMsg, resHolidayStart, resHolidayEnd, resShopOpen, resShopClose, resAfterHoursMsg] = await Promise.all([
            axios.get(`api/v2/system-settings/GLOBAL_FINISH_ANNOUNCEMENT`),
            axios.get(`api/v2/system-settings/WHATSAPP_AUTOREPLY_ENABLED`),
            axios.get(`api/v2/system-settings/WHATSAPP_AUTOREPLY_MESSAGE`),
            axios.get(`api/v2/system-settings/HOLIDAY_START_DATE`),
            axios.get(`api/v2/system-settings/HOLIDAY_END_DATE`),
            axios.get(`api/v2/system-settings/SHOP_OPEN_TIME`),
            axios.get(`api/v2/system-settings/SHOP_CLOSE_TIME`),
            axios.get(`api/v2/system-settings/WHATSAPP_AFTER_HOURS_MESSAGE`),
          ]);

          globalAnnouncement =
            resGlobal.data.data?.setting_value ||
            resGlobal.data.setting_value ||
            "";
          waAutoreplyEnabled =
            (resWaEnabled.data.data?.setting_value ||
              resWaEnabled.data.setting_value) === "true";
          waAutoreplyMessage =
            resWaMsg.data.data?.setting_value ||
            resWaMsg.data.setting_value ||
            "";
          
          const getVal = (res) => res.data.data?.setting_value || res.data.setting_value || "";

          setSettings((prev) => ({
            ...prev,
            ...res.data,
            custom_notif_selesai: customNotif,
            global_finish_announcement: globalAnnouncement,
            whatsapp_autoreply_enabled: waAutoreplyEnabled,
            whatsapp_autoreply_message: waAutoreplyMessage,
            holiday_start_date: getVal(resHolidayStart),
            holiday_end_date: getVal(resHolidayEnd),
            shop_open_time: getVal(resShopOpen) || "08:00",
            shop_close_time: getVal(resShopClose) || "20:00",
            whatsapp_after_hours_message: getVal(resAfterHoursMsg),
          }));
          return;
        } catch (e) {
          console.warn("Some system settings not found or restricted");
        }
      }

      setSettings((prev) => ({
        ...prev,
        ...res.data,
        custom_notif_selesai: customNotif,
        global_finish_announcement: "",
        whatsapp_autoreply_enabled: false,
        whatsapp_autoreply_message: "",
      }));
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Gagal mengambil pengaturan notifikasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [outlet?.id]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSave = async () => {
    if (!outlet?.id) return;
    setSaving(true);
    const loadingToast = toast.loading("Menyimpan pengaturan...");
    try {
      // 1. Save Notification Settings & Templates (Filter out non-notification fields)
      const {
        custom_notif_selesai,
        global_finish_announcement,
        ...notifSettings
      } = settings;
      await axios.put(
        `api/v1/notification-settings/${outlet.id}`,
        notifSettings,
      );

      // 2. Save Outlet Custom Message (Part of Outlet Profile v2)
      await axios.put(`api/v2/outlets/${outlet.id}`, {
        custom_notif_selesai: settings.custom_notif_selesai,
      });

      toast.update(loadingToast, {
        render: "Pengaturan outlet berhasil disimpan!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchSettings(); // Refresh data
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.update(loadingToast, {
        render:
          "Gagal menyimpan beberapa pengaturan. Cek koneksi atau hak akses.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGlobal = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (user.role !== "admin" && user.role !== "owner")) return;

    setSavingGlobal(true);
    const loadingToast = toast.loading("Menyimpan pengaturan sistem...");
    try {
      // Save multiple system settings
      await Promise.all([
        axios.put(`api/v2/system-settings/GLOBAL_FINISH_ANNOUNCEMENT`, {
          setting_value: settings.global_finish_announcement,
        }),
        axios.put(`api/v2/system-settings/WHATSAPP_AUTOREPLY_ENABLED`, {
          setting_value: settings.whatsapp_autoreply_enabled ? "true" : "false",
        }),
        axios.put(`api/v2/system-settings/WHATSAPP_AUTOREPLY_MESSAGE`, {
          setting_value: settings.whatsapp_autoreply_message,
        }),
        axios.put(`api/v2/system-settings/HOLIDAY_START_DATE`, {
          setting_value: settings.holiday_start_date,
        }),
        axios.put(`api/v2/system-settings/HOLIDAY_END_DATE`, {
          setting_value: settings.holiday_end_date,
        }),
        axios.put(`api/v2/system-settings/SHOP_OPEN_TIME`, {
          setting_value: settings.shop_open_time,
        }),
        axios.put(`api/v2/system-settings/SHOP_CLOSE_TIME`, {
          setting_value: settings.shop_close_time,
        }),
        axios.put(`api/v2/system-settings/WHATSAPP_AFTER_HOURS_MESSAGE`, {
          setting_value: settings.whatsapp_after_hours_message,
        }),
      ]);

      toast.update(loadingToast, {
        render: "Pengaturan sistem berhasil diperbarui!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchSettings();
    } catch (err) {
      console.error("Error saving system settings:", err);
      toast.update(loadingToast, {
        render: "Gagal menyimpan beberapa pengaturan sistem.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSavingGlobal(false);
    }
  };

  if (!outlet) {
    return (
      <Container className="mt-5 text-center">
        <h3 className="text-white">
          Pilih outlet terlebih dahulu untuk mengatur notifikasi.
        </h3>
      </Container>
    );
  }

  return (
    <>
      {/* ToastContainer removed because it's handled in Admin.js */}
      <header className="header bg-gradient-premium-notif pb-8 pt-5 pt-md-8 shadow-lg" />
      <Container className="mt--7 notification-settings-container" fluid>
        <Row>
          <Col lg="8">
            <Card
              className="shadow-premium border-0 card-notification overflow-hidden"
              style={{ borderRadius: "15px" }}
            >
              {/* Header Organism */}
              <NotifHeader
                outletName={outlet.nama}
                onSave={handleSave}
                saving={saving}
                loading={loading}
              />

              <CardBody className="bg-secondary card-body-notification">
                {/* Main Content Template */}
                <NotifSettingsTemplate
                  activeTab={activeTab}
                  onTabChange={toggleTab}
                  generalContent={
                    <GeneralSettings
                      settings={settings}
                      onChange={handleChange}
                    />
                  }
                  reminderContent={
                    <ReminderSettings
                      settings={settings}
                      onChange={handleChange}
                    />
                  }
                  templateContent={
                    <TemplateSettings
                      settings={settings}
                      onChange={handleChange}
                    />
                  }
                  globalContent={
                    <GlobalAnnouncementSettings
                      settings={settings}
                      onChange={handleChange}
                      onSave={handleSaveGlobal}
                      loading={savingGlobal}
                      isAdmin={
                        JSON.parse(localStorage.getItem("user"))?.role ===
                          "admin" ||
                        JSON.parse(localStorage.getItem("user"))?.role ===
                          "owner"
                      }
                    />
                  }
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" className="d-none d-lg-block">
            <NotifPreview settings={settings} outletName={outlet.nama} />
          </Col>
        </Row>
      </Container>

      <style>{`
        /* 1. Header & Container Layout */
        .bg-gradient-premium-notif {
          background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%) !important;
          border-bottom-left-radius: 40px;
          border-bottom-right-radius: 40px;
          min-height: 280px;
        }

        /* Max Width & Centralization */
        .notification-settings-container {
          max-width: 1300px !important;
          margin: 0 auto !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
          margin-top: -120px !important; 
        }
        
        /* 2. Main Card Styling - More Compact */
        .card-notification {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 15px 35px rgba(50, 50, 93, 0.08), 0 5px 15px rgba(0, 0, 0, 0.05) !important;
          transition: all 0.3s ease;
          border-radius: 20px !important;
        }

        /* 3. Modern Switch List Item - Slimmer Height */
        .custom-switch-notification-wrapper {
          position: relative;
          background: #ffffff;
          border: 1.2px solid #edf2f7;
          border-radius: 14px;
          padding: 1rem 1rem 1rem 4.2rem;
          margin-bottom: 0.85rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          min-height: 65px;
          display: flex;
          align-items: center;
        }

        .custom-switch-notification-wrapper:hover {
          border-color: #5e72e4;
          background: #fcfdff;
          box-shadow: 0 4px 12px rgba(94, 114, 228, 0.05);
        }

        /* Input Switch Styling Fix */
        .custom-switch-notif-input {
          position: absolute !important;
          left: 1.25rem !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          margin: 0 !important;
          cursor: pointer;
          width: 34px !important;
          height: 18px !important;
          z-index: 5;
          appearance: none;
          background-color: #cbd5e0;
          border-radius: 18px;
          transition: all 0.3s ease;
        }

        .custom-switch-notif-input:checked {
          background-color: #5e72e4;
        }

        .custom-switch-notif-input::before {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
        }

        .custom-switch-notif-input:checked::before {
          transform: translateX(16px);
        }

        .notif-label-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .notif-label-text {
          font-weight: 700;
          color: #2d3748;
          font-size: 0.9rem;
          letter-spacing: -0.01em;
        }

        .notif-desc-text {
          font-size: 0.775rem;
          color: #718096;
          line-height: 1.4;
          font-weight: 500;
        }

        /* 4. Tab Styling - More Compact */
        .nav-tabs-notification {
          border: none !important;
          background: #f7fafc;
          padding: 5px;
          border-radius: 12px;
          gap: 2px;
        }
        
        .nav-tabs-notification .nav-link {
          border: none !important;
          border-radius: 9px !important;
          font-weight: 700 !important;
          font-size: 0.8rem !important;
          color: #718096 !important;
          padding: 0.6rem 0.85rem !important;
          transition: all 0.2s;
        }

        .nav-tabs-notification .nav-link.active {
          background: #ffffff !important;
          color: #5e72e4 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04) !important;
        }

        /* 5. Dark Mode Overrides */
        .dark-mode .card-notification {
          background: #1a202c !important;
          border-color: #2d3748 !important;
        }
        
        .dark-mode .custom-switch-notification-wrapper {
          background: #2d3748;
          border-color: #4a5568;
        }
        
        .dark-mode .custom-switch-notification-wrapper:hover {
          background: #343e50;
        }

        .dark-mode .bg-gradient-premium-notif {
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%) !important;
        }

        .dark-mode .notif-label-text { color: #edf2f7; }
        .dark-mode .notif-desc-text { color: #a0aec0; }
        .dark-mode .nav-tabs-notification { background: #1a202c; }
        .dark-mode .nav-tabs-notification .nav-link.active { background: #2d3748 !important; }
      `}</style>
    </>
  );
};

export default NotificationSetting;
