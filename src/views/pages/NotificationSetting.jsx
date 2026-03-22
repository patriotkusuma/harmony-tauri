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
      <header className="header bg-gradient-info pb-8 pt-5 pt-md-8" />
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
        /* Full Width Settings Rows */
        .custom-switch-notification {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
          min-height: 3.5rem;
          padding: 0.5rem 1rem 0.5rem 3.75rem !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          margin-bottom: 0.75rem;
          background-color: #f8f9fe;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box !important;
          position: relative;
        }
        
        .custom-switch-notification:hover {
          background-color: #f1f3f9;
          border-color: #dee2e6;
        }

        .custom-switch-notification .form-check-label {
          width: 100%;
          cursor: pointer;
          font-weight: 500;
          color: #525f7f;
          margin-bottom: 0 !important; /* Hapus margin bawah default */
          display: flex;
          align-items: center;
        }

        /* Posisi sakelar (track dan knob) benar-benar di tengah vertikal */
        .custom-switch-notification .form-check-label::before,
        .custom-switch-notification .form-check-label::after {
          top: 50% !important;
          transform: translateY(-50%) !important;
          left: -2.75rem !important;
          margin-top: 0 !important;
        }

        /* Khusus untuk knob (bulatan) agar tidak terpengaruh transform saat transisi horizontal */
        .custom-switch-notification .form-check-input:checked ~ .form-check-label::after {
          transform: translateX(0.9375rem) translateY(-50%) !important;
        }

        /* Dark Mode Support for Notification Settings */
        .dark-mode .card-notification {
          background-color: #1a1a2e !important;
          border: 1px solid #2b2b4b !important;
        }
        /* ... rest of dark mode styles ... */
        .dark-mode .card-header-notification {
          background-color: #1a1a2e !important;
          border-bottom: 1px solid #2b2b4b !important;
        }
        .dark-mode .title-notification {
          color: #fff !important;
        }
        .dark-mode .card-body-notification {
          background-color: #161625 !important;
        }
        .dark-mode .card-inner-notification {
          background-color: #1a1a2e !important;
          box-shadow: 0 0 2rem 0 rgba(0,0,0,.2);
        }
        .dark-mode .section-title-notification {
          color: #adb5bd !important;
        }
        .dark-mode .label-notification {
          color: #ced4da !important;
        }
        .dark-mode .input-notification {
          background-color: #161625 !important;
          border: 1px solid #2b2b4b !important;
          color: #fff !important;
        }
        .dark-mode .input-notification:focus {
          background-color: #1a1a2e !important;
          border-color: #5e72e4 !important;
        }
        .dark-mode .divider-notification {
          border-top: 1px solid #2b2b4b !important;
        }
        
        .dark-mode .custom-switch-notification {
          background-color: #1a1a2e !important;
          border-color: #2b2b4b !important;
        }
        
        .dark-mode .custom-switch-notification:hover {
          background-color: #21213d !important;
        }

        .dark-mode .custom-switch-notification .form-check-label::before {
          background-color: #2b2b4b !important;
          border-color: #32325d !important;
        }
        .dark-mode .custom-switch-notification .form-check-label {
          color: #ced4da !important;
        }
        .dark-mode .nav-tabs-notification .nav-link {
          background-color: #161625 !important;
          color: #adb5bd !important;
          border: 1px solid #2b2b4b !important;
        }
        .dark-mode .nav-tabs-notification .nav-link.active {
          background-color: #5e72e4 !important;
          color: #fff !important;
          border-color: #5e72e4 !important;
        }
        .dark-mode .text-muted {
          color: #8898aa !important;
        }
      `}</style>
    </>
  );
};

export default NotificationSetting;
