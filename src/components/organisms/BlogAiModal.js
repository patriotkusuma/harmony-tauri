import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Badge } from 'reactstrap';

const BlogAiModal = ({ isOpen, toggle, aiTopic, setAiTopic, aiLoading, onGenerate }) => {
    return (
        <Modal isOpen={isOpen} toggle={() => !aiLoading && toggle()} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <ModalHeader toggle={() => !aiLoading && toggle()} className="bg-gradient-success text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-robot fa-2x mr-3 text-white-50" />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">Asisten Menulis AI</h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Powered by Gemini AI</small>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="py-4">
                <p className="text-dark opacity-8 mb-4">
                    Tuliskan topik utama artikel yang kamu inginkan. AI akan otomatis merangkai judul, konten detail, dan optimasi SEO Meta.
                </p>
                
                <div className="bg-secondary-soft p-3 rounded-lg border mb-4">
                    <FormGroup className="mb-0">
                        <Label className="text-xs font-weight-bold text-muted ml-1">TOPIK ARTIKEL</Label>
                        <Input
                            type="text"
                            placeholder="Contoh: Tips mencuci sepatu putih agar tetap bersih..."
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !aiLoading && onGenerate()}
                            disabled={aiLoading}
                            className="border-0 shadow-none bg-transparent h4 font-weight-bold text-dark px-0"
                            autoFocus
                        />
                    </FormGroup>
                </div>

                <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                    <small className="text-muted w-100 mb-2 font-weight-bold">TOPIK POPULER:</small>
                    <Badge color="secondary" className="px-3 py-2 cursor-pointer transition-all hover-translate-up" onClick={() => setAiTopic("Tips merawat kain sutra")} style={{ border: '1px solid #dee2e6' }}>Kain Sutra</Badge>
                    <Badge color="secondary" className="px-3 py-2 cursor-pointer transition-all hover-translate-up" onClick={() => setAiTopic("Cara menghilangkan noda kopi")} style={{ border: '1px solid #dee2e6' }}>Noda Kopi</Badge>
                    <Badge color="secondary" className="px-3 py-2 cursor-pointer transition-all hover-translate-up" onClick={() => setAiTopic("Merawat boneka anak")} style={{ border: '1px solid #dee2e6' }}>Boneka</Badge>
                </div>

                {aiLoading && (
                    <div className="text-center py-5 mt-3">
                        <div className="ai-loader mx-auto mb-3" />
                        <h5 className="font-weight-bold text-success mb-1">Menyusun Draft Artikel...</h5>
                        <p className="text-xs text-muted">Proses ini memakan waktu sekitar 15-30 detik</p>
                    </div>
                )}
            </ModalBody>
            <ModalFooter className="border-0 bg-light p-3">
                <Button color="secondary" outline onClick={toggle} disabled={aiLoading} className="px-4 font-weight-bold border-0 shadow-none">
                    Batal
                </Button>
                <Button color="success" onClick={onGenerate} disabled={aiLoading || !aiTopic.trim()} className="px-5 shadow-premium font-weight-bold rounded-lg py-2">
                    {aiLoading ? (
                        <><i className="fas fa-spinner fa-spin mr-2" />Generating...</>
                    ) : (
                        <><i className="fas fa-magic mr-2" />Buat Artikel Baru</>
                    )}
                </Button>
            </ModalFooter>
            <style>{`
                .ai-loader {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(45, 206, 137, 0.1);
                    border-radius: 50%;
                    border-top-color: #2dce89;
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .bg-secondary-soft { background: rgba(0,0,0,0.02); }
            `}</style>
        </Modal>
    );
};

export default BlogAiModal;
