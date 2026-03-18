import axios from "../axios-instance";

export const getBlogs = async (params = {}) => {
  const response = await axios.get("api/v2/blogs", { params });
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await axios.get(`api/v2/blogs/${id}`);
  return response.data;
};

export const createBlog = async (formData) => {
  const response = await axios.post("api/v2/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const updateBlog = async (id, formData) => {
  const response = await axios.put(`api/v2/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await axios.delete(`api/v2/blogs/${id}`);
  return response.data;
};

export const uploadBlogImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const response = await axios.post(`api/v2/blogs/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  // Should return { url: "/uploads/..." }
  return response.data;
};

export const generateAiBlog = async ({ user_id, topic }) => {
  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("topic", topic);

  const response = await axios.post("api/v2/blogs/generate-ai", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};
