import React, { useState, useRef, useEffect } from "react";
import { Button } from "reactstrap";

const ImagePicker = ({ currentImage, onImageSelect, label = "Upload Gambar" }) => {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const triggerInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-picker-container text-center">
      <div 
        className={`image-preview mb-3 mx-auto d-flex align-items-center justify-content-center overflow-hidden position-relative ${isDragging ? 'dragging' : ''}`}
        style={{ 
          width: 150, 
          height: 150, 
          borderRadius: '20px', 
          background: isDragging ? '#eef2ff' : '#f8fafc',
          border: isDragging ? '2px solid #3b82f6' : '2px dashed #cbd5e1',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: isDragging ? 'scale(1.05)' : 'scale(1)'
        }}
        onClick={triggerInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div className="text-center p-3 animate__animated animate__pulse animate__infinite">
             <i className={`fas ${isDragging ? 'fa-cloud-upload-alt text-primary' : 'fa-camera text-muted'} mb-2`} style={{ fontSize: '1.5rem' }} />
             <div className={`small font-weight-bold ${isDragging ? 'text-primary' : 'text-muted'}`}>
                {isDragging ? "Lepas untuk Taruh" : label}
             </div>
          </div>
        )}
        
        {preview && !isDragging && (
          <div className="image-overlay position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.2s' }}>
             <i className="fas fa-edit text-white" />
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
      
      {preview && (
        <Button color="link" size="sm" className="text-danger p-0" onClick={() => { setPreview(null); onImageSelect(null); }}>
          Hapus Gambar
        </Button>
      )}

      <style>{`
        .image-preview:hover .image-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ImagePicker;
