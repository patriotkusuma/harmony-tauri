import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import NotifSwitch from '../../atoms/notif/NotifSwitch';
import NotifSectionHeader from '../../molecules/notif/NotifSectionHeader';

const GeneralSettings = ({ settings, onChange }) => {
  return (
    <Card className="border-0 card-inner-notification">
      <CardBody>
        <NotifSectionHeader title="Status Global" showDivider={false} />
        <NotifSwitch
          id="enabled"
          name="enabled"
          label="Aktifkan Sistem Notifikasi Keseluruhan"
          checked={settings.enabled}
          onChange={onChange}
        />

        <NotifSectionHeader title="Kondisi Layanan" />
        <Row>
          <Col md="6">
            <NotifSwitch
              id="enabled_antar_jemput"
              name="enabled_antar_jemput"
              label="Kirim Notif untuk Antar Jemput"
              checked={settings.enabled_antar_jemput}
              onChange={onChange}
            />
          </Col>
          <Col md="6">
            <NotifSwitch
              id="enabled_ambil_di_toko"
              name="enabled_ambil_di_toko"
              label="Kirim Notif untuk Ambil Di Toko"
              checked={settings.enabled_ambil_di_toko}
              onChange={onChange}
            />
          </Col>
        </Row>

        <NotifSectionHeader title="Status Transaksi & Kanal" />
        <Row>
          <Col md="6">
            <NotifSwitch
              id="send_invoice_enabled"
              name="send_invoice_enabled"
              label="Kirim Invoice (Struk Pembayaran)"
              checked={settings.send_invoice_enabled}
              onChange={onChange}
            />
            <NotifSwitch
              id="send_invoice_on_paid"
              name="send_invoice_on_paid"
              label="Kirim Bukti jika Lunas"
              checked={settings.send_invoice_on_paid}
              onChange={onChange}
            />
          </Col>
          <Col md="6">
            <NotifSwitch
              id="whatsapp_enabled"
              name="whatsapp_enabled"
              label="Kirim melalui WhatsApp"
              checked={settings.whatsapp_enabled}
              onChange={onChange}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default GeneralSettings;
