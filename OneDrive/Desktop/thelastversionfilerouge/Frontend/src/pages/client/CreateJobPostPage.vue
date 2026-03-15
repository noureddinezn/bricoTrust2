<template>
	<ProfessionalPageShell
		eyebrow="Client posting"
		title="Describe Your Problem"
		description="Provide details so artisans can give you accurate quotes."
	>
		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">What happens next</p>
				<p class="mt-3 text-sm leading-6 text-slate-600">Your job post appears in the marketplace and artisans can review the request before contacting you.</p>
			</div>
		</template>

		<div class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
				<div v-if="loading" class="mt-8 rounded-2xl bg-gray-50 p-6 text-center text-gray-600">Loading services...</div>
				<div v-else-if="error" class="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

				<form v-else class="mt-8 space-y-6" @submit.prevent="handleSubmit">
					<div>
						<label for="title" class="mb-2 block text-sm font-medium text-gray-700">Issue Title</label>
						<input id="title" v-model.trim="form.title" type="text" required class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-gray-900 outline-none" placeholder="e.g. Leaking sink underneath the cabinet">
						<p v-if="validationErrors.title" class="text-red-500 text-xs mt-1">{{ validationErrors.title }}</p>
					</div>

					<div>
						<label for="service_id" class="mb-2 block text-sm font-medium text-gray-700">Category / Service Needed</label>
						<select id="service_id" v-model="form.service_id" required class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none bg-white">
							<option value="" disabled>Select a service</option>
							<option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
						</select>
						<p v-if="validationErrors.service_id" class="text-red-500 text-xs mt-1">{{ validationErrors.service_id }}</p>
					</div>

					<div>
						<label for="description" class="mb-2 block text-sm font-medium text-gray-700">Detailed Description</label>
						<textarea id="description" v-model="form.description" rows="6" required class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-gray-900 outline-none" placeholder="Elaborate on the issue here..."></textarea>
						<p v-if="validationErrors.description" class="text-red-500 text-xs mt-1">{{ validationErrors.description }}</p>
					</div>

					<div>
						<label for="image" class="mb-2 block text-sm font-medium text-gray-700">Upload Image of the Problem</label>
						<input type="file" id="image" accept="image/*" class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-900 outline-none bg-gray-50" @change="handleFileChange">
						<p class="text-xs text-gray-500 mt-1">Optional. PNG, JPG max 5MB.</p>
						<div v-if="imagePreview" class="mt-4 overflow-hidden rounded-2xl border border-gray-200">
							<img :src="imagePreview" alt="Preview" class="h-64 w-full object-cover">
						</div>
					</div>

					<div class="flex items-center gap-4">
						<button type="submit" class="rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 transition" :disabled="saving">
							{{ saving ? 'Posting...' : 'Post Job' }}
						</button>
						<RouterLink to="/job-posts" class="rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">Cancel</RouterLink>
					</div>
				</form>
		</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { getUser, isAuthenticated } from '../../api';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { createJobPost } from '../../services/jobPostService';
import { fetchServices } from '../../services/serviceService';

const router = useRouter();
const services = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const validationErrors = reactive({});
const imageFile = ref(null);
const imagePreview = ref('');

const form = reactive({
	title: '',
	service_id: '',
	description: '',
});

const clearValidation = () => {
	Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);
};

const loadServices = async () => {
	loading.value = true;
	error.value = '';

	try {
		services.value = await fetchServices();
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load services.';
	} finally {
		loading.value = false;
	}
};

const handleFileChange = (event) => {
	const [file] = event.target.files || [];

	if (file && file.size > 5 * 1024 * 1024) {
		error.value = 'Image size must be 5MB or less.';
		imageFile.value = null;
		imagePreview.value = '';
		event.target.value = '';
		return;
	}

	imageFile.value = file || null;
	imagePreview.value = file ? URL.createObjectURL(file) : '';
};

const ensureClientAccess = async () => {
	if (!isAuthenticated()) {
		await router.push('/login?redirect=/job-posts/create');
		return false;
	}

	const currentUser = getUser();

	if (currentUser?.role !== 'client') {
		await router.push('/job-posts');
		return false;
	}

	return true;
};

const handleSubmit = async () => {
	clearValidation();
	saving.value = true;
	error.value = '';

	try {
		await createJobPost({
			title: form.title,
			service_id: form.service_id,
			description: form.description,
			image: imageFile.value,
		});

		await router.push('/job-posts');
	} catch (caughtError) {
		const responseErrors = caughtError?.response?.data?.errors || {};
		Object.entries(responseErrors).forEach(([key, values]) => {
			validationErrors[key] = Array.isArray(values) ? values[0] : values;
		});
		error.value = caughtError?.response?.data?.message || 'Unable to create job post.';
	} finally {
		saving.value = false;
	}
};

onMounted(async () => {
	const canAccess = await ensureClientAccess();

	if (!canAccess) {
		return;
	}

	await loadServices();
});
</script>
