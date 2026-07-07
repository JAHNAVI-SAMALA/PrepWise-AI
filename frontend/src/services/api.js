import axios from "axios";

// In production the frontend is served by Flask itself (same origin),
// so baseURL is empty. In dev, Vite proxy forwards to Flask on 5000.
const api = axios.create({
    baseURL: "",
});

// Attach session ID header to every request if we have one
api.interceptors.request.use((config) => {
    const sid = sessionStorage.getItem("prepwise_sid");
    if (sid) {
        config.headers["X-Session-ID"] = sid;
    }
    return config;
});

export default api;