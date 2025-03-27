import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL_DEV}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
