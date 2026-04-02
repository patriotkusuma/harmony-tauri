import React from "react";
import { Card, CardBody, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { formatImageUrl } from "store/serviceRevenueStore";

const tipeLabel = {
  per_kilo: "Per Kilo",
  satuan: "Satuan",
  meter: "Meter",
  kilo_meter: "Kilo Meter",
};

const money = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

const ServiceItemCard = ({ service, isActive, resolvedAccount, onClick, onEdit, onDelete }) => {
  return (
    <Card
      className={`mb-2 border-0 shadow-sm service-item ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
    >
      <CardBody className="py-3">
        <div className="d-flex align-items-start justify-content-between">
          <div className="d-flex align-items-start overflow-hidden">
            <div className="service-thumbnail me-3 rounded-lg overflow-hidden flex-shrink-0 bg-light d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
              {service.gambar ? (
                <img src={formatImageUrl(service.gambar)} alt={service.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="fas fa-soap text-muted opacity-5" />
              )}
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="d-flex align-items-center mb-1">
                <span className="font-weight-bold text-dark line-clamp-1 me-2" style={{ fontSize: '0.95rem' }}>{service.nama}</span>
                <Badge color="secondary" className="px-2 py-0 x-small" pill style={{ fontSize: '0.6rem' }}>
                  {tipeLabel[service.tipe] || service.tipe}
                </Badge>
                {service.category_paket && (
                   <Badge color="info" className="px-2 py-0 x-small ms-1" pill style={{ fontSize: '0.6rem', background: '#e0f2fe', color: '#0369a1', border: 'none' }}>
                     {service.category_paket.nama}
                   </Badge>
                )}
              </div>
              <div className="small text-muted mb-0 line-clamp-1" style={{ fontSize: '0.75rem' }}>{service.keterangan || "Tanpa keterangan"}</div>
              
              <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="price-tag font-weight-bold text-primary" style={{ fontSize: '1rem' }}>
                  {money(service.harga)}
                </div>
                <div className="mapping-status">
                  {resolvedAccount ? (
                    <Badge color={resolvedAccount.source === "mapped" ? "success" : "warning"} className="px-2" pill style={{ fontSize: '0.55rem', letterSpacing: '0.5px' }}>
                      {resolvedAccount.code}
                    </Badge>
                  ) : (
                    <Badge color="danger" pill style={{ fontSize: '0.55rem' }}>No Mapping</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <UncontrolledDropdown>
            <DropdownToggle
              className="btn-icon-only p-0"
              color=""
              role="button"
              size="sm"
              onClick={(e) => e.stopPropagation()}
              style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-ellipsis-v text-dark" style={{ fontSize: '1rem' }} />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" end style={{ borderRadius: '12px', zIndex: 1050 }}>
              <DropdownItem onClick={(e) => { e.stopPropagation(); onEdit(service); }} className="py-2">
                <i className="fas fa-cog text-primary me-2" /> <span className="small">Konfigurasi</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={(e) => { e.stopPropagation(); onDelete(service.id); }} className="py-2">
                <i className="fas fa-trash text-danger me-2" /> <span className="small">Hapus</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>

      </CardBody>
      <style>{`
        .service-item {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
        }
        .service-item:hover {
          transform: translateY(-2px);
          border-color: #94a3b8 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
        }
        .service-item.active {
          background: #f8fafc !important;
          border: 2px solid #0284c7 !important;
          border-left: 6px solid #0284c7 !important;
        }
        .service-item .text-dark {
          color: #0f172a !important;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .x-small { font-size: 0.6rem !important; }
      `}</style>


    </Card>
  );
};


export default ServiceItemCard;

