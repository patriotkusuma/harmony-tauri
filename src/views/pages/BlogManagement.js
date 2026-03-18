import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";

// Hooks
import { useBlogManagement } from "hooks/useBlogManagement";

// Organisms
import BlogHeader from "components/organisms/BlogHeader";
import BlogListSection from "components/organisms/BlogListSection";
import BlogFormSection from "components/organisms/BlogFormSection";
import BlogAiModal from "components/organisms/BlogAiModal";

const BlogManagement = () => {
  const {
    blogs, totalBlogs, currentPage, setCurrentPage, isLoading, 
    view, setView, currentBlog, formData, thumbnailFile, setThumbnailFile,
    isDragOver, setIsDragOver, aiModalOpen, setAiModalOpen,
    aiTopic, setAiTopic, aiLoading, 
    dragCounter, droppedAt,
    handleAdd, handleEdit, handleDelete, handleSubmit,
    handleChange, handleContentChange, handleGenerateAi
  } = useBlogManagement();

  const rowPerPage = 9;

  // Handle Drag & Drop events globally for the form view
  useEffect(() => {
    if (view !== 'form') return;

    const handleDragEnter = (e) => {
      e.preventDefault();
      if (Date.now() - droppedAt.current < 300) return;
      dragCounter.current += 1;
      if (dragCounter.current === 1) setIsDragOver(true);
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current = Math.max(0, dragCounter.current - 1);
      if (dragCounter.current === 0) setIsDragOver(false);
    };
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
      e.preventDefault();
      droppedAt.current = Date.now();
      dragCounter.current = 0;
      setIsDragOver(false);
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        setThumbnailFile(file);
      }
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [view, droppedAt, dragCounter, setIsDragOver, setThumbnailFile]);

  return (
    <>
      {/* 1. Header Section */}
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8 shadow-lg">
        <Container fluid>
          <BlogHeader 
            onAdd={handleAdd} 
            onAiGenerate={() => setAiModalOpen(true)}
            isListView={view === 'list'}
          />
        </Container>
      </div>

      {/* 2. Main Content Section */}
      <Container className="mt--7 px-4" fluid>
        {view === "list" ? (
          <BlogListSection 
            blogs={blogs}
            totalBlogs={totalBlogs}
            rowPerPage={rowPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        ) : (
          <BlogFormSection 
            currentBlog={currentBlog}
            formData={formData}
            handleChange={handleChange}
            handleContentChange={handleContentChange}
            handleSubmit={handleSubmit}
            onBack={() => setView("list")}
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
            isDragOver={isDragOver}
          />
        )}
      </Container>

      {/* 3. AI Modal Section */}
      <BlogAiModal 
        isOpen={aiModalOpen}
        toggle={() => setAiModalOpen(!aiModalOpen)}
        aiTopic={aiTopic}
        setAiTopic={setAiTopic}
        aiLoading={aiLoading}
        onGenerate={handleGenerateAi}
      />

      {/* Global Form View Drop Overlay */}
      {isDragOver && view === 'form' && (
        <div className="drag-overlay fade-in">
           <i className="fas fa-cloud-upload-alt fa-4x text-primary mb-3 shadow-lg p-4 bg-white rounded-circle" />
           <h2 className="text-white font-weight-bold">Lepaskan untuk Upload Thumbnail</h2>
        </div>
      )}

      <style>{`
        .bg-gradient-info { 
           background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; 
        }
        .drag-overlay {
            position: fixed; inset: 0; z-index: 9999;
            background: rgba(94, 114, 228, 0.4); backdrop-filter: blur(8px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            border: 5px dashed #fff; pointer-events: none;
        }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default BlogManagement;
