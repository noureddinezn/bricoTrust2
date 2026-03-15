<template>
	<main class="min-h-screen bg-[#F0F4F8] text-gray-900">
		<section class="relative overflow-hidden bg-linear-to-b from-white to-[#E6EEF5] pt-16 pb-28">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
				<div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div>
						<p class="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
							My professional profile
						</p>
						<h1 class="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#1a365d] sm:text-5xl">
							{{ artisan?.user?.name || 'Artisan' }}
						</h1>
						<p class="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
							Your portfolio, client reviews, services, and contact information in one polished profile.
						</p>
						<div class="mt-8 flex flex-wrap gap-3">
							<RouterLink to="/artisan/profile/edit" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
								Edit profile
							</RouterLink>
							<RouterLink to="/portfolio/create" class="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
								Add portfolio item
							</RouterLink>
							<RouterLink v-if="artisan?.id" :to="`/artisans/${artisan.id}/portfolio`" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
								Manage portfolio
							</RouterLink>
							<RouterLink :to="`/artisans/${artisan?.id}`" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
								View public profile
							</RouterLink>
						</div>
					</div>

					<div class="hidden justify-self-end opacity-20 md:block">
						<FontAwesomeIcon icon="trophy" class="text-[10rem] text-yellow-500" />
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 -mt-20 pb-20 sm:px-6 lg:px-8 relative z-20">
			<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading profile...</div>
			<div v-else-if="error" class="rounded-3xl bg-white p-6 text-sm font-medium text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

			<div v-else-if="artisan" class="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
				<div class="space-y-8">
					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
							<div class="flex flex-col gap-6 sm:flex-row sm:items-start">
								<div class="relative mx-auto h-36 w-36 overflow-hidden rounded-full bg-slate-100 p-1 shadow-md ring-4 ring-white sm:mx-0">
									<img v-if="artisan.profile_image" :src="artisanImage(artisan.profile_image)" :alt="artisan.user?.name" class="h-full w-full rounded-full object-cover" />
									<div v-else class="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-5xl font-bold text-blue-600">
										{{ artisanInitial }}
									</div>
								</div>

								<div class="pt-2 text-center sm:text-left">
									<h2 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">{{ artisan.user?.name }}</h2>
									<p class="mt-2 text-lg text-gray-600">
										<FontAwesomeIcon icon="location-dot" class="mr-2 text-blue-500" />{{ artisan.city }}, {{ artisan.district }}
									</p>
									<div v-if="artisan.services?.length" class="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
										<span v-for="service in artisan.services" :key="service.id" class="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
											{{ service.name }}
										</span>
									</div>
								</div>
							</div>

							<div class="rounded-2xl bg-linear-to-r from-blue-50 to-blue-100 px-5 py-4 text-center shadow-inner">
								<span class="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Rating</span>
								<span class="mt-1 flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
									<FontAwesomeIcon icon="star" class="text-amber-400" />
									{{ Number(artisan.average_rating || 0).toFixed(1) }}
								</span>
							</div>
						</div>

						<div class="mt-8">
							<h3 class="text-lg font-semibold text-gray-900">About</h3>
							<p class="mt-2 leading-7 text-gray-600">{{ artisan.bio || 'No bio available.' }}</p>
						</div>
					</section>

					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h3 class="text-2xl font-bold text-gray-900">Portfolio</h3>
						<div v-if="portfolioItems.length" class="mt-6 grid gap-6 md:grid-cols-2">
							<article v-for="item in portfolioItems" :key="item.id" class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
								<img v-if="item.image || item.photo || item.path" :src="portfolioImage(item.image || item.photo || item.path)" :alt="item.title || 'Portfolio item'" class="h-56 w-full object-cover" />
								<div class="p-5">
									<h4 class="text-lg font-semibold text-gray-900">{{ item.title || 'Portfolio item' }}</h4>
									<p class="mt-2 text-sm text-gray-600">{{ item.description || 'No description available.' }}</p>
								</div>
							</article>
						</div>
						<p v-else class="mt-4 text-gray-600">No portfolio items yet.</p>
					</section>

					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h3 class="text-2xl font-bold text-gray-900">Client Reviews</h3>
						<div v-if="reviews.length" class="mt-6 space-y-4">
							<div v-for="review in reviews" :key="review.id" class="rounded-2xl border border-gray-200 p-5">
								<div class="flex items-center justify-between gap-4">
									<h4 class="font-semibold text-gray-900">{{ review.client?.name || 'Client' }}</h4>
									<span class="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"><FontAwesomeIcon icon="star" class="text-amber-400" /> {{ review.rating }}/5</span>
								</div>
								<p class="mt-2 text-sm text-gray-600">{{ review.comment || 'No comment provided.' }}</p>
							</div>
						</div>
						<p v-else class="mt-4 text-gray-600">No reviews yet.</p>
					</section>
				</div>

				<aside class="space-y-8">
					<section class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
						<h3 class="text-lg font-bold text-gray-900">My Portfolio</h3>
						<p class="mt-2 text-sm text-gray-600">Keep your best work visible to clients.</p>
						<div class="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
							<span class="text-sm text-slate-600">Items</span>
							<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{{ portfolioItems.length }}</span>
						</div>
						<div v-if="portfolioItems.length" class="mt-4 space-y-3">
							<div v-for="item in portfolioItems.slice(0, 2)" :key="item.id" class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
								<div class="h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
									<img v-if="item.image" :src="portfolioImage(item.image)" :alt="item.title" class="h-full w-full object-cover" />
									<div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-400"><FontAwesomeIcon icon="image" /></div>
								</div>
								<div class="min-w-0">
									<p class="truncate text-sm font-semibold text-slate-800">{{ item.title || 'Portfolio item' }}</p>
									<p class="truncate text-xs text-slate-500">{{ item.description || 'No description' }}</p>
								</div>
							</div>
						</div>
						<div class="mt-4 flex flex-wrap gap-3">
							<RouterLink to="/portfolio/create" class="flex-1 rounded-2xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800">
								Add item
							</RouterLink>
							<RouterLink v-if="artisan?.id" :to="`/artisans/${artisan.id}/portfolio`" class="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
								View all
							</RouterLink>
						</div>
					</section>

					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h3 class="text-xl font-bold text-gray-900">Contact Info</h3>
						<div class="mt-6 space-y-4 text-sm text-gray-700">
							<div class="flex items-center gap-3">
								<FontAwesomeIcon icon="envelope" class="w-5 text-center text-gray-400" />
								<span class="font-medium">{{ artisan.user?.email }}</span>
							</div>
							<div v-if="artisan.user?.phone" class="flex items-center gap-3">
								<FontAwesomeIcon icon="phone" class="w-5 text-center text-gray-400" />
								<span class="font-medium">{{ artisan.user.phone }}</span>
							</div>
							<div class="flex items-center gap-3">
								<FontAwesomeIcon icon="clock" class="w-5 text-center text-gray-400" />
								<span class="text-gray-500">Joined {{ joinedAt }}</span>
							</div>
						</div>
					</section>

					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h3 class="text-xl font-bold text-gray-900">Profile Summary</h3>
						<div class="mt-6 space-y-4 border-t border-gray-100 pt-4 text-sm text-gray-700">
							<div class="flex items-center justify-between">
								<span class="text-gray-500">Experience</span>
								<span class="rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-700">{{ artisan.experience_years }} years</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-gray-500">Portfolio Items</span>
								<span class="font-bold text-gray-900">{{ portfolioItems.length }}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-gray-500">Client Reviews</span>
								<span class="font-bold text-gray-900">{{ reviews.length }}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-gray-500">Status</span>
								<span class="rounded-md px-2 py-0.5 font-bold capitalize" :class="artisan.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'">{{ artisan.status }}</span>
							</div>
						</div>
					</section>
				</aside>
			</div>
		</section>
	</main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { fetchMyArtisanProfile } from '../../services/artisanService';
import { resolveAssetUrl } from '../../api';

const profile = ref(null);
const loading = ref(false);
const error = ref('');

const artisan = computed(() => profile.value?.artisan || null);
const artisanInitial = computed(() => (artisan.value?.user?.name ? artisan.value.user.name.charAt(0).toUpperCase() : 'A'));
const portfolioItems = computed(() => artisan.value?.portfolioItems ?? []);
const reviews = computed(() => artisan.value?.serviceRequests?.map((request) => request.review).filter(Boolean) ?? []);
const joinedAt = computed(() => (artisan.value?.created_at ? new Date(artisan.value.created_at).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'));

const artisanImage = (path) => resolveAssetUrl(path);
const portfolioImage = (path) => resolveAssetUrl(path);

const loadProfile = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchMyArtisanProfile();
		profile.value = payload;
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Artisan profile not found.';
		profile.value = null;
	} finally {
		loading.value = false;
	}
};

onMounted(loadProfile);
</script>
