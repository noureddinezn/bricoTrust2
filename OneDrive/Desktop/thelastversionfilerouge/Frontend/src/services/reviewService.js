import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const reviewApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

reviewApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const createReview = async (payload) => {
	const { data } = await reviewApi.post('/reviews', payload);
	return data;
};
