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
    template_order_created_en: "",
    template_order_done: "",
    template_order_done_en: "",
    template_invoice: "",
    template_invoice_en: "",
    template_unpaid_reminder: "",
    template_unpaid_reminder_en: "",
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
      const res = await axios.get(`api/v1/notification-settings/${outlet.id}`);

      let customNotif = "";
      try {
        const resOutlet = await axios.get(`api/v2/outlets/${outlet.id}`);
        customNotif = resOutlet.data.custom_notif_selesai || resOutlet.data.data?.custom_notif_selesai || "";
      } catch (e) {
        console.warn("Outlet custom notif not found");
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && (user.role === "admin" || user.role === "owner")) {
        try {
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

          const getVal = (r) => r.data.data?.setting_value || r.data.setting_value || "";

          setSettings((prev) => ({
            ...prev,
            ...res.data,
            custom_notif_selesai: customNotif,
            global_finish_announcement: getVal(resGlobal),
            whatsapp_autoreply_enabled: getVal(resWaEnabled) === "true",
            whatsapp_autoreply_message: getVal(resWaMsg),
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
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!outlet?.id) return;
    setSaving(true);
    const loadingToast = toast.loading("Menyimpan pengaturan...");
    try {
      const { custom_notif_selesai, global_finish_announcement, ...notifSettings } = settings;
      await axios.put(`api/v1/notification-settings/${outlet.id}`, notifSettings);
      await axios.put(`api/v2/outlets/${outlet.id}`, { custom_notif_selesai: settings.custom_notif_selesai });

      toast.update(loadingToast, { render: "Pengaturan outlet berhasil disimpan!", type: "success", isLoading: false, autoClose: 3000 });
      fetchSettings();
    } catch (err) {
      toast.update(loadingToast, { render: "Gagal menyimpan beberapa pengaturan.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGlobal = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) return;

    setSavingGlobal(true);
    const loadingToast = toast.loading("Menyimpan pengaturan sistem...");
    try {
      const s = settings;
      await Promise.all([
        axios.put(`api/v2/system-settings/GLOBAL_FINISH_ANNOUNCEMENT`, { setting_value: s.global_finish_announcement }),
        axios.put(`api/v2/system-settings/WHATSAPP_AUTOREPLY_ENABLED`, { setting_value: s.whatsapp_autoreply_enabled ? "true" : "false" }),
        axios.put(`api/v2/system-settings/WHATSAPP_AUTOREPLY_MESSAGE`, { setting_value: s.whatsapp_autoreply_message }),
        axios.put(`api/v2/system-settings/HOLIDAY_START_DATE`, { setting_value: s.holiday_start_date }),
        axios.put(`api/v2/system-settings/HOLIDAY_END_DATE`, { setting_value: s.holiday_end_date }),
        axios.put(`api/v2/system-settings/SHOP_OPEN_TIME`, { setting_value: s.shop_open_time }),
        axios.put(`api/v2/system-settings/SHOP_CLOSE_TIME`, { setting_value: s.shop_close_time }),
        axios.put(`api/v2/system-settings/WHATSAPP_AFTER_HOURS_MESSAGE`, { setting_value: s.whatsapp_after_hours_message }),
      ]);
      toast.update(loadingToast, { render: "Pengaturan sistem berhasil diperbarui!", type: "success", isLoading: false, autoClose: 3000 });
      fetchSettings();
    } catch (err) {
      toast.update(loadingToast, { render: "Gagal menyimpan pengaturan sistem.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setSavingGlobal(false);
    }
  };

  if (!outlet) return null;

  return (
    <div className="main-content-notif pb-5">
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8 shadow-sm rounded-bottom" style={{ minHeight: '300px' }} />
      <Container className="mt--7" fluid>
        <Row>
          <Col lg="8">
            <Card className="shadow border-0 rounded-lg overflow-hidden">
              <NotifHeader outletName={outlet.nama} onSave={handleSave} saving={saving} loading={loading} />
              <CardBody className="bg-secondary p-4">
                <NotifSettingsTemplate
                  activeTab={activeTab}
                  onTabChange={toggleTab}
                  generalContent={<GeneralSettings settings={settings} onChange={handleChange} />}
                  reminderContent={<ReminderSettings settings={settings} onChange={handleChange} />}
                  templateContent={<TemplateSettings settings={settings} onChange={handleChange} />}
                  globalContent={
                    <GlobalAnnouncementSettings
                      settings={settings}
                      onChange={handleChange}
                      onSave={handleSaveGlobal}
                      loading={savingGlobal}
                      isAdmin={(() => {
                        try {
                          const user = JSON.parse(localStorage.getItem("user"));
                          return user?.role === "admin" || user?.role === "owner";
                        } catch (e) { return false; }
                      })()}
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
    </div>
  );
};

export default NotificationSetting;
