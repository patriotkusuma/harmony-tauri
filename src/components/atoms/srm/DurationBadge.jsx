import React from "react";
import { Badge } from "reactstrap";

const DurationBadge = ({ durasi, tipeDurasi }) => {
  return (
    <Badge color="light" className="border text-dark">
      {durasi} {tipeDurasi === "jam" ? "jam" : "hari"}
    </Badge>
  );
};

export default DurationBadge;
