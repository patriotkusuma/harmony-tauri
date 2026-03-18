import axios from "axios";
import { loginRedirectPath } from "./runtime";

export const whatsappInstance = axios.create({
    baseURL: "https://wa2.harmonylaundry.my.id/",
});

whatsappInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

whatsappInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("outlet");
            const isLoginPage = window.location.hash.includes('/auth/login') || window.location.pathname.includes('/auth/login');
            if (!isLoginPage) {
                window.location.href = loginRedirectPath();
            }
        }
        return Promise.reject(error);
    }
);
