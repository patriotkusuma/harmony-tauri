import axios from "axios";
import { loginRedirectPath } from "./runtime";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://go.harmonylaundry.my.id/",
})

instance.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        const selectedOutlet = localStorage.getItem("selected-outlet");
        if (selectedOutlet) {
            try {
                const parsed = JSON.parse(selectedOutlet);
                config.headers["X-Outlet-Id"] = parsed.id || parsed;
            } catch (e) {
                config.headers["X-Outlet-Id"] = selectedOutlet;
            }
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
