import React from 'react';
import { CardHeader, Row, Col, Button } from 'reactstrap';

const NotifHeader = ({ outletName, onSave, saving, loading }) => {
  return (
    <CardHeader className="bg-white pb-3 card-header-notification">
      <Row className="align-items-center">
        <Col xs="12" md="8" className="mb-3 mb-md-0">
          <h6 className="text-uppercase text-muted ls-1 mb-1">
            Outlet: {outletName}
          </h6>
          <h3 className="mb-0 title-notification">Pengaturan Notifikasi</h3>
        </Col>
        <Col xs="12" md="4" className="text-md-right">
          <Button
            color="primary"
            onClick={onSave}
            disabled={saving || loading}
            className="btn-save-notification w-100 w-md-auto"
            style={{ whiteSpace: 'nowrap' }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </Col>
      </Row>
    </CardHeader>
  );
};

export default NotifHeader;
