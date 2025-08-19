import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expirado, inválido o sin permisos
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Forzar recarga de la página para redirigir al login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  register: async (username, password) => {
    const response = await api.post('/users', { username, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  saveToken: (token) => {
    localStorage.setItem('token', token);
  },

  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Servicios de noticias
export const newsService = {
  getTechNews: async () => {
    const response = await api.get('/news/technology');
    return response.data;
  }
};

export default api;
