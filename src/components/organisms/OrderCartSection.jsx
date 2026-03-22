import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Badge,
  Input,
} from "reactstrap";
import RupiahFormater from "utils/RupiahFormater";
// Utils
import {
  calculateLaundryItemSubtotal,
  findItemSatuan,
} from "utils/laundryCalc";

const OrderCartSection = ({
  cartItems,
  subTotal,
  onUpdateCart,
  onRemoveCart,
  onClearCart,
  categories,
}) => {
  const hasItems = cartItems && Object.keys(cartItems).length > 0;

  return (
    <Card className="shadow-premium border-0 overflow-hidden mb-4">
      <CardHeader className="bg-white py-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h4" className="mb-0 text-dark font-weight-bold">
            <i className="fas fa-shopping-cart me-2 text-primary" /> Keranjang
            Pesanan
          </CardTitle>
          {hasItems && (
            <Button
              color="danger"
              size="sm"
              className="rounded-circle btn-icon p-0"
              style={{ width: "28px", height: "28px" }}
              onClick={onClearCart}
              title="Kosongkan Keranjang"
            >
              <i className="fas fa-trash-alt" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody
        className="slim-scroll bg-secondary-soft px-3 py-3"
        style={{ maxHeight: "350px", minHeight: "150px", overflowY: "auto" }}
      >
        {!hasItems ? (
          <div className="text-center py-5 opacity-6">
            <i className="fas fa-cart-plus fa-3x text-muted mb-2" />
            <p className="text-muted italic mb-0 font-weight-bold">
              Keranjang sedang kosong.
            </p>
          </div>
        ) : (
          Object.keys(cartItems).map((key) => {
            const itemBatch = cartItems[key];
            const item = itemBatch[0];

            // Robust unit extraction with category lookup backup
            let itemSatuan =
              item.satuan ||
              item.jenis_cuci?.satuan ||
              item.paket?.satuan ||
              "";
            if (!itemSatuan && categories && item.id_jenis_cuci) {
              itemSatuan = findItemSatuan(item.id_jenis_cuci, categories);
            }

            const itemSubtotal = calculateLaundryItemSubtotal(item, categories);

            return (
              <div
                key={key}
                className="bg-white rounded-lg shadow-sm p-3 mb-3 border-left border-3 border-info animate-fade-in"
              >
                <Row className="align-items-center">
                  <Col xs="6">
                    <div className="d-flex flex-column">
                      <span className="text-dark font-weight-900 ls-1 h5 mb-1 text-truncate">
                        {item.name}
                      </span>
                      <div className="d-flex align-items-center">
                        <Badge
                          color="info"
                          pill
                          className="text-xs px-2 py-1 me-2 shadow-none border"
                        >
                          <RupiahFormater value={item.price} /> / {itemSatuan}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                  <Col xs="6" className="text-end">
                    <div className="d-flex align-items-center justify-content-end">
                      <Input
                        autoFocus
                        type="number"
                        className="form-control-sm text-center font-weight-bold mx-1"
                        style={{
                          width: "85px",
                          borderRadius: "8px",
                          border: "2px solid #e9ecef",
                        }}
                        defaultValue={item.qty}
                        min="1"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          onUpdateCart(e.target.value, item.id_jenis_cuci)
                        }
                      />
                      <Button
                        color="danger"
                        outline
                        size="sm"
                        className="rounded-circle btn-icon p-1 border-0 shadow-none hover-bg-danger"
                        onClick={() => onRemoveCart(item)}
                      >
                        <i className="fas fa-times-circle" />
                      </Button>
                    </div>
                  </Col>
                </Row>
                <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="text-muted small italic font-weight-bold">
                    Subtotal Item:
                  </span>
                  <span className="text-dark font-weight-900">
                    <RupiahFormater value={itemSubtotal} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardBody>
      <CardFooter className="bg-white border-top py-3 px-4">
        <div className="d-flex justify-content-between align-items-center">
          <span className="h4 font-weight-bold text-muted mb-0">
            Total Sementara:
          </span>
          <span className="h3 font-weight-900 text-primary mb-0">
            <RupiahFormater value={subTotal} />
          </span>
        </div>
      </CardFooter>
      <style>{`
                .border-3 { border-width: 4px !important; }
                .hover-bg-danger:hover { color: #f5365c !important; }
                .bg-secondary-soft { background-color: #f8f9fe; }
                .animate-fade-in { animation: fadeIn 0.3s ease; }
            `}</style>
    </Card>
  );
};

export default OrderCartSection;
