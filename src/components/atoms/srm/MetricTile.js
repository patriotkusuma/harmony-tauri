import React from "react";
import { Card, CardBody } from "reactstrap";

const MetricTile = ({ icon, label, value, tone = "primary" }) => {
  return (
    <Card className={`shadow-sm border-0 metric-tile metric-${tone}`}>
      <CardBody className="py-2 px-3">
        <div className="d-flex align-items-center">
          <div className="metric-icon-box d-flex align-items-center justify-content-center mr-3">
            <i className={`${icon} text-white`} style={{ fontSize: '1.1rem' }} />
          </div>
          <div>
            <div className="text-uppercase text-white-50 font-weight-bold mb-0" style={{ fontSize: '10px', letterSpacing: '1px' }}>{label}</div>
            <div className="h3 mb-0 font-weight-bold text-white" style={{ lineHeight: '1.2' }}>{value}</div>
          </div>
        </div>
      </CardBody>
      <style>{`
        .metric-tile {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          transition: all 0.3s ease;
          min-width: 160px;
          border-radius: 12px !important;
        }
        .metric-tile:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateY(-2px);
        }
        .metric-icon-box {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .metric-primary .metric-icon-box { background: rgba(94, 114, 228, 0.3); }
        .metric-info .metric-icon-box { background: rgba(17, 205, 239, 0.3); }
        .metric-success .metric-icon-box { background: rgba(45, 206, 137, 0.3); }
      `}</style>
    </Card>
  );
};



export default MetricTile;

