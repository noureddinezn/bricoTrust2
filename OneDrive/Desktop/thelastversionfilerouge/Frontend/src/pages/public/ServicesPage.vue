<template>
	<main class="min-h-screen bg-[#eef2f7] text-slate-900">
		<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Services</h1>
						<p class="mt-2 text-slate-600">Browse available service categories on the platform.</p>
					</div>

					<RouterLink
						v-if="isAdmin"
						to="/admin/services/create"
						class="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
					>
						Add Service
					</RouterLink>
				</div>

				<div class="mt-6 flex flex-wrap gap-2">
					<button
						v-for="service in featuredServices"
						:key="service.id"
						type="button"
						class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-white hover:text-blue-700"
						@click="searchQuery = service.name"
					>
						{{ service.name }}
					</button>
				</div>

				<div class="mt-6 grid gap-4 md:grid-cols-[1.4fr_auto] md:items-center">
					<div class="space-y-2">
						<label for="service-search" class="text-sm font-semibold text-slate-700">Search service</label>
						<input
							id="service-search"
							v-model.trim="searchQuery"
							type="text"
							placeholder="Search by name or description"
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						/>
					</div>

					<button
						type="button"
						class="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
						@click="searchQuery = ''"
					>
						Clear
					</button>
				</div>
			</div>

			<p v-if="message" class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
				{{ message }}
			</p>

			<p v-if="error" class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{{ error }}
			</p>

			<div v-if="loading" class="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
				Loading services...
			</div>

			<div v-else-if="filteredServices.length" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				<article
					v-for="service in filteredServices"
					:key="service.id"
					class="group flex h-full flex-col rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg hover:ring-blue-200"
				>
					<div class="mb-4 flex items-start justify-between gap-4">
						<div>
							<h2 class="text-2xl font-bold text-slate-900 transition group-hover:text-blue-600">{{ service.name }}</h2>
							<p class="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
								{{ service.description || 'No description available.' }}
							</p>
						</div>
						<div class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap">
							{{ serviceCount(service.id) }} artisan(s)
						</div>
					</div>

					<div class="mt-auto border-t border-slate-100 pt-4">
						<div class="flex items-center justify-between gap-3">
							<RouterLink
								:to="{ path: '/artisans', query: { service: service.id } }"
								class="text-sm font-bold text-slate-900 transition hover:text-blue-600"
							>
								Browse Professionals
							</RouterLink>

							<div v-if="isAdmin" class="flex items-center gap-2" @click.stop>
								<RouterLink
									:to="`/admin/services/${service.id}/edit`"
									class="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
								>
									Edit
								</RouterLink>
								<button
									type="button"
									class="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
									@click="handleDelete(service)"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</article>
			</div>

			<div v-else class="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
				<h2 class="text-2xl font-bold text-slate-900">No services found</h2>
				<p class="mt-2 text-slate-600">
					{{ services.length ? 'Try adjusting your search.' : 'There are no services available yet.' }}
				</p>
			</div>
		</section>
	</main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { getUser, isAuthenticated } from '../../api';
import { fetchArtisans } from '../../services/artisanService';
import { deleteService, fetchServices } from '../../services/serviceService';

const services = ref([]);
const artisans = ref([]);
const loading = ref(true);
const error = ref('');
const message = ref('');
const searchQuery = ref('');

const isAdmin = computed(() => isAuthenticated() && getUser()?.role === 'admin');
const normalizedSearch = computed(() => searchQuery.value.toLowerCase());
const featuredServices = computed(() => services.value.slice(0, 6));
const filteredServices = computed(() => {
	if (!normalizedSearch.value) {
		return services.value;
	}

	return services.value.filter((service) => {
		const haystack = `${service.name} ${service.description || ''}`.toLowerCase();
		return haystack.includes(normalizedSearch.value);
	});
});

const loadData = async () => {
	loading.value = true;
	error.value = '';

	try {
		const [serviceItems, artisanPage] = await Promise.all([
			fetchServices(),
			fetchArtisans({ per_page: 100 }),
		]);

		services.value = serviceItems;
		artisans.value = artisanPage.data ?? [];
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load services.';
	} finally {
		loading.value = false;
	}
};

const serviceCount = (serviceId) => artisans.value.filter((artisan) => (
	(artisan.services ?? []).some((service) => String(service.id) === String(serviceId))
)).length;

const handleDelete = async (service) => {
	if (!window.confirm(`Are you sure you want to delete ${service.name}?`)) {
		return;
	}

	await deleteService(service.id);
	message.value = `${service.name} deleted successfully.`;
	await loadData();
};

onMounted(loadData);
</script>
