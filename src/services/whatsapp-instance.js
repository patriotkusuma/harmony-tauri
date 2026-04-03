import axios from "axios";
import { loginRedirectPath } from "./runtime";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://go.harmonylaundry.my.id/";
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

export const whatsappInstance = axios.create({
    baseURL: `${baseUrl}api/v2/whatsapp/`,
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
