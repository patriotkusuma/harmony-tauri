import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Row, Col, Badge, Button } from "reactstrap";
import moment from "moment";
import CustomerAvatar from "components/atoms/CustomerAvatar";
import RupiahFormater from "utils/RupiahFormater";
import StatusBadge from "components/atoms/StatusBadge";

const OrderCard = ({ 
  pesan, 
  onClick, 
  onPrintName, 
  onPrintInvoice, 
  onSendInvoice, 
  onSendNotification,
  onUpdateStatus,
  onGoToDetail
}) => {
  const isBatalOrDiambil = ["batal", "diambil"].includes(pesan.status);

  return (
    <Card
      className={`border h-100 transition-all shadow-sm-hover ${isBatalOrDiambil ? "text-white border-0" : ""}`}
      style={{
        borderLeft: `5px solid var(--${pesan.status_pembayaran === "Lunas" ? "success" : "danger"})`,
        backgroundColor: pesan.status === "batal" ? "#f5365c" : pesan.status === "diambil" ? "#172b4d" : "#fbfcfe",
        transition: "all 0.2s ease-in-out",
        position: "relative",
        overflow: "hidden",
        borderColor: "rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {isBatalOrDiambil && (
        <div
          className="position-absolute d-flex align-items-center justify-content-center w-100 h-100"
          style={{
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              transform: "rotate(-20deg)",
              fontSize: "2rem",
              fontWeight: "900",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "4px",
              border: "4px solid rgba(255,255,255,0.3)",
              padding: "4px 12px",
              borderRadius: "8px",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {pesan.status}
          </div>
        </div>
      )}
      <CardHeader className="bg-transparent py-2 px-3">
        <Row className="align-items-center">
          <Col xs="6">
            <span className={`font-weight-bold ${isBatalOrDiambil ? "text-white" : "text-primary"}`}>
              {pesan.kode_pesan}
            </span>
          </Col>
          <Col xs="6" className="text-right">
            <StatusBadge status={pesan.status} className="mr-1 py-1" style={{ fontSize: '0.65rem' }} />
            <Badge color={pesan.status_pembayaran === "Lunas" ? "success" : "danger"} pill className="px-2 py-1">
              {pesan.status_pembayaran}
            </Badge>
          </Col>
        </Row>
      </CardHeader>
      <CardBody className="py-2 px-3">
        <div className="d-flex align-items-center mb-2">
          <div
            className="mr-2 rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center bg-white"
            style={{ width: "40px", height: "40px", flexShrink: 0 }}
          >
            <CustomerAvatar customer={pesan.customer} fallbackType="initials" />
          </div>
          <div className="flex-grow-1 min-w-0">
            <div className="d-flex justify-content-between align-items-start">
              <h5 className={`mb-0 text-truncate font-weight-bold ${isBatalOrDiambil ? "text-white" : "text-dark"}`} style={{ maxWidth: '80%' }}>
                {pesan.customer.nama}
              </h5>
              {pesan.antar === 1 && (
                <Badge color="info" className="p-1 px-2" style={{ fontSize: '0.6rem' }}>
                  <i className="fas fa-truck mr-1" />
                  Delivery
                </Badge>
              )}
            </div>
            <div className="d-flex align-items-center">
              <small className={isBatalOrDiambil ? "text-white-50" : "text-muted"}>
                {pesan.customer.telpon}
              </small>
              <a
                  target="_blank"
                  rel="noreferrer"
                  href={"https://wa.me/628" + (pesan?.customer?.telpon?.substring(2) || "")}
                  className="ml-2 text-success"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
            </div>
          </div>
        </div>

        {pesan.customer.keterangan && (
          <div className={`mb-2 text-xs italic ${isBatalOrDiambil ? "text-white-50" : "text-muted"}`}>
            <i className="fas fa-info-circle mr-1" />
            {pesan.customer.keterangan}
          </div>
        )}

        <div className="mb-3">
          {Array.isArray(pesan.detail_pesanans) && pesan.detail_pesanans.slice(0, 2).map((d, i) => (
            <div key={i} className="text-sm">
              <i className="fas fa-check-circle mr-1 text-success-light opacity-5" />
              <span className={isBatalOrDiambil ? "text-white-80" : "text-dark"}>
                {d.qty}x {d.jenis_cuci.nama}
              </span>
            </div>
          ))}
          {Array.isArray(pesan.detail_pesanans) && pesan.detail_pesanans.length > 2 && (
            <div className="text-xs font-italic opacity-7">+{pesan.detail_pesanans.length - 2} items lainnya</div>
          )}
        </div>

        {!isBatalOrDiambil && (
          <div className="d-flex flex-wrap align-items-center mb-1" style={{ gap: '6px' }}>
            {pesan.notify_pesan === 0 && (
              <Button color="warning" size="sm" className="py-0 px-2 text-xs" onClick={(e) => { e.stopPropagation(); onSendInvoice(); }}>
                Inv
              </Button>
            )}
            {pesan.notify_selesai === 0 && (
              <Button color="primary" size="sm" className="py-0 px-2 text-xs" onClick={(e) => { e.stopPropagation(); onSendNotification(); }}>
                Notif
              </Button>
            )}
            
            <div className="ml-auto d-flex" style={{ gap: '8px' }}>
               {pesan.status === "cuci" && (
                 <a
                   href="#"
                   className="text-danger font-weight-bold text-xs"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     onUpdateStatus(pesan.kode_pesan, "selesai");
                   }}
                 >
                   Selesai
                 </a>
               ) }
               {pesan.status !== "diambil" && (
                 <a
                   href="#"
                   className="text-danger font-weight-bold text-xs"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     onUpdateStatus(pesan.kode_pesan, "diambil");
                   }}
                 >
                   Diambil
                 </a>
               )}
            </div>
          </div>
        )}
      </CardBody>
      <CardFooter className="bg-transparent py-2 px-3">
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <small className={`d-block ${isBatalOrDiambil ? "text-white-50" : "text-muted"}`}>Total</small>
            <h4 className={`mb-0 font-weight-bold ${isBatalOrDiambil ? "text-white" : "text-warning"}`}>
              <RupiahFormater value={pesan.total_harga} />
            </h4>
          </div>
          <div className="text-right">
             <div className="mb-1">
               <small className={isBatalOrDiambil ? "text-white-50" : "text-muted"}>{moment(pesan.tanggal_pesan).format('DD/MM/YY')}</small>
             </div>
             <div className="d-flex" style={{ gap: '4px' }}>
               <Button 
                 color="info" 
                 size="sm" 
                 className="p-1 px-2 shadow-none border" 
                 onClick={(e) => { e.stopPropagation(); onGoToDetail(); }}
                 title="Detail"
               >
                 <i className="fas fa-eye" />
               </Button>
               {pesan.status !== "batal" && (
                 <>
                   <Button 
                     color="secondary" 
                     size="sm" 
                     className="p-1 px-2 shadow-none border" 
                     onClick={(e) => { e.stopPropagation(); onPrintName(); }}
                     title="Print Nama"
                   >
                     <i className="fas fa-tag text-primary" />
                   </Button>
                   <Button 
                     color="secondary" 
                     size="sm" 
                     className="p-1 px-2 shadow-none border" 
                     onClick={(e) => { e.stopPropagation(); onPrintInvoice(); }}
                     title="Print Invoice"
                   >
                     <i className="fas fa-print text-default" />
                   </Button>
                 </>
               )}
             </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
