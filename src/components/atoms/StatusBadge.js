import React from "react";
import { Badge } from "reactstrap";

const StatusBadge = ({ status, color, className = "" }) => {
  let badgeColor = color;
  
  if (!color) {
    switch (status?.toLowerCase()) {
      case "lunas":
        badgeColor = "success";
        break;
      case "belum lunas":
      case "pending":
        badgeColor = "danger";
        break;
      case "cuci":
        badgeColor = "info";
        break;
      case "selesai":
        badgeColor = "default";
        break;
      case "batal":
        badgeColor = "danger";
        break;
      default:
        badgeColor = "secondary";
    }
  }

  return (
    <Badge color={badgeColor} pill className={`px-3 ${className}`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
