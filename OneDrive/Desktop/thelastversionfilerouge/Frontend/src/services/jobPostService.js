import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const jobPostApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
	},
	withCredentials: true,
});

jobPostApi.interceptors.request.use((config) => {
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

export const fetchJobPosts = async (params = {}) => {
	const { data } = await jobPostApi.get('/job-posts', { params });
	return data.data;
};

export const fetchMyJobPosts = async (params = {}) => {
	const { data } = await jobPostApi.get('/job-posts/client', { params });
	return data.data;
};

export const fetchJobPost = async (jobPostId) => {
	const { data } = await jobPostApi.get(`/job-posts/${jobPostId}`);
	return data.data;
};

export const fetchJobPostEditData = async (jobPostId) => {
	const { data } = await jobPostApi.get(`/job-posts/${jobPostId}/edit`);
	return data.data;
};

export const createJobPost = async (payload) => {
	const formData = toFormData(payload);
	const { data } = await jobPostApi.post('/job-posts', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return data.data;
};

export const updateJobPost = async (jobPostId, payload) => {
	const formData = toFormData({ ...payload, _method: 'PUT' });
	const { data } = await jobPostApi.post(`/job-posts/${jobPostId}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return data.data;
};

export const deleteJobPost = async (jobPostId) => {
	const { data } = await jobPostApi.delete(`/job-posts/${jobPostId}`);
	return data;
};

export const addJobPostComment = async (jobPostId, payload) => {
	const { data } = await jobPostApi.post(`/job-posts/${jobPostId}/comments`, payload);
	return data.data;
};
