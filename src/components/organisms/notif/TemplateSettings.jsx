import React from 'react';
import { Card, CardBody } from 'reactstrap';
import NotifInput from '../../atoms/notif/NotifInput';
import NotifSectionHeader from '../../molecules/notif/NotifSectionHeader';

const TemplateSettings = ({ settings, onChange }) => {
  return (
    <Card className="border-0 card-inner-notification">
      <CardBody>
        <NotifSectionHeader title="Template Pesan Teks" showDivider={false} />
        <NotifInput
          label="Template Pesanan Masuk / Dibuat"
          type="textarea"
          rows="3"
          name="template_order_created"
          value={settings.template_order_created}
          onChange={onChange}
          placeholder="Gunakan {{nama}}, {{kode}}, dll untuk variabel"
        />
        <NotifInput
          label="Template Pesanan Selesai"
          type="textarea"
          rows="3"
          name="template_order_done"
          value={settings.template_order_done}
          onChange={onChange}
        />
        <NotifInput
          label="Template Invoice Lunas"
          type="textarea"
          rows="3"
          name="template_invoice"
          value={settings.template_invoice}
          onChange={onChange}
        />
        <NotifInput
          label="Template Tagihan Belum Dibayar"
          type="textarea"
          rows="3"
          name="template_unpaid_reminder"
          value={settings.template_unpaid_reminder}
          onChange={onChange}
        />
        <NotifSectionHeader title="Pesan Tambahan Khusus Outlet" />
        <NotifInput
          label="Custom Message Selesai (Per-Outlet)"
          type="textarea"
          rows="3"
          name="custom_notif_selesai"
          value={settings.custom_notif_selesai}
          onChange={onChange}
          placeholder="Misal: Titik jemput di depan lobi atau info parkir gratis."
        />
      </CardBody>
    </Card>
  );
};

export default TemplateSettings;
