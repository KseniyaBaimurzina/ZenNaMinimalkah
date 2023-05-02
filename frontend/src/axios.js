import axios from "axios";

const apiUrl = process.env.REACT_APP_SERVER_URL;
const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("temitope");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

export default api;