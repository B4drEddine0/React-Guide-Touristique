import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL ?? '';

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

export const getN8nWebhookUrl = () => n8nWebhookUrl.trim();
