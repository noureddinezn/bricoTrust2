import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const artisanApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
	},
	withCredentials: true,
});

artisanApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

const toFormData = (payload) => {
	const formData = new FormData();

	Object.entries(payload).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') {
			return;
		}

		if (Array.isArray(value)) {
			value.forEach((item) => formData.append(`${key}[]`, item));
			return;
		}

		formData.append(key, value);
	});

	return formData;
};

export const fetchArtisans = async (params = {}) => {
	const { data } = await artisanApi.get('/artisans', { params });
	return data.data;
};

export const fetchArtisanDetails = async (artisanId) => {
	const { data } = await artisanApi.get(`/artisans/${artisanId}`);
	return data.data;
};

export const fetchLeaderboard = async (params = {}) => {
	const { data } = await artisanApi.get('/leaderboard', { params });
	return data.data;
};

export const fetchServices = async () => {
	const { data } = await artisanApi.get('/services');
	return data.data ?? data;
};

export const fetchArtisanEditData = async () => {
	const { data } = await artisanApi.get('/artisan/profile/edit');
	return data.data;
};

export const fetchMyArtisanProfile = async () => {
	const { data } = await artisanApi.get('/artisan/profile');
	return data.data;
};

export const updateArtisanProfile = async (payload) => {
	const formData = toFormData({ ...payload, _method: 'PUT' });
	const { data } = await artisanApi.post('/artisan/profile', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return data.data;
};
