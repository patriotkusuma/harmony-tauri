import axios from "axios";
import { loginRedirectPath } from "./runtime";

const instance = axios.create({
    // baseURL: "https://harmony.test/api/",
    // baseURL: "https://admin.harmonylaundry.my.id/api/",
    // baseURL: "https://api.harmonylaundry.my.id/",
    // baseURL: "http://192.168.1.65:3015/",
    baseURL: "https://go.harmonylaundry.my.id/"
    // baseURL: "https://dashboard.harmonylaundry.my.id/api/",
    // baseURL: "https://admin.jutra.my.id/api/",
    // baseURL: "https://silaundry.my.id/api/",
    // timeout: 1000,
})

instance.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401){
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("outlet")

            // Jika sudah di halaman login, jangan redirect lagi agar tidak looping
            const isLoginPage = window.location.hash.includes('/auth/login') || window.location.pathname.includes('/auth/login');
            
            if (!isLoginPage) {
                // Gunakan path yang kompatibel dengan HashRouter (Electron) dan BrowserRouter (Web)
                window.location.href = loginRedirectPath();
            }
        }

        return Promise.reject(error)
    }
)

export default instance;
