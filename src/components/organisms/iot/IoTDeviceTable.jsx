import React from "react";
import { Table, Spinner, Card, CardHeader, Badge, CardBody } from "reactstrap";
import DeviceTableRow from "components/molecules/iot/DeviceTableRow";

const IoTDeviceTable = ({ devices, loading, mqttDeviceStatus, onEdit, onDelete, onStatusChange }) => {
  return (
    <Card className="shadow-premium border-0 glass-iot" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderRadius: "20px", overflow: "hidden" }}>
      <CardHeader className="bg-transparent border-0 py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0 font-weight-bold">Daftar Perangkat Terdaftar</h3>
          <Badge color="info" pill className="px-3">Total: {devices.length}</Badge>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <Table className="align-items-center table-flush" hover>
            <thead className="thead-light">
              <tr>
                <th className="ls-1 text-xs uppercase p-4">Nama Perangkat</th>
                <th className="ls-1 text-xs uppercase p-4">Kode / Serial</th>
                <th className="ls-1 text-xs uppercase p-4">Status Broker</th>
                <th className="ls-1 text-xs uppercase p-4">Aktif</th>
                <th className="ls-1 text-xs uppercase p-4 text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-2 text-muted">Memuat data perangkat...</p>
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <i className="fas fa-robot fa-3x mb-3 opacity-2" />
                    <p className="italic">Belum ada perangkat IoT yang terdaftar.</p>
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <DeviceTableRow 
                    key={device.id}
                    device={device}
                    isOnline={mqttDeviceStatus[device.device_code] === 'online'}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default IoTDeviceTable;
