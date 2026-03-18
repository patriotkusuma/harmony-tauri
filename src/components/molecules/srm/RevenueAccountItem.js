import React from "react";
import { Card, CardBody, Badge } from "reactstrap";

const RevenueAccountItem = ({ account, isActive, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={`mb-2 border-0 shadow-sm revenue-item ${isActive ? "active" : ""}`}
      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
    >
      <CardBody className="py-2 px-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
             <div className="account-icon mr-3 rounded-circle bg-success-light d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                <i className="fas fa-file-invoice-dollar text-success" />
             </div>
             <div>
                <div className="font-weight-bold" style={{ fontSize: '0.9rem' }}>
                  {account.code} - {account.name}
                </div>
                <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{account.type} Account</div>
             </div>
          </div>
          {account.isDefault && <Badge color="success" pill style={{ fontSize: '0.6rem' }}>Default</Badge>}
        </div>
      </CardBody>
      <style>{`
        .bg-success-light { background: #dcfce7; }
        .revenue-item {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(5px);
        }
        .revenue-item:hover {
          transform: translateX(4px);
          background: #fff !important;
        }
        .revenue-item.active {
          background: #fff !important;
          border-right: 4px solid #2dce89 !important;
          box-shadow: 0 4px 12px rgba(45, 206, 137, 0.15) !important;
        }
      `}</style>
    </Card>
  );
};

export default RevenueAccountItem;

