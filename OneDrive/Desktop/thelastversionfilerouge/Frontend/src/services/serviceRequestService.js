import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const serviceRequestApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

serviceRequestApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const fetchServiceRequestCreateData = async (artisanId) => {
	const { data } = await serviceRequestApi.get(`/service-requests/create/${artisanId}`);
	return data;
};

export const createServiceRequest = async (payload) => {
	const { data } = await serviceRequestApi.post('/service-requests', payload);
	return data;
};

export const fetchClientServiceRequests = async () => {
	const { data } = await serviceRequestApi.get('/service-requests/client');
	return data;
};

export const fetchArtisanServiceRequests = async () => {
	const { data } = await serviceRequestApi.get('/service-requests/artisan');
	return data;
};

export const updateServiceRequestStatus = async (serviceRequestId, payload) => {
	const { data } = await serviceRequestApi.patch(`/service-requests/${serviceRequestId}/status`, payload);
	return data;
};
