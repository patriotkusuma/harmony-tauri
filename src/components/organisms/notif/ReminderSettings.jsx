import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import NotifSwitch from '../../atoms/notif/NotifSwitch';
import NotifInput from '../../atoms/notif/NotifInput';
import NotifSectionHeader from '../../molecules/notif/NotifSectionHeader';

const ReminderSettings = ({ settings, onChange }) => {
  return (
    <>
      <Card className="border-0 mb-4 card-inner-notification">
        <CardBody>
          <NotifSectionHeader title="Pengaturan Tagihan Belum Dibayar" showDivider={false} />
          <NotifSwitch
            id="unpaid_reminder_enabled"
            name="unpaid_reminder_enabled"
            label="Aktifkan Pengingat Tagihan"
            description="Pelanggan yang belum melunasi pembayaran akan otomatis diingatkan (Follow up) oleh sistem."
            checked={settings.unpaid_reminder_enabled}
            onChange={onChange}
          />
          
          {settings.unpaid_reminder_enabled && (
            <Row>
              <Col md="4">
                <NotifInput
                  label="Mulai Ingatkan (Menit)"
                  type="number"
                  name="unpaid_reminder_start_after_minutes"
                  value={settings.unpaid_reminder_start_after_minutes}
                  onChange={onChange}
                  helpText="Setelah nota terbit"
                />
              </Col>
              <Col md="4">
                <NotifInput
                  label="Interval (Menit)"
                  type="number"
                  name="unpaid_reminder_interval_minutes"
                  value={settings.unpaid_reminder_interval_minutes}
                  onChange={onChange}
                  helpText="Jarak antar pengingat"
                />
              </Col>
              <Col md="4">
                <NotifInput
                  label="Maksimal Percobaan"
                  type="number"
                  name="unpaid_reminder_max_times"
                  value={settings.unpaid_reminder_max_times}
                  onChange={onChange}
                  helpText="Kali pengiriman"
                />
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>

      <Card className="border-0 card-inner-notification">
        <CardBody>
          <NotifSectionHeader title="Jam Tenang (Quiet Hours)" showDivider={false} />
          <NotifSwitch
            id="quiet_hours_enabled"
            name="quiet_hours_enabled"
            label="Aktifkan Jam Tenang"
            description="Tunda pengiriman notifikasi/pengingat pada malam hari dan lanjutkan saat outlet buka keesokan harinya."
            checked={settings.quiet_hours_enabled}
            onChange={onChange}
          />

          {settings.quiet_hours_enabled && (
            <Row>
              <Col md="6">
                <NotifInput
                  label="Mulai Jam"
                  type="time"
                  step="1"
                  name="quiet_start"
                  value={settings.quiet_start}
                  onChange={onChange}
                />
              </Col>
              <Col md="6">
                <NotifInput
                  label="Akhir Jam"
                  type="time"
                  step="1"
                  name="quiet_end"
                  value={settings.quiet_end}
                  onChange={onChange}
                />
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default ReminderSettings;
