<template>
	<main class="min-h-screen bg-[#eef3f8] text-slate-900">
		<section class="border-b border-slate-200/70 bg-gradient-to-b from-white to-[#e8f0f8]">
			<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div class="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
					<div>
						<h1 class="max-w-3xl text-4xl font-extrabold tracking-tight text-[#1f4477] sm:text-5xl">
							Classement des Meilleurs Artisans
						</h1>
						<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
							Decouvrez les meilleurs artisans de votre region, classes par note moyenne et visibilite de profil.
						</p>

						<div class="mt-8 flex flex-wrap gap-3">
							<button
								v-for="tab in serviceTabs"
								:key="tab.value"
								type="button"
								class="rounded-t-2xl border px-5 py-3 text-sm font-semibold transition"
								:class="selectedService === tab.value
									? 'border-[#1f4477] bg-white text-[#1f4477] shadow-sm'
									: 'border-transparent bg-white/70 text-slate-500 hover:bg-white hover:text-slate-900'"
								@click="selectedService = tab.value"
							>
								{{ tab.label }}
							</button>
						</div>
					</div>

					<div class="hidden justify-self-end lg:block" aria-hidden="true">
						<FontAwesomeIcon icon="trophy" class="text-[14rem] leading-none text-amber-200 opacity-80" />
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto -mt-4 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
			<div class="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
				<div v-if="loading" class="rounded-[1.5rem] bg-slate-50 py-16 text-center text-slate-600">
					Loading leaderboard...
				</div>

				<div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
					{{ error }}
				</div>

				<template v-else-if="rankedArtisans.length">
					<div class="grid gap-6 pt-4 md:grid-cols-3">
						<article
							v-for="(artisan, index) in topThree"
							:key="artisan.id"
							class="relative rounded-[1.7rem] border p-5 pt-11 text-center shadow-sm"
							:class="podiumCardClass(index)"
						>
							<div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" :class="podiumMedalClass(index)">
								<FontAwesomeIcon icon="award" class="text-6xl leading-none" />
							</div>

							<div class="mx-auto h-24 w-24 rounded-full border-4 border-white bg-white shadow-sm">
								<img
									v-if="artisan.profile_image"
									:src="artisanImage(artisan.profile_image)"
									:alt="artisan.user?.name"
									class="h-full w-full rounded-full object-cover"
								/>
								<div v-else class="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-3xl font-bold text-slate-500">
									{{ artisanInitial(artisan) }}
								</div>
							</div>

							<div class="mt-4 rounded-[1.3rem] bg-white p-4 shadow-sm">
								<div class="text-3xl font-extrabold" :class="podiumTextClass(index)">{{ index + 1 }}</div>
								<h2 class="mt-1 text-2xl font-bold text-slate-900">
									<RouterLink :to="`/artisans/${artisan.id}`" class="hover:text-blue-700">
										{{ artisan.user?.name }}
									</RouterLink>
								</h2>
								<p class="mt-1 text-sm text-slate-500">{{ artisan.services?.[0]?.name || 'Artisan' }}</p>
								<p class="mt-1 text-xs text-slate-400">{{ artisan.city || 'Unknown city' }}</p>

								<div class="mt-4 flex items-center justify-center gap-1">
									<FontAwesomeIcon v-for="star in 5" :key="star" icon="star" class="text-lg" :class="star <= Math.round(Number(artisan.average_rating || 0)) ? 'text-yellow-400' : 'text-slate-200'" />
									<span class="ml-2 text-sm font-semibold text-slate-700">{{ ratingText(artisan) }}</span>
								</div>
							</div>
						</article>
					</div>

					<div v-if="otherRankedArtisans.length" class="mt-8 overflow-x-auto rounded-[1.5rem] border border-slate-200">
						<table class="w-full min-w-[760px] bg-white text-left text-sm">
							<thead class="bg-slate-50 text-slate-500">
								<tr>
									<th class="px-6 py-4 text-center">Rank</th>
									<th class="px-6 py-4">Artisan</th>
									<th class="px-6 py-4">Service</th>
									<th class="px-6 py-4">City</th>
									<th class="px-6 py-4">Rating</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100">
								<tr v-for="(artisan, index) in otherRankedArtisans" :key="artisan.id" class="hover:bg-slate-50">
									<td class="px-6 py-4 text-center">
										<span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
											{{ index + 4 }}
										</span>
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center gap-3">
											<div class="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
												<img
													v-if="artisan.profile_image"
													:src="artisanImage(artisan.profile_image)"
													:alt="artisan.user?.name"
													class="h-full w-full object-cover"
												/>
												<div v-else class="flex h-full w-full items-center justify-center font-bold text-slate-500">
													{{ artisanInitial(artisan) }}
												</div>
											</div>
											<div>
												<RouterLink :to="`/artisans/${artisan.id}`" class="text-base font-bold text-slate-900 hover:text-blue-700">
													{{ artisan.user?.name }}
												</RouterLink>
												<p class="text-xs text-slate-500">{{ artisan.district || 'No district' }}</p>
											</div>
										</div>
									</td>
									<td class="px-6 py-4 font-medium text-slate-700">{{ artisan.services?.[0]?.name || 'Artisan' }}</td>
									<td class="px-6 py-4 text-slate-600">{{ artisan.city || 'Unknown city' }}</td>
									<td class="px-6 py-4">
										<div class="flex items-center gap-2">
											<div class="flex gap-0.5">
												<FontAwesomeIcon v-for="star in 5" :key="star" icon="star" class="text-sm" :class="star <= Math.round(Number(artisan.average_rating || 0)) ? 'text-yellow-400' : 'text-slate-200'" />
											</div>
											<span class="font-semibold text-slate-900">{{ ratingText(artisan) }}</span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div v-if="pagination.lastPage > 1" class="mt-8 flex flex-wrap items-center justify-center gap-3">
						<button
							type="button"
							class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
							:disabled="loading || pagination.currentPage === 1"
							@click="goToPage(pagination.currentPage - 1)"
						>
							Previous
						</button>
						<span class="text-sm text-slate-600">
							Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
						</span>
						<button
							type="button"
							class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
							:disabled="loading || pagination.currentPage === pagination.lastPage"
							@click="goToPage(pagination.currentPage + 1)"
						>
							Next
						</button>
					</div>
				</template>

				<div v-else class="rounded-[1.5rem] bg-slate-50 py-16 text-center">
					<FontAwesomeIcon icon="trophy" class="text-5xl text-slate-300" />
					<h2 class="mt-4 text-2xl font-bold text-slate-900">No artisans ranked yet</h2>
					<p class="mt-2 text-slate-500">Leaderboard entries will appear here once artisans receive ratings.</p>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { resolveAssetUrl } from '../../api';
import { fetchLeaderboard } from '../../services/artisanService';
import { fetchServices } from '../../services/serviceService';

const loading = ref(false);
const error = ref('');
const artisans = ref([]);
const services = ref([]);
const selectedService = ref('');
const pagination = ref({
	currentPage: 1,
	lastPage: 1,
	perPage: 20,
	total: 0,
});

const artisanImage = (path) => resolveAssetUrl(path);
const artisanInitial = (artisan) => (artisan.user?.name ? artisan.user.name.charAt(0).toUpperCase() : 'A');
const ratingText = (artisan) => Number(artisan.average_rating || 0).toFixed(1);

const serviceTabs = computed(() => [
	{ label: 'Tous', value: '' },
	...services.value.slice(0, 5).map((service) => ({
		label: service.name,
		value: String(service.id),
	})),
]);

const rankedArtisans = computed(() => artisans.value);

const topThree = computed(() => rankedArtisans.value.slice(0, 3));
const otherRankedArtisans = computed(() => rankedArtisans.value.slice(3));

const podiumCardClass = (index) => {
	if (index === 0) {
		return 'border-orange-300 bg-orange-50';
	}

	if (index === 1) {
		return 'border-sky-200 bg-sky-50';
	}

	return 'border-violet-200 bg-violet-50';
};

const podiumMedalClass = (index) => {
	if (index === 0) {
		return 'text-yellow-500';
	}

	if (index === 1) {
		return 'text-slate-400';
	}

	return 'text-amber-700';
};

const podiumTextClass = (index) => {
	if (index === 0) {
		return 'text-yellow-500';
	}

	if (index === 1) {
		return 'text-slate-400';
	}

	return 'text-amber-700';
};

const loadLeaderboard = async () => {
	loading.value = true;
	error.value = '';

	try {
		const leaderboardData = await fetchLeaderboard({
			per_page: pagination.value.perPage,
			page: pagination.value.currentPage,
			service: selectedService.value || undefined,
		});

		artisans.value = leaderboardData.data ?? [];
		pagination.value = {
			currentPage: leaderboardData.current_page ?? 1,
			lastPage: leaderboardData.last_page ?? 1,
			perPage: leaderboardData.per_page ?? pagination.value.perPage,
			total: leaderboardData.total ?? 0,
		};
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load leaderboard.';
		artisans.value = [];
	} finally {
		loading.value = false;
	}
};

const goToPage = async (page) => {
	pagination.value.currentPage = page;
	await loadLeaderboard();
};

watch(selectedService, async () => {
	pagination.value.currentPage = 1;
	await loadLeaderboard();
});

onMounted(async () => {
	services.value = await fetchServices();
	await loadLeaderboard();
});
</script>
