import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const reportApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

reportApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const fetchReports = async (params = {}) => {
	const { data } = await reportApi.get('/admin/reports', { params });
	return data;
};

export const createReport = async (payload) => {
	const { data } = await reportApi.post('/reports', payload);
	return data;
};

export const resolveReport = async (reportId) => {
	const { data } = await reportApi.patch(`/admin/reports/${reportId}/resolve`);
	return data;
};
