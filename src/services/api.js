import axios from "axios";

// Cấu hình URL gốc cho JSON Server
const BASE_URL = "http://localhost:3000";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Các API liên quan đến người dùng
export const userAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },
  createUser: async (data) => {
    try {
      const response = await api.post("/users", data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      throw error;
    }
  },
  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },
};

// Các API liên quan đến tin tức
export const newsAPI = {
  getAllNews: async () => {
    try {
      const response = await api.get("/news");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tin tức:", error);
      throw error;
    }
  },
  createNews: async (data) => {
    try {
      const response = await api.post("/news", data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo tin tức:", error);
      throw error;
    }
  },
  updateNews: async (id, data) => {
    try {
      const response = await api.put(`/news/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật tin tức:", error);
      throw error;
    }
  },
  deleteNews: async (id) => {
    try {
      await api.delete(`/news/${id}`);
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error);
      throw error;
    }
  },
};

// Các API liên quan đến bài viết (posts)
export const postAPI = {
  // Lấy tất cả bài viết
  getAllPosts: async () => {
    try {
      const response = await api.get("/posts");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài viết:", error);
      throw error;
    }
  },

  // Tạo bài viết mới
  createPost: async (data) => {
    try {
      const response = await api.post("/posts", data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      throw error;
    }
  },

  // Cập nhật bài viết
  updatePost: async (id, data) => {
    try {
      const response = await api.put(`/posts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      throw error;
    }
  },

  // Xóa bài viết
  deletePost: async (id) => {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      throw error;
    }
  },
};

// Các API liên quan đến đàn lợn
export const pigAPI = {
  getAllPigs: async () => {
    try {
      const response = await api.get("/pigs");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đàn lợn:", error);
      throw error;
    }
  },
  createPig: async (data) => {
    try {
      const response = await api.post("/pigs", data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm lợn:", error);
      throw error;
    }
  },
  updatePig: async (id, data) => {
    try {
      const response = await api.put(`/pigs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin lợn:", error);
      throw error;
    }
  },
  deletePig: async (id) => {
    try {
      await api.delete(`/pigs/${id}`);
    } catch (error) {
      console.error("Lỗi khi xóa lợn:", error);
      throw error;
    }
  },
};

// Các API liên quan đến chuồng nuôi
export const barnAPI = {
  getAllBarns: async () => {
    try {
      const response = await api.get("/barn");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuồng nuôi:", error);
      throw error;
    }
  },
  createBarn: async (data) => {
    try {
      const response = await api.post("/barn", data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm chuồng nuôi:", error);
      throw error;
    }
  },
  updateBarn: async (id, data) => {
    try {
      const response = await api.put(`/barn/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin chuồng nuôi:", error);
      throw error;
    }
  },
  deleteBarn: async (id) => {
    try {
      await api.delete(`/barn/${id}`);
    } catch (error) {
      console.error("Lỗi khi xóa chuồng nuôi:", error);
      throw error;
    }
  },
};
