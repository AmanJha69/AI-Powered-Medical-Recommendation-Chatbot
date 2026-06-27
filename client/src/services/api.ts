import axios from 'axios';
import type { AuthResponse, Chat, Message, User, DoctorRecommendation } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  me: () => api.get<User>('/auth/me'),
};

export const chatApi = {
  list: () => api.get<Chat[]>('/chats'),
  create: () => api.post<Chat>('/chats'),
  get: (id: string) => api.get<{ chat: Chat; messages: Message[] }>(`/chats/${id}`),
  delete: (id: string) => api.delete(`/chats/${id}`),
  sendMessage: (id: string, content: string) =>
    api.post<{ userMessage: Message; assistantMessage: Message }>(`/chats/${id}/messages`, {
      content,
    }),
};
export const doctorApi = {
  list: (symptom?: string) => api.get<DoctorRecommendation[]>('/doctors', { params: { symptom } }),
};

export const appointmentApi = {
  book: (data: { doctorId: string; date: string; time: string }) => 
    api.post('/appointments', data),
  list: () => api.get('/appointments'),
  cancel: (id: string) => api.delete(`/appointments/${id}`),
  reschedule: (id: string, data: { date: string; time: string }) => api.put(`/appointments/${id}`, data),
};

export default api;
