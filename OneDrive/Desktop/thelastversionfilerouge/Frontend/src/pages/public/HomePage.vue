<template>
	<main class="min-h-screen bg-[#eef2f7] text-slate-900">
		<section class="border-b border-slate-200/70 bg-[#f8fafc]">
			<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
				<div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div>
						<p class="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm ring-1 ring-slate-200">
							Trusted artisan platform
						</p>
						<h1 class="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
							Find trusted artisans near you
						</h1>
						<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
							Search by service, city, and district. Discover artisan profiles, portfolio items, and client reviews in one place.
						</p>

						<form class="mt-8 rounded-[2rem] bg-white p-5 shadow-lg ring-1 ring-slate-200" @submit.prevent="submitSearch">
							<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								<div class="space-y-2">
									<label class="text-sm font-semibold text-slate-700" for="home-service">Service</label>
									<select
										id="home-service"
										v-model="searchForm.service"
										class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
									>
										<option value="">All services</option>
										<option v-for="service in topServices" :key="service.id" :value="service.id">
											{{ service.name }}
										</option>
									</select>
								</div>

								<div class="space-y-2">
									<label class="text-sm font-semibold text-slate-700" for="home-city">City</label>
									<input
										id="home-city"
										v-model.trim="searchForm.city"
										type="text"
										placeholder="Enter city"
										class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
									/>
								</div>

								<div class="space-y-2">
									<label class="text-sm font-semibold text-slate-700" for="home-district">District</label>
									<input
										id="home-district"
										v-model.trim="searchForm.district"
										type="text"
										placeholder="Enter district"
										class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
									/>
								</div>

								<div class="flex items-end">
									<button
										type="submit"
										class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
									>
										Explore Artisans
									</button>
								</div>
							</div>
						</form>

						<div class="mt-6 flex flex-wrap gap-3">
							<RouterLink to="/artisans" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
								Explore Artisans
							</RouterLink>
							<RouterLink to="/register" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
								Create Account
							</RouterLink>
						</div>
					</div>

					<div class="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
						<div class="grid gap-4 md:grid-cols-2">
							<article v-for="roleCard in roleCards" :key="roleCard.title" class="rounded-[1.6rem] bg-slate-50 p-6 ring-1 ring-slate-100">
								<h2 class="text-2xl font-bold text-slate-900">{{ roleCard.title }}</h2>
								<p class="mt-3 text-base leading-7 text-slate-600">{{ roleCard.description }}</p>
							</article>
							<article class="rounded-[1.6rem] bg-slate-50 p-6 ring-1 ring-slate-100 md:col-span-2">
								<h2 class="text-2xl font-bold text-slate-900">Administration</h2>
								<p class="mt-3 text-base leading-7 text-slate-600">
									Manage validation, moderate reports, and keep the platform reliable.
								</p>
							</article>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div class="flex items-end justify-between gap-4">
				<div>
					<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Platform overview</p>
					<h2 class="mt-2 text-3xl font-bold text-slate-900">Simple browsing, clear trust signals</h2>
				</div>
				<RouterLink to="/leaderboard" class="text-sm font-semibold text-slate-700 hover:text-slate-900">
					Open leaderboard
				</RouterLink>
			</div>

			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<article class="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Approved artisans</p>
					<p class="mt-3 text-4xl font-extrabold text-slate-900">{{ stats.totalArtisans }}</p>
					<p class="mt-3 text-sm leading-6 text-slate-600">Public visitors and clients can browse trusted local professionals.</p>
				</article>
				<article class="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Visible portfolio items</p>
					<p class="mt-3 text-4xl font-extrabold text-slate-900">{{ stats.totalPortfolioItems }}</p>
					<p class="mt-3 text-sm leading-6 text-slate-600">Any portfolio published by artisans can be surfaced on the home page.</p>
				</article>
				<article class="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Average trust</p>
					<p class="mt-3 text-4xl font-extrabold text-slate-900">{{ stats.trustScore }}</p>
					<p class="mt-3 text-sm leading-6 text-slate-600">Profiles, ratings, and reviews stay visible to help clients choose faster.</p>
				</article>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
			<div class="flex items-end justify-between gap-4">
				<div>
					<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Popular services</p>
					<h2 class="mt-2 text-3xl font-bold text-slate-900">Browse by service first</h2>
				</div>
				<RouterLink to="/services" class="text-sm font-semibold text-slate-700 hover:text-slate-900">
					See all services
				</RouterLink>
			</div>

			<div class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				<RouterLink
					v-for="service in topServices"
					:key="service.id"
					:to="{ path: '/artisans', query: { service: service.id } }"
					class="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg hover:ring-blue-200"
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<h3 class="text-xl font-bold text-slate-900">{{ service.name }}</h3>
							<p class="mt-2 text-sm leading-6 text-slate-600">{{ service.description || 'Browse artisans in this category.' }}</p>
						</div>
						<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
							{{ service.artisan_count || serviceCounts[service.id] || 0 }} artisan(s)
						</span>
					</div>
					<p class="mt-6 text-sm font-semibold text-slate-900">Browse professionals</p>
				</RouterLink>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
			<div class="flex items-end justify-between gap-4">
				<div>
					<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Recent artisan works</p>
					<h2 class="mt-2 text-3xl font-bold text-slate-900">Latest portfolio added by artisans</h2>
				</div>
				<RouterLink to="/artisans" class="text-sm font-semibold text-slate-700 hover:text-slate-900">
					Browse artisans
				</RouterLink>
			</div>

			<div v-if="loading" class="mt-6 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
				Loading home page...
			</div>
			<div v-else-if="error" class="mt-6 rounded-[2rem] bg-white p-6 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-100">
				{{ error }}
			</div>
			<div v-else-if="recentWorks.length" class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				<article
					v-for="work in recentWorks"
					:key="work.key"
					class="overflow-hidden rounded-[1.8rem] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
				>
					<div class="h-56 overflow-hidden bg-slate-200">
						<img
							v-if="work.image"
							:src="portfolioImage(work.image)"
							:alt="work.title"
							class="h-full w-full cursor-zoom-in object-cover"
							@click="openImage(work)"
						/>
						<div v-else class="flex h-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
							No image available
						</div>
					</div>

					<div class="p-5">
						<div class="flex items-start justify-between gap-4">
							<div>
								<h3 class="text-xl font-bold text-slate-900">{{ work.artisanName }}</h3>
								<p class="mt-1 text-sm text-slate-500">{{ work.category }}</p>
							</div>
							<span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
								{{ work.rating }}/5
							</span>
						</div>

						<ExpandableText :text="work.title" class="mt-4" />

						<div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
							<span class="text-xs font-medium text-slate-500">{{ work.commentsCount }} comments</span>
							<RouterLink :to="`/artisans/${work.artisanId}`" class="text-sm font-semibold text-slate-900 hover:text-blue-700">
								View artisan
							</RouterLink>
						</div>
					</div>
				</article>
			</div>
			<div v-else class="mt-6 rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
				<h3 class="text-2xl font-bold text-slate-900">No portfolio items yet</h3>
				<p class="mt-2 text-slate-600">Artisan portfolio will appear here as soon as they publish their projects.</p>
			</div>
		</section>

		<ImageLightbox
			:open="Boolean(activeImage)"
			:src="activeImage?.image ? portfolioImage(activeImage.image) : ''"
			:alt="activeImage?.title || 'Portfolio image'"
			:title="activeImage?.artisanName || ''"
			:description="activeImage?.title || ''"
			@close="activeImage = null"
		/>
	</main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { resolveAssetUrl } from '../../api';
import ExpandableText from '../../components/common/ExpandableText.vue';
import ImageLightbox from '../../components/common/ImageLightbox.vue';
import { fetchArtisans } from '../../services/artisanService';
import { fetchServices } from '../../services/serviceService';

const router = useRouter();

const loading = ref(false);
const error = ref('');
const artisans = ref([]);
const services = ref([]);
const activeImage = ref(null);

const searchForm = reactive({
	service: '',
	city: '',
	district: '',
});

const roleCards = [
	{
		title: 'Clients',
		description: 'Search artisans, send service requests, add reviews, and report problems.',
	},
	{
		title: 'Artisans',
		description: 'Create a profile, add portfolio items, and build trust with client ratings.',
	},
];

const topServices = computed(() => services.value.slice(0, 4));

const serviceCounts = computed(() => artisans.value.reduce((counts, artisan) => {
	(artisan.services ?? []).forEach((service) => {
		counts[service.id] = (counts[service.id] || 0) + 1;
	});

	return counts;
}, {}));

const stats = computed(() => ({
	totalArtisans: artisans.value.length,
	totalPortfolioItems: artisans.value.reduce((count, artisan) => count + ((artisan.portfolioItems ?? artisan.portfolio_items ?? []).length || 0), 0),
	trustScore: artisans.value.length
		? (artisans.value.reduce((sum, artisan) => sum + Number(artisan.average_rating || 0), 0) / artisans.value.length).toFixed(1)
		: '0.0',
}));

const portfolioImage = (path) => resolveAssetUrl(path);
const openImage = (work) => {
	activeImage.value = work;
};

const recentWorks = computed(() => {
	const works = artisans.value.flatMap((artisan) => (
		(artisan.portfolioItems ?? artisan.portfolio_items ?? []).map((item) => ({
			key: `${artisan.id}-${item.id}`,
			artisanId: artisan.id,
			artisanName: artisan.user?.name || 'Artisan',
			category: artisan.services?.[0]?.name || 'Portfolio',
			title: item.title || item.description || 'Portfolio item',
			image: item.image || item.photo || item.path || '',
			commentsCount: item.comments?.length || item.comments_count || 0,
			rating: Number(artisan.average_rating || 0).toFixed(1),
			createdAt: item.created_at || artisan.created_at || '',
		}))
	));

	return works
		.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
		.slice(0, 6);
});

const submitSearch = async () => {
	await router.push({
		path: '/artisans',
		query: {
			service: searchForm.service || undefined,
			city: searchForm.city || undefined,
			district: searchForm.district || undefined,
		},
	});
};

const loadHome = async () => {
	loading.value = true;
	error.value = '';

	try {
		const [artisanPage, serviceItems] = await Promise.all([
			fetchArtisans({ per_page: 8, include_portfolio_items: true }),
			fetchServices(),
		]);

		artisans.value = artisanPage.data ?? [];
		services.value = serviceItems ?? [];
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load home page content.';
		artisans.value = [];
		services.value = [];
	} finally {
		loading.value = false;
	}
};

onMounted(loadHome);
</script>
