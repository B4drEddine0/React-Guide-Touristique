import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'https://guide-touristique-api.onrender.com';

export const localApi = axios.create({
  baseURL: apiBaseUrl,
});

export const authApi = axios.create({
  baseURL: 'https://dummyjson.com',
});

localApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
