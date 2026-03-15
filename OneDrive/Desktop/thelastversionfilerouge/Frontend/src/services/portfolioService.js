import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const portfolioApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
	},
	withCredentials: true,
});

portfolioApi.interceptors.request.use((config) => {
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

		formData.append(key, value);
	});

	return formData;
};

export const fetchArtisanPortfolio = async (artisanId) => {
	const { data } = await portfolioApi.get(`/artisans/${artisanId}/portfolio`);
	return data.data;
};

export const fetchPortfolioItem = async (portfolioId) => {
	const { data } = await portfolioApi.get(`/portfolios/${portfolioId}`);
	return data.data;
};

export const createPortfolioItem = async (payload) => {
	const formData = toFormData(payload);
	const { data } = await portfolioApi.post('/portfolios', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return data.data;
};

export const updatePortfolioItem = async (portfolioId, payload) => {
	const formData = toFormData({ ...payload, _method: 'PUT' });
	const { data } = await portfolioApi.post(`/portfolios/${portfolioId}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return data.data;
};

export const deletePortfolioItem = async (portfolioId) => {
	const { data } = await portfolioApi.delete(`/portfolios/${portfolioId}`);
	return data;
};

export const addPortfolioComment = async (portfolioId, payload) => {
	const { data } = await portfolioApi.post(`/portfolios/${portfolioId}/comments`, payload);
	return data.data;
};
