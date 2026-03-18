import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { getBlogs, createBlog, updateBlog, deleteBlog, generateAiBlog } from "../services/api/blog";
import Swal from "sweetalert2";

export const useBlogManagement = (rowPerPage = 9) => {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" or "form"
  const [currentBlog, setCurrentBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    meta_title: "",
    meta_desc: "",
    status: "draft",
    content: "",
  });
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // AI Generate State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Drag & Drop Helpers
  const dragCounter = useRef(0);
  const droppedAt = useRef(0);

  const fetchData = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getBlogs({ 
        limit: rowPerPage, 
        offset: (page - 1) * rowPerPage 
      });
      setBlogs(response.data || []);
      setTotalBlogs(response.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data blog");
    } finally {
      setIsLoading(false);
    }
  }, [rowPerPage]);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handleAdd = () => {
    setCurrentBlog(null);
    setFormData({
      title: "",
      meta_title: "",
      meta_desc: "",
      status: "draft",
      content: "",
    });
    setThumbnailFile(null);
    setIsDragOver(false);
    setView("form");
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title || "",
      meta_title: blog.meta_title || "",
      meta_desc: blog.meta_desc || "",
      status: blog.status || "draft",
      content: blog.content || "",
    });
    setThumbnailFile(null);
    setIsDragOver(false);
    setView("form");
  };

  const handleGenerateAi = async () => {
    if (!aiTopic.trim()) {
      toast.warning("Topik wajib diisi!");
      return;
    }
    setAiLoading(true);
    const id = toast.loading("🤖 AI sedang membuat artikel...");
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await generateAiBlog({ user_id: user.id || 1, topic: aiTopic });
      toast.update(id, {
        render: `✅ Draft "${res.data?.title}" berhasil dibuat!`,
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
      setAiModalOpen(false);
      setAiTopic("");
      fetchData(currentPage);
    } catch (err) {
      console.error(err);
      toast.update(id, {
        render: "❌ Gagal generate AI. Cek GEMINI_API_KEY di server.",
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data blog yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fe3434',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const loadingId = toast.loading("Sedang menghapus...");
        await deleteBlog(id);
        toast.update(loadingId, { render: "Berhasil dihapus", type: "success", isLoading: false, autoClose: 3000 });
        fetchData(currentPage);
      } catch (err) {
        toast.error("Gagal menghapus blog");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (html) => {
    setFormData((prev) => ({
      ...prev,
      content: html
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title) {
      toast.warning("Judul blog wajib diisi");
      return;
    }

    const submitData = new FormData();
    submitData.append("user_id", 1);
    submitData.append("title", formData.title);
    submitData.append("meta_title", formData.meta_title);
    submitData.append("meta_desc", formData.meta_desc);
    submitData.append("status", formData.status);
    submitData.append("content", formData.content);
    if (thumbnailFile) {
      submitData.append("thumbnail", thumbnailFile);
    }

    try {
      const loadingId = toast.loading("Sedang menyimpan...");
      if (currentBlog) {
        await updateBlog(currentBlog.id, submitData);
        toast.update(loadingId, { render: "Berhasil diperbarui", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        await createBlog(submitData);
        toast.update(loadingId, { render: "Berhasil dibuat", type: "success", isLoading: false, autoClose: 3000 });
      }
      setView("list");
      fetchData(currentPage);
    } catch (err) {
      toast.error("Gagal menyimpan blog");
    }
  };

  return {
    blogs, totalBlogs, currentPage, setCurrentPage, isLoading, 
    view, setView, currentBlog, formData, thumbnailFile, setThumbnailFile,
    isDragOver, setIsDragOver, aiModalOpen, setAiModalOpen,
    aiTopic, setAiTopic, aiLoading, 
    dragCounter, droppedAt,
    handleAdd, handleEdit, handleDelete, handleSubmit,
    handleChange, handleContentChange, handleGenerateAi, fetchData
  };
};
