<template>
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<section class="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Find Artisans</h1>
					<p class="mt-2 text-slate-600">Search by name, service, city, and district.</p>
				</div>

				<div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
					{{ pagination.total }} artisan{{ pagination.total === 1 ? '' : 's' }} available
				</div>
			</div>

			<form class="mt-6 grid gap-4 lg:grid-cols-5" @submit.prevent="handleSearch">
				<div class="space-y-2">
					<label for="name" class="text-sm font-semibold text-slate-700">Artisan Name</label>
					<input
						id="name"
						v-model.trim="filters.name"
						type="text"
						class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						placeholder="Search name"
					/>
				</div>

				<div class="space-y-2">
					<label for="service" class="text-sm font-semibold text-slate-700">Service</label>
					<select
						id="service"
						v-model="filters.service"
						class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
					>
						<option value="">All services</option>
						<option v-for="service in services" :key="service.id" :value="service.id">
							{{ service.name }}
						</option>
					</select>
				</div>

				<div class="space-y-2">
					<label for="city" class="text-sm font-semibold text-slate-700">City</label>
					<input
						id="city"
						v-model.trim="filters.city"
						type="text"
						class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						placeholder="Enter city"
					/>
				</div>

				<div class="space-y-2">
					<label for="district" class="text-sm font-semibold text-slate-700">District</label>
					<input
						id="district"
						v-model.trim="filters.district"
						type="text"
						class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						placeholder="Enter district"
					/>
				</div>

				<div class="flex items-end gap-3 lg:pt-8">
					<button
						type="submit"
						class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
						:disabled="loading"
					>
						{{ loading ? 'Searching...' : 'Search' }}
					</button>

					<button
						type="button"
						class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
						@click="handleReset"
					>
						Reset
					</button>
				</div>
			</form>
		</section>

		<p v-if="error" class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
			{{ error }}
		</p>

		<div v-if="loading && !artisans.length" class="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
			<p class="text-slate-600">Loading artisans...</p>
		</div>

		<div v-else-if="artisans.length" class="space-y-4">
			<div v-if="loading" class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
				Kayt7adeto results... lcontent الحالي باقي باين حتى يسali refresh.
			</div>

			<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			<article
				v-for="artisan in artisans"
				:key="artisan.id"
				class="group overflow-hidden rounded-[1.8rem] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
			>
				<div class="relative h-56 overflow-hidden bg-slate-100">
					<img
						v-if="artisan.profile_image"
						:src="artisanImage(artisan.profile_image)"
						:alt="artisan.user?.name || 'Artisan'"
						class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
					<div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-slate-900">
						<div class="text-center text-white">
							<div class="text-4xl font-bold">{{ artisanInitial(artisan) }}</div>
							<p class="mt-2 text-sm text-blue-100">No photo</p>
						</div>
					</div>

					<div
						v-if="artisan.status === 'approved'"
						class="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm"
					>
						Approved
					</div>
				</div>

				<div class="p-5">
					<h3 class="text-2xl font-bold text-slate-900">{{ artisan.user?.name }}</h3>
					<p class="mt-2 text-sm text-slate-500">{{ artisan.city || 'Unknown city' }}, {{ artisan.district || 'Unknown district' }}</p>

					<p v-if="artisan.services?.length" class="mt-3 text-sm font-semibold text-blue-700">
						{{ artisan.services[0].name }}
					</p>

					<div class="mt-4 flex items-center justify-between gap-4">
						<div class="flex items-center gap-2">
							<span class="text-sm font-semibold text-slate-900">{{ Number(artisan.average_rating || 0).toFixed(1) }}</span>
							<div class="flex gap-0.5 text-yellow-400">
								<span v-for="star in 5" :key="star">*</span>
							</div>
						</div>
						<span class="text-xs text-slate-500">{{ artisan.experience_years || 0 }}y exp</span>
					</div>

					<p v-if="artisan.bio" class="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
						{{ artisan.bio }}
					</p>

					<div class="mt-4 flex flex-wrap gap-2">
						<span
							v-for="service in artisan.services?.slice(0, 2) || []"
							:key="service.id"
							class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
						>
							{{ service.name }}
						</span>
						<span v-if="!artisan.services?.length" class="text-xs text-slate-400">no services</span>
						<span v-if="artisan.services?.length > 2" class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
							+{{ artisan.services.length - 2 }} more
						</span>
					</div>

					<div class="mt-5 grid gap-3 sm:grid-cols-2">
						<RouterLink
							:to="`/artisans/${artisan.id}`"
							class="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
						>
							View Profile
						</RouterLink>
						<RouterLink
							:to="`/artisans/${artisan.id}/portfolio`"
							class="block rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
						>
							Portfolio, Comment & Rate
						</RouterLink>
					</div>
				</div>
			</article>
			</div>
		</div>

		<div v-else class="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
			<h2 class="text-2xl font-bold text-slate-900">No artisans found</h2>
			<p class="mt-2 text-slate-600">Try changing your filters.</p>
		</div>

		<div v-if="pagination.lastPage > 1" class="mt-8 flex items-center justify-center gap-2">
			<button
				class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
				:disabled="pagination.currentPage === 1 || loading"
				@click="goToPage(pagination.currentPage - 1)"
			>
				Previous
			</button>

			<span class="px-4 py-2 text-sm text-slate-600">
				Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
			</span>

			<button
				class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
				:disabled="pagination.currentPage === pagination.lastPage || loading"
				@click="goToPage(pagination.currentPage + 1)"
			>
				Next
			</button>
		</div>
	</main>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { resolveAssetUrl } from '../../api';
import { useArtisanDirectory } from '../../composables/useArtisans';

const route = useRoute();
const router = useRouter();

const {
	artisans,
	services,
	loading,
	error,
	filters,
	pagination,
	loadServices,
	loadArtisans,
	resetFilters,
} = useArtisanDirectory();

const artisanImage = (path) => resolveAssetUrl(path);
const artisanInitial = (artisan) => (artisan.user?.name ? artisan.user.name.charAt(0).toUpperCase() : 'A');

const syncFiltersFromRoute = () => {
	filters.name = route.query.name?.toString() || route.query.search?.toString() || '';
	filters.service = route.query.service?.toString() || '';
	filters.city = route.query.city?.toString() || '';
	filters.district = route.query.district?.toString() || '';
};

const replaceRoute = async (page = 1) => {
	await router.replace({
		path: '/artisans',
		query: {
			name: filters.name || undefined,
			service: filters.service || undefined,
			city: filters.city || undefined,
			district: filters.district || undefined,
			page: page > 1 ? page : undefined,
		},
	});
};

const handleSearch = async () => {
	await replaceRoute(1);
};

const handleReset = async () => {
	await router.replace({ path: '/artisans' });
	await resetFilters();
};

const goToPage = async (page) => {
	await replaceRoute(page);
};

onMounted(async () => {
	syncFiltersFromRoute();
	await loadServices();
});

watch(
	() => route.query,
	async () => {
		syncFiltersFromRoute();
		await loadArtisans(Number(route.query.page || 1));
	},
	{ immediate: true },
);
</script>
