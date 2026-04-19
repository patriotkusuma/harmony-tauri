import React, { useEffect, useState, useRef } from "react";
import { Modal, ModalHeader, ModalBody, Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useOrder } from "hooks/useOrder";

const OrderScannerModal = () => {
    const { isScannerModalOpen, toggleScannerModal, pickupByBarcode } = useOrder();
    const [manualCode, setManualCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        if (isScannerModalOpen) {
            // Delay a bit to ensure the modal container is rendered
            const timer = setTimeout(() => {
                try {
                    const scanner = new Html5QrcodeScanner("reader", { 
                        fps: 10, 
                        qrbox: { width: 250, height: 250 },
                        formatsToSupport: [ 
                            Html5QrcodeSupportedFormats.QR_CODE, 
                            Html5QrcodeSupportedFormats.CODE_128,
                            Html5QrcodeSupportedFormats.CODE_39
                        ],
                        rememberLastUsedCamera: true,
                        // Set aspect ratio to roughly 4:3 for common webcams
                        aspectRatio: 1.333334
                    });

                    scanner.render(onScanSuccess, onScanError);
                    scannerRef.current = scanner;
                } catch (err) {
                    console.error("Scanner initialization failed", err);
                }
            }, 500);
            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(err => console.log("Cleanup scanner error", err));
                    scannerRef.current = null;
                }
            };
        }
    }, [isScannerModalOpen]);

    const onScanSuccess = async (decodedText) => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        // We trigger the pickup logic. The backend will handle the MQTT beep bypass.
        const success = await pickupByBarcode(decodedText);
        
        if (success) {
            // Optional: sound or visual feedback here if needed
        }
        
        // Wait a bit before allowing next scan to prevent double processing the same barcode
        setTimeout(() => setIsProcessing(false), 3000);
    };

    const onScanError = (err) => {
        // Quiet mode for standard non-detections
    };

    const handleManualSubmit = async () => {
        if (!manualCode || isProcessing) return;
        setIsProcessing(true);
        await pickupByBarcode(manualCode);
        setManualCode("");
        setIsProcessing(false);
    };

    return (
        <Modal 
          isOpen={isScannerModalOpen} 
          toggle={toggleScannerModal} 
          centered 
          size="md"
          contentClassName="border-0 shadow-lg"
        >
            <ModalHeader toggle={toggleScannerModal} className="border-bottom-0 pb-0">
                <div className="d-flex align-items-center">
                    <div className="icon icon-shape bg-info-light text-info rounded-circle me-3">
                        <i className="fas fa-qrcode fs-4" />
                    </div>
                    <div>
                        <h3 className="mb-0 fw-bold text-dark">Scan Pickup</h3>
                        <p className="text-muted small mb-0">Arahkan nota ke kamera kasir</p>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="pt-4">
                <div id="scanner-view-container" className="position-relative bg-dark rounded-3 overflow-hidden shadow-inner" style={{ minHeight: '320px' }}>
                    <div id="reader" style={{ width: '100%', border: 'none' }}></div>
                    {isProcessing && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-75 z-index-10">
                          <div className="spinner-border text-info mb-2" role="status"></div>
                          <span className="text-white fw-600">Memproses...</span>
                      </div>
                    )}
                </div>

                <div className="mt-4 p-3 bg-secondary rounded-3">
                    <label className="form-control-label text-muted text-uppercase ls-1 d-block mb-3 small font-weight-bold">Input Manual (Alt+P)</label>
                    <InputGroup className="bg-white border shadow-sm rounded-pill overflow-hidden p-1">
                        <InputGroupText className="bg-transparent border-0 ps-3">
                            <i className="fas fa-keyboard text-muted" />
                        </InputGroupText>
                        <Input 
                            placeholder="Ketik Kode Pesan / Scan Barcode..." 
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                            className="border-0 shadow-none ps-1"
                            disabled={isProcessing}
                            autoFocus
                            id="manual-pickup-input"
                        />
                        <Button 
                            color="info" 
                            className="rounded-pill px-4 ms-2" 
                            onClick={handleManualSubmit}
                            disabled={isProcessing || !manualCode}
                        >
                            Proses
                        </Button>
                    </InputGroup>
                </div>
                
                <div className="text-center mt-3">
                    <p className="text-muted x-small">
                        <i className="fas fa-info-circle me-1" />
                        Pastikan pencahayaan cukup untuk hasil scan terbaik.
                    </p>
                </div>
            </ModalBody>

            <style>{`
                .bg-info-light { background-color: rgba(17, 205, 239, 0.1); }
                .fw-600 { font-weight: 600; }
                .x-small { font-size: 0.75rem; }
                .z-index-10 { z-index: 10; }
                
                /* html5-qrcode UI overrides */
                #reader { border: none !important; }
                #reader video { 
                    border-radius: 8px; 
                    object-fit: cover !important;
                }
                #reader__dashboard_section_csr button {
                    background: #11cdef !important;
                    border: none !important;
                    border-radius: 30px !important;
                    padding: 8px 20px !important;
                    color: white !important;
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    margin-top: 10px !important;
                    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08) !important;
                }
                #reader__dashboard_section_swaplink {
                    color: #525f7f !important;
                    font-size: 12px !important;
                    text-decoration: none !important;
                }
                #reader__camera_selection {
                    padding: 5px !important;
                    border-radius: 5px !important;
                    border: 1px solid #dee2e6 !important;
                    font-size: 13px !important;
                }
            `}</style>
        </Modal>
    );
};

export default OrderScannerModal;
