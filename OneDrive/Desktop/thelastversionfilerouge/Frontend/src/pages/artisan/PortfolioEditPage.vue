<template>
	<main class="min-h-screen bg-[#eef2f7] text-slate-900">
		<section class="border-b border-slate-200/70 bg-gradient-to-b from-white to-[#e8f0f8]">
			<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
				<div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div>
						<p class="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm ring-1 ring-slate-200">
							Portfolio form
						</p>
						<h1 class="mt-6 text-4xl font-extrabold tracking-tight text-[#1f4477] sm:text-5xl">Edit Portfolio Item</h1>
						<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
							Update your existing project while keeping the same public presentation and visibility.
						</p>
					</div>

					<div class="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
						<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Reminder</p>
						<p class="mt-3 text-sm leading-7 text-slate-600">
							Your portfolio remains visible to public visitors and clients, and existing comments stay attached to the item.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
			<div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
				<div v-if="loading" class="py-10 text-center text-slate-600">Loading portfolio item...</div>
				<div v-else-if="error" class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

				<form v-else class="space-y-6" @submit.prevent="handleSubmit">
					<div v-if="artisanServices.length" class="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
						<p class="text-sm font-semibold text-blue-900">Your artisan services</p>
						<p class="mt-1 text-sm text-blue-700">This portfolio item appears inside your artisan profile and service visibility.</p>
						<div class="mt-3 flex flex-wrap gap-2">
							<span v-for="service in artisanServices" :key="service.id" class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
								{{ service.name }}
							</span>
						</div>
					</div>

					<div class="space-y-2">
						<label for="title" class="text-sm font-semibold text-slate-700">Title</label>
						<input
							id="title"
							v-model.trim="form.title"
							type="text"
							required
							placeholder="Project title"
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						/>
					</div>

					<div class="space-y-2">
						<label for="image" class="text-sm font-semibold text-slate-700">Image</label>
						<input
							id="image"
							type="file"
							accept="image/*"
							class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
							@change="handleFileChange"
						/>
						<p class="text-xs text-slate-500">Optional replacement image. PNG or JPG up to 5MB.</p>
						<div v-if="currentImagePreview || imagePreview" class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
							<img :src="imagePreview || currentImagePreview" :alt="form.title" class="h-72 w-full object-cover" />
						</div>
					</div>

					<div class="space-y-2">
						<label for="description" class="text-sm font-semibold text-slate-700">Description</label>
						<textarea
							id="description"
							v-model="form.description"
							rows="6"
							placeholder="Describe the work, materials, and final result."
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						/>
					</div>

					<div class="flex flex-wrap gap-3">
						<button type="submit" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60" :disabled="saving">
							{{ saving ? 'Updating...' : 'Update Portfolio Item' }}
						</button>
						<RouterLink :to="portfolioIndexPath" class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
							Cancel
						</RouterLink>
					</div>
				</form>
			</div>
		</section>
	</main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { getUser, resolveAssetUrl } from '../../api';
import { fetchArtisanEditData } from '../../services/artisanService';
import { fetchPortfolioItem, updatePortfolioItem } from '../../services/portfolioService';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const currentImagePreview = ref('');
const imagePreview = ref('');
const imageFile = ref(null);
const artisanId = ref(null);
const artisanServices = ref([]);

const form = reactive({
	title: '',
	description: '',
});

const portfolioIndexPath = computed(() => (artisanId.value ? `/artisans/${artisanId.value}/portfolio` : '/artisans'));

const loadData = async () => {
	loading.value = true;
	error.value = '';

	try {
		const currentUser = getUser();
		if (currentUser?.artisan?.id) {
			artisanId.value = currentUser.artisan.id;
		}

		const [portfolio, artisanPayload] = await Promise.all([
			fetchPortfolioItem(route.params.id),
			fetchArtisanEditData().catch(() => null),
		]);

		if (artisanPayload?.artisan?.id) {
			artisanId.value = artisanPayload.artisan.id;
			artisanServices.value = artisanPayload.artisan.services ?? artisanPayload.services ?? [];
		}

		form.title = portfolio.title || '';
		form.description = portfolio.description || '';
		currentImagePreview.value = resolveAssetUrl(portfolio.image);
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load portfolio item.';
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

	error.value = '';
	imageFile.value = file || null;
	imagePreview.value = file ? URL.createObjectURL(file) : '';
};

const handleSubmit = async () => {
	saving.value = true;
	error.value = '';

	try {
		await updatePortfolioItem(route.params.id, {
			title: form.title,
			description: form.description,
			image: imageFile.value,
		});

		await router.push(portfolioIndexPath.value);
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to update portfolio item.';
	} finally {
		saving.value = false;
	}
};

onMounted(loadData);
</script>
