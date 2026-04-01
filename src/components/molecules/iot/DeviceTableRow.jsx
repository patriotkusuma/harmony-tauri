import React from "react";
import { Badge, Button, Input } from "reactstrap";
import IoTStatusDot from "components/atoms/iot/IoTStatusDot";

const DeviceTableRow = ({ device, isOnline, onEdit, onDelete, onStatusChange }) => {
  return (
    <tr className="transition-all" style={{ transition: "all 0.2s ease-in-out" }}>
      <td className="p-4">
        <div className="d-flex align-items-center">
          <IoTStatusDot isOnline={isOnline} />
          <span className="font-weight-bold text-dark">{device.name}</span>
        </div>
      </td>
      <td className="p-4">
        <code className="text-primary font-weight-bold" style={{ fontFamily: "monospace", letterSpacing: "1px" }}>
          {device.device_code}
        </code>
      </td>
      <td className="p-4">
        <Badge color={isOnline ? "success" : "secondary"} pill className="px-3">
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </td>
      <td className="p-4">
        <div className="custom-control custom-switch">
          <Input 
            type="switch" 
            id={`switch-${device.id}`}
            checked={device.is_active}
            onChange={(e) => onStatusChange(device.id, e.target.checked)}
          />
        </div>
      </td>
      <td className="p-4 text-end">
        <Button color="info" size="sm" onClick={() => onEdit(device)}>
          <i className="fas fa-edit" />
        </Button>
        <Button color="danger" size="sm" onClick={() => onDelete(device.id)}>
          <i className="fas fa-trash" />
        </Button>
      </td>
    </tr>
  );
};

export default DeviceTableRow;
