import { computed, reactive, ref } from 'vue';
import {
	fetchArtisanEditData,
	fetchArtisanDetails,
	fetchArtisans,
	fetchMyArtisanProfile,
	updateArtisanProfile,
} from '../services/artisanService';
import { fetchServices } from '../services/serviceService';
import { getUser, isAuthenticated, resolveAssetUrl, updateStoredUser } from '../api';

const extractErrorMessage = (error, fallbackMessage) => error?.response?.data?.message || fallbackMessage;

const extractValidationErrors = (error) => {
	const errors = error?.response?.data?.errors;

	if (!errors || typeof errors !== 'object') {
		return [];
	}

	return Object.values(errors).flat();
};

export const useArtisanDirectory = () => {
	const artisans = ref([]);
	const services = ref([]);
	const loading = ref(false);
	const error = ref('');

	const filters = reactive({
		name: '',
		service: '',
		city: '',
		district: '',
	});

	const pagination = reactive({
		currentPage: 1,
		lastPage: 1,
		perPage: 9,
		total: 0,
	});

	const loadServices = async () => {
		services.value = await fetchServices();
	};

	const loadArtisans = async (page = 1) => {
		loading.value = true;
		error.value = '';

		try {
			const pageData = await fetchArtisans({
				...filters,
				page,
			});

			artisans.value = pageData.data ?? [];
			pagination.currentPage = pageData.current_page ?? 1;
			pagination.lastPage = pageData.last_page ?? 1;
			pagination.perPage = pageData.per_page ?? 9;
			pagination.total = pageData.total ?? 0;
		} catch (caughtError) {
			error.value = extractErrorMessage(caughtError, 'Unable to load artisans.');
			artisans.value = [];
		} finally {
			loading.value = false;
		}
	};

	const resetFilters = async () => {
		filters.name = '';
		filters.service = '';
		filters.city = '';
		filters.district = '';
		await loadArtisans(1);
	};

	return {
		artisans,
		services,
		loading,
		error,
		filters,
		pagination,
		loadServices,
		loadArtisans,
		resetFilters,
	};
};

export const useArtisanDetails = (artisanId) => {
	const artisan = ref(null);
	const loading = ref(false);
	const error = ref('');

	const loadArtisan = async () => {
		loading.value = true;
		error.value = '';

		try {
			const payload = await fetchArtisanDetails(artisanId);
			artisan.value = payload.artisan;
		} catch (caughtError) {
			const currentUser = getUser();
			const canTryOwnProfileFallback =
				isAuthenticated() &&
				currentUser?.role === 'artisan' &&
				(
					!currentUser?.artisan?.id ||
					String(currentUser.artisan.id) === String(artisanId)
				);

			if (canTryOwnProfileFallback) {
				try {
					const payload = await fetchMyArtisanProfile();
					const ownArtisan = payload.artisan;

					if (!artisanId || String(ownArtisan?.id) === String(artisanId) || !currentUser?.artisan?.id) {
						artisan.value = ownArtisan;
						return;
					}
				} catch (fallbackError) {
					error.value = extractErrorMessage(fallbackError, 'Artisan profile not found.');
					artisan.value = null;
					return;
				}
			}

			error.value = extractErrorMessage(caughtError, 'Artisan profile not found.');
			artisan.value = null;
		} finally {
			loading.value = false;
		}
	};

	return {
		artisan,
		loading,
		error,
		loadArtisan,
	};
};

export const useArtisanEditor = () => {
	const artisan = ref(null);
	const services = ref([]);
	const loading = ref(false);
	const saving = ref(false);
	const error = ref('');
	const success = ref('');
	const validationErrors = ref([]);

	const form = reactive({
		phone: '',
		city: '',
		district: '',
		experience_years: 0,
		bio: '',
		services: [],
		profile_image: null,
	});

	const profileImagePreview = ref('');
	const currentPhotoPreview = ref('');

	const loadEditorData = async () => {
		loading.value = true;
		error.value = '';

		try {
			const payload = await fetchArtisanEditData();
			artisan.value = payload.artisan;
			services.value = payload.services ?? [];

			form.phone = payload.artisan?.user?.phone || '';
			form.city = payload.artisan?.city || '';
			form.district = payload.artisan?.district || '';
			form.experience_years = payload.artisan?.experience_years ?? 0;
			form.bio = payload.artisan?.bio || '';
			form.services = (payload.artisan?.services ?? []).map((service) => service.id);

			currentPhotoPreview.value = resolveAssetUrl(payload.artisan?.profile_image);
		} catch (caughtError) {
			error.value = extractErrorMessage(caughtError, 'Artisan profile not found.');
			artisan.value = null;
			services.value = [];
		} finally {
			loading.value = false;
		}
	};

	const setProfileImage = (file) => {
		if (!file) {
			form.profile_image = null;
			profileImagePreview.value = '';
			return;
		}

		form.profile_image = file;
		profileImagePreview.value = URL.createObjectURL(file);
	};

	const clearProfileImage = () => {
		form.profile_image = null;
		profileImagePreview.value = '';
	};

	const saveProfile = async () => {
		saving.value = true;
		error.value = '';
		success.value = '';
		validationErrors.value = [];

		try {
			const updatedArtisan = await updateArtisanProfile({
				phone: form.phone,
				city: form.city,
				district: form.district,
				experience_years: form.experience_years,
				bio: form.bio,
				services: form.services,
				profile_image: form.profile_image,
			});

			artisan.value = updatedArtisan;
			success.value = 'Profile updated successfully.';
			updateStoredUser((currentUser) => ({
				...currentUser,
				artisan: {
					...currentUser.artisan,
					...updatedArtisan,
				},
			}));

			if (updatedArtisan?.profile_image) {
				currentPhotoPreview.value = resolveAssetUrl(updatedArtisan.profile_image);
			} else {
				currentPhotoPreview.value = '';
			}

			form.profile_image = null;
			profileImagePreview.value = '';
		} catch (caughtError) {
			error.value = extractErrorMessage(caughtError, 'Unable to update profile.');
			validationErrors.value = extractValidationErrors(caughtError);
		} finally {
			saving.value = false;
		}
	};

	const selectedServices = computed(() => form.services);

	return {
		artisan,
		services,
		loading,
		saving,
		error,
		success,
		validationErrors,
		form,
		currentPhotoPreview,
		profileImagePreview,
		selectedServices,
		loadEditorData,
		setProfileImage,
		clearProfileImage,
		saveProfile,
	};
};
