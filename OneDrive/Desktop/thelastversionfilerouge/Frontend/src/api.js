import axios from 'axios';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => Boolean(getToken());

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const resolveAssetUrl = (path) => {
  if (!path) {
    return '';
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_ASSET_URL || 'http://127.0.0.1:8000';
  const normalizedPath = String(path).replace(/^\/+/, '');

  return `${baseUrl}/storage/${normalizedPath}`;
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const updateStoredUser = (updater) => {
  const currentUser = getUser();

  if (!currentUser) {
    return null;
  }

  const nextUser = typeof updater === 'function' ? updater(currentUser) : updater;
  setUser(nextUser);

  return nextUser;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/user');
  setUser(data);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post('/login', payload);
  setToken(data.token);
  setUser(data.user);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post('/register', payload);
  setToken(data.token);
  setUser(data.user);
  return data;
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    if (error?.response?.status !== 401) {
      throw error;
    }
  } finally {
    clearAuth();
  }
};

export const fetchAdminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};
