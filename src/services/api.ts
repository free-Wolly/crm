import axios from 'axios';
import { Employee, User } from '../interfaces';

const API_BASE_URL = 'http://localhost:3005';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/users/login', { email, password });
  console.log('API login response:', response.data); // Add this line
  return response.data;
};

export const register = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await api.post('/api/users/register', user);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const fetchEmployees = async () => {
  const response = await api.get('/api/employees');
  return response.data;
};

export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const response = await api.post('/api/employees', employee);
  return response.data;
};

export default api;