import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const STORAGE_KEY = 'bricotrust_services_catalog';
let servicesMemoryCache = null;
let pendingServicesPromise = null;

const serviceApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

serviceApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

const readCachedServices = () => {
	try {
		const rawValue = localStorage.getItem(STORAGE_KEY);
		return rawValue ? JSON.parse(rawValue) : null;
	} catch {
		return null;
	}
};

const saveCachedServices = (services) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

const normalizeService = (service) => ({
	id: service.id,
	name: service.name || '',
	description: service.description || '',
	artisan_count: service.artisans_count ?? service.artisan_count ?? 0,
});

export const fetchServices = async () => {
	if (servicesMemoryCache?.length) {
		return servicesMemoryCache;
	}

	const cachedServices = readCachedServices();

	if (cachedServices?.length) {
		servicesMemoryCache = cachedServices;
		return cachedServices;
	}

	if (!pendingServicesPromise) {
		pendingServicesPromise = serviceApi.get('/services')
			.then(({ data }) => {
				const services = (data.services ?? []).map(normalizeService);
				servicesMemoryCache = services;
				saveCachedServices(services);
				return services;
			})
			.finally(() => {
				pendingServicesPromise = null;
			});
	}

	return pendingServicesPromise;
};

export const fetchService = async (serviceId) => {
	const services = await fetchServices();
	return services.find((service) => String(service.id) === String(serviceId)) || null;
};

export const createService = async (payload) => {
	const services = await fetchServices();
	const newService = {
		id: `local-${Date.now()}`,
		name: payload.name,
		description: payload.description || '',
		artisan_count: 0,
	};

	const updatedServices = [newService, ...services];
	saveCachedServices(updatedServices);
	return newService;
};

export const updateService = async (serviceId, payload) => {
	const services = await fetchServices();
	const updatedServices = services.map((service) => (
		String(service.id) === String(serviceId)
			? {
					...service,
					name: payload.name,
					description: payload.description || '',
				}
			: service
	));

	saveCachedServices(updatedServices);
	return updatedServices.find((service) => String(service.id) === String(serviceId)) || null;
};

export const deleteService = async (serviceId) => {
	const services = await fetchServices();
	const updatedServices = services.filter((service) => String(service.id) !== String(serviceId));
	saveCachedServices(updatedServices);
	return true;
};
