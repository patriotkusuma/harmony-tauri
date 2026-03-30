import React from 'react';
import { Table, Spinner, Badge, Button } from 'reactstrap';
import moment from 'moment';
import WebhookStatusBadge from '../../atoms/webhook/WebhookStatusBadge';

const WebhookList = ({ logs, loading, onViewDetail }) => {
  return (
    <div className="table-responsive rounded-lg custom-wrapper">
      <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr className="table-header-row">
            <td className="table-header-cell text-center" style={{ width: 80 }}>ID</td>
            <td className="table-header-cell">Waktu Diterima</td>
            <td className="table-header-cell">Event / Sumber</td>
            <td className="table-header-cell">Device ID</td>
            <td className="table-header-cell text-center">Status</td>
            <td className="table-header-cell text-center">Aksi</td>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <Spinner color="primary" />
              </td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <i className="fas fa-plug fa-3x text-light mb-3 empty-icon" />
                <h4 className="text-muted font-weight-bold mb-0">Belum ada Log Webhook</h4>
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="op-row">
                <td className="px-4 py-3 border-bottom-custom text-center text-muted font-weight-bold">
                  #{log.id}
                </td>
                <td className="px-4 py-3 border-bottom-custom text-dark font-weight-700 title-adaptive">
                  {moment(log.created_at).format("DD MMM YYYY")}
                  <span className="d-block text-muted small">{moment(log.created_at).format("HH:mm:ss")}</span>
                </td>
                <td className="px-4 border-bottom-custom">
                  <Badge color="default" className="text-lowercase">{log.event}</Badge>
                </td>
                <td className="px-4 border-bottom-custom opacity-8 font-weight-bold">
                  {log.device_id || '-'}
                </td>
                <td className="px-4 border-bottom-custom text-center">
                  <WebhookStatusBadge status={log.status} />
                </td>
                <td className="px-4 border-bottom-custom text-center">
                  <Button color="info" size="sm" className="rounded-pill shadow-sm" onClick={() => onViewDetail(log)}>
                     <i className="fas fa-search me-1"></i> Detail
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default WebhookList;
