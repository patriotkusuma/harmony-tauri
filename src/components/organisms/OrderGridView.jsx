import React from "react";
import { Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import OrderCard from "components/molecules/OrderCard";
import { useOrder } from "hooks/useOrder";

const OrderGridView = () => {
  const navigate = useNavigate();
  const { 
    pesanan, 
    isLoading, 
    toggleDetailModal, 
    printName, 
    printInvoice,
    sendInvoice,
    sendNotification,
    updateStatus
  } = useOrder();

  return (
    <Row className="gx-2">
      {isLoading && (
        <Col xs="12" className="text-center py-5">
          Loading ...
        </Col>
      )}
      {Array.isArray(pesanan?.data) &&
        pesanan.data.map((pesan, index) => (
          <Col key={index} xs="12" md="6" lg="4" className="mb-3">
            <OrderCard
              pesan={pesan}
              onClick={() => toggleDetailModal(pesan)}
              onPrintName={() => printName(pesan)}
              onPrintInvoice={() => printInvoice(pesan)}
              onSendInvoice={() => sendInvoice(pesan.kode_pesan)}
              onSendNotification={() => sendNotification(pesan.kode_pesan)}
              onUpdateStatus={updateStatus}
              onGoToDetail={() => navigate(`/admin/riwayat/${pesan.kode_pesan}`)}
            />
          </Col>
        ))}
    </Row>
  );
};

export default OrderGridView;
