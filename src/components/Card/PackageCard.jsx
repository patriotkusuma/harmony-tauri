import { Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle, Col } from "reactstrap"
import RupiahFormater from "utils/RupiahFormater"
import { formatImageUrl } from "utils/formatImageUrl"

const PackageCard = ({ paket, isAddedToCart, onAddCart }) => {
    return (
        <Card 
            className={`package-card h-100 shadow-sm border-0 rounded-xl overflow-hidden transition-all hover-elevate-2 ${isAddedToCart ? "ring-4 ring-primary" : ""}`}
            onClick={() => onAddCart(paket.id)}
            style={{ cursor: 'pointer' }}
        >
            <div className="position-relative">
                <CardImg 
                    top
                    src={formatImageUrl(paket.gambar) || "https://images.unsplash.com/photo-1545173153-5dd9215c6f3d?q=80&w=400&auto=format&fit=crop"} 
                    alt={paket.nama} 
                    style={{ aspectRatio: '1/1', objectFit: 'cover', width: '100%' }}
                />
                {isAddedToCart && (
                    <div className="card-overlay-indicator animate-bounce-in d-flex align-items-center justify-content-center">
                        <i className="fas fa-check-circle text-white fa-2x shadow-lg"></i>
                    </div>
                )}
                <div className="price-badge-floating">
                    <RupiahFormater value={paket.harga} />
                </div>
            </div>
            <CardBody className="p-3 d-flex flex-column text-center">
                <h5 className="font-weight-900 text-dark mb-1 text-truncate">{paket.nama}</h5>
                <CardText className="text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                    {paket.keterangan || "-"}
                </CardText>
                <Button 
                    color={isAddedToCart ? "primary" : "outline-primary"} 
                    size="sm" 
                    className="rounded-pill font-weight-bold shadow-none"
                >
                    {isAddedToCart ? "DITAMBAHKAN" : "PILIH PAKET"}
                </Button>
            </CardBody>
            <style>{`
                .package-card { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); background: #fff; }
                .hover-elevate-2:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
                .card-overlay-indicator {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(94, 114, 228, 0.6);
                    backdrop-filter: blur(2px);
                    z-index: 2;
                }
                .price-badge-floating {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 900;
                    font-size: 0.75rem;
                    color: #5e72e4;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 3;
                }
                .ring-4 { box-shadow: 0 0 0 4px #5e72e4 !important; }
                .animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </Card>
    );
}

export default PackageCard