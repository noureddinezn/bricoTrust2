import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const adminApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const fetchAdminDashboardStats = async () => {
	const { data } = await adminApi.get('/admin/dashboard');
	return data.data;
};

export const fetchPendingArtisans = async (params = {}) => {
	const { data } = await adminApi.get('/admin/artisans/pending', { params });
	return data.data;
};

export const approveArtisan = async (artisanId) => {
	const { data } = await adminApi.post(`/admin/artisans/${artisanId}/approve`);
	return data.data;
};

export const banArtisan = async (artisanId) => {
	const { data } = await adminApi.post(`/admin/artisans/${artisanId}/ban`);
	return data.data;
};

export const fetchUsers = async (params = {}) => {
	const { data } = await adminApi.get('/admin/users', { params });
	return data.data;
};
