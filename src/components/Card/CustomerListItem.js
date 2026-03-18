import React from 'react';
import { Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle, Col } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater'; // Pastikan path ini benar
import CustomerAvatar from 'components/atoms/CustomerAvatar'; // Use new Avatar component

const CustomerListItem = ({ customer, isSelected, onClick }) => {
  const amountDue = customer.total_bayar - customer.telah_bayar;
  return (
    <Col md="4" lg="3" sm="6" xs="12" className="mt-3"> {/* Adjusted column size for better fit */}
      <Card
        style={{ cursor: 'pointer', height: '100%' }}
        className={`shadow-sm align-items-center text-center ${isSelected ? 'border border-primary border-3' : ''}`}
        onClick={() => onClick(customer)}
      >
        <div style={{ width: '80px', height: '80px', overflow: 'hidden' }} className="mt-3 rounded-circle align-self-center">
          <CustomerAvatar customer={customer} fallbackType="robot" />
        </div>
        {isSelected && (
          <CardImgOverlay className="py-1 px-2" style={{ top: 'auto', bottom: 5, right: 5, left: 'auto', width: 'auto', height: 'auto' }}>
            <CardText tag="span" className="text-primary bg-white rounded-circle p-1">
              <i className="fas fa-check-circle fa-lg"></i>
            </CardText>
          </CardImgOverlay>
        )}
        <CardBody className="p-2 d-flex flex-column justify-content-between flex-grow-1 w-100">
          <div>
            <h5 className="font-weight-bold mb-1 text-truncate" title={customer.nama}>
              {customer.nama}
            </h5>
            {customer.keterangan && (
              <p className="small text-muted px-1 py-0 mb-2 text-truncate" title={customer.keterangan}>
                ({customer.keterangan})
              </p>
            )}
          </div>
          <strong className={`font-weight-bold ${amountDue != 0 ? 'text-danger' : 'text-success'}`}>
            {amountDue != 0? (
              <RupiahFormater value={amountDue} />
            ) : (
              <span>Lunas</span>
            )}
          </strong>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CustomerListItem;
