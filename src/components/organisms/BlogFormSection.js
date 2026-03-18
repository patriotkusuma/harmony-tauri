import React, { useRef } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, FormGroup, Label, Input } from 'reactstrap';
import TipTapEditor from '../TipTapEditor';

const BlogFormSection = ({ 
    currentBlog, 
    formData, 
    handleChange, 
    handleContentChange, 
    handleSubmit, 
    onBack,
    thumbnailFile,
    setThumbnailFile,
    isDragOver
}) => {
    const thumbnailInputRef = useRef(null);

    return (
        <Card className="shadow-premium border-0 glass-card">
            <CardHeader className="bg-transparent border-0 py-4">
                <Row className="align-items-center">
                    <Col>
                        <h3 className="mb-0 text-dark font-weight-bold">
                            <i className="fas fa-edit mr-2 text-primary" />
                            {currentBlog ? "Edit Artikel" : "Tulis Artikel Baru"}
                        </h3>
                    </Col>
                    <Col className="text-right">
                        <Button color="secondary" outline onClick={onBack} size="sm" className="px-4 font-weight-bold rounded-pill">
                            <i className="fas fa-arrow-left mr-2" />
                            Kembali
                        </Button>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <Row>
                        {/* MAIN CONTENT COLUMN */}
                        <Col lg="8">
                            <FormGroup className="mb-4">
                                <Label className="text-muted text-xs font-weight-bold ml-1">JUDUL ARTIKEL</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Tulis judul yang menarik..."
                                    className="form-control-alternative border-0 shadow-sm py-4 h1 font-weight-bold"
                                    style={{ borderRadius: '12px', fontSize: '1.5rem' }}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="text-muted text-xs font-weight-bold ml-1">KONTEN ARTIKEL</Label>
                                <div className="border-0 shadow-sm rounded-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                                    <TipTapEditor value={formData.content} onChange={handleContentChange} />
                                </div>
                            </FormGroup>
                        </Col>

                        {/* SETTINGS COLUMN */}
                        <Col lg="4">
                            {/* PUBLISH SETTINGS */}
                            <Card className="shadow-none border-0 bg-secondary-soft mb-4" style={{ borderRadius: '15px' }}>
                                <CardBody className="p-4">
                                    <h5 className="text-dark font-weight-bold mb-4 opacity-8 text-uppercase ls-1">Publikasi</h5>
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold">STATUS</Label>
                                        <Input type="select" name="status" value={formData.status} onChange={handleChange} className="border-0 shadow-sm rounded-lg font-weight-bold">
                                            <option value="draft">📁 Draft</option>
                                            <option value="publish">🚀 Publish</option>
                                        </Input>
                                    </FormGroup>
                                </CardBody>
                            </Card>

                            {/* THUMBNAIL SETTINGS */}
                            <Card className="shadow-none border-0 bg-secondary-soft mb-4" style={{ borderRadius: '15px' }}>
                                <CardBody className="p-4">
                                    <h5 className="text-dark font-weight-bold mb-4 opacity-8 text-uppercase ls-1">Featured Image</h5>
                                    <div
                                        onClick={() => thumbnailInputRef.current && thumbnailInputRef.current.click()}
                                        className={`thumbnail-dropzone p-3 transition-all ${isDragOver ? 'active' : ''}`}
                                        style={{
                                            border: '2px dashed #adb5bd',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            background: '#fff',
                                            minHeight: '200px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        {(thumbnailFile || currentBlog?.thumbnail) ? (
                                            <>
                                                <img
                                                    src={
                                                        thumbnailFile
                                                            ? URL.createObjectURL(thumbnailFile)
                                                            : (currentBlog.thumbnail.startsWith('http')
                                                                ? currentBlog.thumbnail
                                                                : `https://go.harmonylaundry.my.id${currentBlog.thumbnail}`)
                                                    }
                                                    alt="Thumbnail Preview"
                                                    style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                                <Button 
                                                    type="button" 
                                                    color="danger" 
                                                    size="sm" 
                                                    className="rounded-circle mt-3 btn-icon-only shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setThumbnailFile(null);
                                                    }}
                                                >
                                                    <i className="fas fa-times" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt fa-3x text-light opacity-6 mb-3" />
                                                <p className="text-xs text-center text-muted m-0">Drag & drop gambar atau <span className="text-primary font-weight-bold">pilih file</span></p>
                                            </>
                                        )}
                                        <input
                                            ref={thumbnailInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="d-none"
                                            onChange={(e) => {
                                                const file = e.target.files && e.target.files[0];
                                                if (file) setThumbnailFile(file);
                                            }}
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            {/* SEO SETTINGS */}
                            <Card className="shadow-none border-0 bg-secondary-soft mb-4" style={{ borderRadius: '15px' }}>
                                <CardBody className="p-4">
                                    <h5 className="text-dark font-weight-bold mb-4 opacity-8 text-uppercase ls-1">SEO Metadata</h5>
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold">META TITLE</Label>
                                        <Input
                                            type="text"
                                            name="meta_title"
                                            value={formData.meta_title}
                                            onChange={handleChange}
                                            placeholder="SEO title..."
                                            className="border-0 shadow-sm rounded-lg"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold">META DESCRIPTION</Label>
                                        <Input
                                            type="textarea"
                                            name="meta_desc"
                                            value={formData.meta_desc}
                                            onChange={handleChange}
                                            placeholder="Tulis deskripsi singkat untuk Google..."
                                            className="border-0 shadow-sm rounded-lg"
                                            rows="4"
                                        />
                                    </FormGroup>
                                </CardBody>
                            </Card>

                            <Button color="primary" block size="lg" type="submit" className="shadow-premium py-3 font-weight-bold rounded-lg mt-2">
                                <i className="fas fa-save mr-2" />
                                {currentBlog ? "Simpan Perubahan" : "Publikasikan Artikel"}
                            </Button>
                        </Col>
                    </Row>
                </form>
            </CardBody>
            <style>{`
                .bg-secondary-soft { background: rgba(0,0,0,0.02); }
                .thumbnail-dropzone.active { border-color: #5e72e4; background: rgba(94,114,228,0.05); }
            `}</style>
        </Card>
    );
};

export default BlogFormSection;
