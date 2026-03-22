import React from 'react';
import { Card, CardBody, Alert, Row, Col } from 'reactstrap';
import NotifInput from '../../atoms/notif/NotifInput';
import NotifSwitch from '../../atoms/notif/NotifSwitch';
import NotifSectionHeader from '../../molecules/notif/NotifSectionHeader';

const GlobalAnnouncementSettings = ({ settings, onChange, isAdmin, onSave, loading }) => {
  if (!isAdmin) {
    return (
      <Card className="border-0 card-inner-notification">
        <CardBody>
          <Alert color="warning">
            <i className="fas fa-exclamation-triangle me-2" />
            Hanya Admin atau Owner yang dapat mengubah Pengumuman Global.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-0 card-inner-notification">
      <CardBody>
        <NotifSectionHeader title="Pengumuman Global (Seluruh Cabang)" showDivider={false} />
        <Alert color="info" className="mb-4">
          <small>
            <i className="fas fa-info-circle me-2" />
            Pesan ini akan muncul di bagian bawah notifikasi "Selesai" untuk <strong>semua outlet</strong>. 
            Cocok untuk info libur nasional atau promo besar.
          </small>
        </Alert>
        <NotifInput
          label="Isi Pengumuman Global"
          type="textarea"
          rows="3"
          name="global_finish_announcement"
          value={settings.global_finish_announcement}
          onChange={onChange}
          placeholder="Contoh: Kami libur tanggal 17 Agustus dalam rangka HUT RI."
        />

        <div className="divider-notification my-4" style={{ borderTop: '1px solid #e9ecef' }} />

        <NotifSectionHeader title="WhatsApp Autoreply (Pesan Otomatis)" showDivider={false} />

        <NotifSwitch
          id="waAutoreplyEnabled"
          name="whatsapp_autoreply_enabled"
          label="Aktifkan WhatsApp Autoreply"
          description="Akses fitur bot di mana sistem akan membalas pesan ke pelanggan secara otomatis saat toko tutup atau libur. Berfungsi untuk seluruh outlet."
          checked={settings.whatsapp_autoreply_enabled}
          onChange={onChange}
        />

        <Row className="mb-3">
          <Col md="6">
            <NotifInput
              label="Mulai Tanggal Libur"
              type="date"
              name="holiday_start_date"
              value={settings.holiday_start_date}
              onChange={onChange}
            />
          </Col>
          <Col md="6">
            <NotifInput
              label="Sampai Tanggal Libur"
              type="date"
              name="holiday_end_date"
              value={settings.holiday_end_date}
              onChange={onChange}
            />
          </Col>
        </Row>

        <NotifInput
          label="Isi Pesan Autoreply"
          type="textarea"
          rows="3"
          name="whatsapp_autoreply_message"
          value={settings.whatsapp_autoreply_message}
          onChange={onChange}
          placeholder="Contoh: Halo! Kami sedang libur. Kami akan membalas pesan Anda hari Senin."
        />

        <div className="divider-notification my-4" style={{ borderTop: '1px solid #e9ecef' }} />

        <NotifSectionHeader title="WhatsApp After-Hours (Jam Operasional)" showDivider={false} />
        <Row className="mb-3">
          <Col md="6">
            <NotifInput
              label="Jam Buka Toko"
              type="time"
              name="shop_open_time"
              value={settings.shop_open_time}
              onChange={onChange}
            />
          </Col>
          <Col md="6">
            <NotifInput
              label="Jam Tutup Toko"
              type="time"
              name="shop_close_time"
              value={settings.shop_close_time}
              onChange={onChange}
            />
          </Col>
        </Row>

        <NotifInput
          label="Pesan Saat Toko Tutup"
          type="textarea"
          rows="3"
          name="whatsapp_after_hours_message"
          value={settings.whatsapp_after_hours_message}
          onChange={onChange}
          placeholder="Contoh: Mohon maaf, store kami sudah tutup. Pesan Anda akan dibalas besok pagi."
        />

        <div className="mt-4 d-flex justify-content-between align-items-center">
            <small className="text-muted">
                *Pengaturan ini berlaku untuk seluruh sistem.
            </small>
            <button 
              className="btn btn-primary btn-sm px-4" 
              onClick={onSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2" />
                  Simpan Pengaturan Sistem
                </>
              )}
            </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default GlobalAnnouncementSettings;
