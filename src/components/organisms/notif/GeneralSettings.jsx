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
          description="Mematikan pengaturan ini akan menghentikan HENTIKAN seluruh notifikasi (WA & Sistem) dari Outlet ini, terlepas dari pengaturan lainnya."
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
              description="Pesan akan dikirim otomatis ke pelanggan jika status layanan adalah antar jemput."
              checked={settings.enabled_antar_jemput}
              onChange={onChange}
            />
          </Col>
          <Col md="6">
            <NotifSwitch
              id="enabled_ambil_di_toko"
              name="enabled_ambil_di_toko"
              label="Kirim Notif untuk Ambil Di Toko"
              description="Pesan akan dikirim otomatis ketika sistem mendeteksi barang siap diambil (walk-in)."
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
              description="Sistem akan otomatis mengirimkan rincian struk pembelian kepada pelanggan."
              checked={settings.send_invoice_enabled}
              onChange={onChange}
            />
            <NotifSwitch
              id="send_invoice_on_paid"
              name="send_invoice_on_paid"
              label="Kirim Bukti Lunas"
              description="Kirim notifikasi bahwa pembayaran/tagihan telah dilunasi di kasir."
              checked={settings.send_invoice_on_paid}
              onChange={onChange}
            />
          </Col>
          <Col md="6">
            <NotifSwitch
              id="whatsapp_enabled"
              name="whatsapp_enabled"
              label="Kirim melalui WhatsApp"
              description="Jika pelanggan memiliki nomor handphone (WA Valid), notifikasi akan masuk ke WhatsApp mereka via Gateway."
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
