import React from "react";
import { Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from "reactstrap";
import DurationBadge from "components/atoms/srm/DurationBadge";

const CategoryItemCard = ({ category, isActive, serviceCount, onClick, onEdit, onDelete }) => {
  return (
    <Card
      onClick={onClick}
      className={`mb-2 border-0 shadow-none category-item-sidebar ${isActive ? "active" : ""}`}
      style={{ cursor: "pointer", borderRadius: '12px', transition: 'all 0.2s' }}
    >
      <CardBody className="py-2 px-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center overflow-hidden mr-2">
             <div className={`icon-box mr-3 d-flex align-items-center justify-content-center rounded-lg ${isActive ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: 36, height: 36, minWidth: 36 }}>
                <i className="fas fa-folder" style={{ fontSize: '0.9rem' }} />
             </div>
             <div className="overflow-hidden">
                <div className={`font-weight-bold line-clamp-1 ${isActive ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>{category.nama}</div>
                <div className="d-flex align-items-center mt-1">
                   <Badge color={isActive ? "primary" : "secondary"} className="mr-2" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                      {serviceCount} Layanan
                   </Badge>
                   <span className="text-muted" style={{ fontSize: '0.7rem' }}>{category.durasi}{category.tipe_durasi[0]}</span>
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
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-ellipsis-h text-dark" style={{ fontSize: '1rem' }} />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right style={{ borderRadius: '12px', zIndex: 1050 }}>
              <DropdownItem onClick={(e) => { e.stopPropagation(); onEdit(category); }} className="py-2">
                <i className="fas fa-edit text-primary mr-2" /> <span className="small">Edit Kategori</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={(e) => { e.stopPropagation(); onDelete(category.id); }} className="py-2">
                <i className="fas fa-trash text-danger mr-2" /> <span className="small">Hapus Permanen</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

        </div>
      </CardBody>
      <style>{`
        .category-item-sidebar {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
        }
        .category-item-sidebar:hover {
          background: #f8fafc !important;
          border-color: #94a3b8 !important;
        }
        .category-item-sidebar.active {
          background: #f0f7ff !important;
          border: 2px solid #2563eb !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        .category-item-sidebar.active .font-weight-bold {
          color: #1e3a8a !important;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>


    </Card>
  );
};

export default CategoryItemCard;


