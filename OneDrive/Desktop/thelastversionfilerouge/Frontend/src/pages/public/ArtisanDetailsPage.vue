<template>
	<main class="min-h-screen bg-[#F0F4F8] text-gray-900">
		<div class="relative overflow-hidden bg-linear-to-b from-white to-[#E6EEF5] pt-16 pb-28">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
				<div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div>
						<p class="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
							Professional artisan profile
						</p>
						<h1 class="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#1a365d] sm:text-5xl">
							A polished profile for trusted work, reviews, and portfolio items
						</h1>
						<p class="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
							Review location, services, rating, portfolio work, and client feedback in one professional view.
						</p>
						<div class="mt-8 flex flex-wrap gap-3">
							<RouterLink to="/artisans" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
								Back to artisans
							</RouterLink>
							<RouterLink to="/leaderboard" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
								View leaderboard
							</RouterLink>
						</div>
					</div>

					<div class="hidden justify-self-end text-[10rem] text-yellow-500 opacity-20 md:block">
						<FontAwesomeIcon icon="trophy" class="text-[10rem] text-yellow-500" />
					</div>
				</div>
			</div>
		</div>

		<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-20">
			<div v-if="loading && !artisan" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading artisan profile...</div>

			<div v-else-if="error && !artisan" class="rounded-3xl bg-white p-6 text-sm font-medium text-red-700 shadow-xl ring-1 ring-red-100">
				{{ error }}
			</div>

			<div v-else-if="artisan" class="space-y-4">
				<div v-if="message" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
					{{ message }}
				</div>
				<div v-if="loading" class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
					Kayt7adeto profile... المعلومات الحالية باقي باينة.
				</div>

				<div class="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
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
									<h1 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">{{ artisan.user?.name }}</h1>
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
								<span class="mt-1 flex items-center justify-center gap-2 text-2xl font-bold text-gray-900"><FontAwesomeIcon icon="star" class="text-amber-400" /> {{ Number(artisan.average_rating || 0).toFixed(1) }}</span>
							</div>
						</div>

						<div class="mt-8">
							<h2 class="text-lg font-semibold text-gray-900">About</h2>
							<p class="mt-2 leading-7 text-gray-600">{{ artisan.bio || 'No bio available.' }}</p>
						</div>
					</section>

					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h2 class="text-2xl font-bold text-gray-900">Portfolio</h2>
						<div v-if="portfolioItems.length" class="mt-6 grid gap-6 md:grid-cols-2">
							<article v-for="item in portfolioItems" :key="item.id" class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
								<img
									v-if="item.image || item.photo || item.path"
									:src="portfolioImage(item.image || item.photo || item.path)"
									:alt="item.title || 'Portfolio item'"
									class="h-56 w-full cursor-zoom-in object-cover"
									@click="openImage(item)"
								/>
								<div class="p-5">
									<h3 class="text-lg font-semibold text-gray-900">{{ item.title || 'Portfolio item' }}</h3>
									<div class="mt-2">
										<ExpandableText :text="item.description || 'No description available.'" />
									</div>

									<div class="mt-5 border-t border-slate-100 pt-4">
										<div class="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
											<span>Client feedback</span>
											<span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{{ item.comments?.length || 0 }}</span>
										</div>

										<div v-if="item.comments?.length" class="space-y-3 max-h-52 overflow-y-auto pr-1">
											<div v-for="comment in item.comments" :key="comment.id" class="rounded-2xl bg-slate-50 p-4 text-sm">
												<div class="flex items-center justify-between gap-3">
													<span class="font-semibold text-slate-800">{{ comment.client?.name || 'Client' }}</span>
													<span v-if="comment.rating" class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600"><FontAwesomeIcon icon="star" /> {{ comment.rating }}</span>
												</div>
												<div class="mt-2">
													<ExpandableText :text="comment.comment || 'No comment provided.'" :max-length="120" collapsed-class="line-clamp-3" />
												</div>
											</div>
										</div>
										<p v-else class="text-sm text-slate-500">No comments yet.</p>

										<div v-if="viewerIsClient" class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<p class="text-sm font-semibold text-slate-900">Leave a comment</p>
											<p class="mt-1 text-xs text-slate-500">You can add multiple comments. Rating is allowed once per client for this portfolio post.</p>
											<div class="mt-4 space-y-3">
												<div>
													<p class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rating</p>
													<div class="flex items-center gap-2">
														<button
															v-for="rating in [1, 2, 3, 4, 5]"
															:key="rating"
															type="button"
															class="text-2xl transition"
															:disabled="hasClientRating(item)"
															:class="hasClientRating(item) ? 'cursor-not-allowed text-slate-200' : Number(commentForms[item.id].rating || 0) >= rating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'"
															@click="!hasClientRating(item) && (commentForms[item.id].rating = rating)"
														>
															<FontAwesomeIcon icon="star" />
														</button>
														<button
															v-if="commentForms[item.id].rating && !hasClientRating(item)"
															type="button"
															class="ml-2 rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white"
															@click="commentForms[item.id].rating = ''"
														>
															Clear
														</button>
													</div>
													<p class="mt-2 text-xs" :class="hasClientRating(item) ? 'font-medium text-emerald-600' : 'text-slate-500'">
														{{ hasClientRating(item) ? `You already rated this post with ${clientRatingValue(item)} / 5.` : (commentForms[item.id].rating ? `${commentForms[item.id].rating} / 5 stars` : 'Choose stars if you want to add your one-time rating.') }}
													</p>
												</div>

												<textarea
													v-model.trim="commentForms[item.id].comment"
													rows="3"
													class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
													placeholder="Write your feedback about this work"
												/>

												<p v-if="commentForms[item.id].error" class="text-xs font-medium text-red-600">{{ commentForms[item.id].error }}</p>

												<div class="flex justify-end">
													<button
														type="button"
														class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
														:disabled="commentForms[item.id].saving"
														@click="submitComment(item)"
													>
														{{ commentForms[item.id].saving ? 'Sending...' : 'Send comment' }}
													</button>
												</div>
											</div>
										</div>
										<RouterLink v-else-if="!viewerIsLoggedIn" to="/login" class="mt-4 inline-flex text-sm font-semibold text-slate-900 hover:underline">
											Login as client to comment and rate
										</RouterLink>
									</div>
								</div>
							</article>
						</div>
						<p v-else class="mt-4 text-gray-600">No portfolio items yet.</p>
					</section>

					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h2 class="text-2xl font-bold text-gray-900">Client Reviews</h2>
						<div v-if="reviews.length" class="mt-6 space-y-4">
							<div v-for="review in reviews" :key="review.id" class="rounded-2xl border border-gray-200 p-5">
								<div class="flex items-center justify-between gap-4">
									<h3 class="font-semibold text-gray-900">{{ review.client?.name || 'Client' }}</h3>
									<span class="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"><FontAwesomeIcon icon="star" class="text-amber-400" /> {{ review.rating }}/5</span>
								</div>
								<div class="mt-2">
									<ExpandableText :text="review.comment || 'No comment provided.'" :max-length="140" />
								</div>
							</div>
						</div>
						<p v-else class="mt-4 text-gray-600">No reviews yet.</p>
					</section>
				</div>

				<aside class="space-y-8">
					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h2 class="text-xl font-bold text-gray-900">Contact Info</h2>
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
						<h2 class="text-xl font-bold text-gray-900">Profile Summary</h2>
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
								<span
									class="rounded-md px-2 py-0.5 font-bold capitalize"
									:class="artisan.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'"
								>
									{{ artisan.status }}
								</span>
							</div>
						</div>
					</section>

					<section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
						<h2 class="text-xl font-bold text-gray-900">Need this artisan?</h2>
						<p class="mt-2 text-sm text-gray-600">Open the portfolio, leave feedback, or send a service request once you're logged in as a client.</p>
						<div class="mt-5 flex flex-wrap gap-3">
							<RouterLink :to="`/artisans/${artisan.id}/portfolio`" class="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
								View full portfolio
							</RouterLink>
							<RouterLink v-if="canRequestService" :to="`/service-requests/create/${artisan.id}`" class="inline-flex rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
							Request Service
							</RouterLink>
							<RouterLink v-else to="/login" class="inline-flex rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
							Login
							</RouterLink>
						</div>
					</section>
				</aside>
				</div>
			</div>

			<ImageLightbox
				:open="Boolean(activeImage)"
				:src="activeImage?.image || activeImage?.photo || activeImage?.path ? portfolioImage(activeImage.image || activeImage.photo || activeImage.path) : ''"
				:alt="activeImage?.title || 'Portfolio image'"
				:title="activeImage?.title || ''"
				:description="activeImage?.description || ''"
				@close="activeImage = null"
			/>
		</main>
	</main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getUser, isAuthenticated, resolveAssetUrl } from '../../api';
import ExpandableText from '../../components/common/ExpandableText.vue';
import ImageLightbox from '../../components/common/ImageLightbox.vue';
import { addPortfolioComment } from '../../services/portfolioService';
import { useArtisanDetails } from '../../composables/useArtisans';

const route = useRoute();
const { artisan, loading, error, loadArtisan } = useArtisanDetails(route.params.id);
const activeImage = ref(null);
const message = ref('');
const commentForms = reactive({});

const artisanInitial = computed(() => (artisan.value?.user?.name ? artisan.value.user.name.charAt(0).toUpperCase() : 'A'));
const portfolioItems = computed(() => artisan.value?.portfolioItems ?? []);
const reviews = computed(() => artisan.value?.serviceRequests?.map((request) => request.review).filter(Boolean) ?? []);
const joinedAt = computed(() => (artisan.value?.created_at ? new Date(artisan.value.created_at).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'));
const currentUser = computed(() => getUser());
const canRequestService = computed(() => isAuthenticated() && currentUser.value?.role === 'client');
const viewerIsLoggedIn = computed(() => isAuthenticated());
const viewerIsClient = computed(() => currentUser.value?.role === 'client');

const artisanImage = (path) => resolveAssetUrl(path);
const portfolioImage = (path) => resolveAssetUrl(path);
const openImage = (item) => {
	activeImage.value = item;
};

const ensureCommentForm = (itemId) => {
	if (!commentForms[itemId]) {
		commentForms[itemId] = {
			comment: '',
			rating: '',
			saving: false,
			error: '',
		};
	}

	return commentForms[itemId];
};

const clientComments = (item) => (item.comments ?? []).filter((comment) => String(comment.client_id || comment.client?.id) === String(currentUser.value?.id));
const hasClientRating = (item) => clientComments(item).some((comment) => comment.rating !== null && comment.rating !== undefined);
const clientRatingValue = (item) => clientComments(item).find((comment) => comment.rating !== null && comment.rating !== undefined)?.rating ?? '';

const loadPage = async () => {
	await loadArtisan();
	portfolioItems.value.forEach((item) => ensureCommentForm(item.id));
};

const submitComment = async (item) => {
	const form = ensureCommentForm(item.id);
	form.error = '';
	message.value = '';

	if (!form.comment) {
		form.error = 'Comment is required.';
		return;
	}

	form.saving = true;

	try {
		const createdComment = await addPortfolioComment(item.id, {
			comment: form.comment,
			rating: form.rating || undefined,
		});

		item.comments = [...(item.comments ?? []), createdComment];
		form.comment = '';
		form.rating = '';
		message.value = 'Comment added successfully.';
	} catch (caughtError) {
		form.error = caughtError?.response?.data?.message || 'Unable to add comment.';
	} finally {
		form.saving = false;
	}
};

onMounted(loadPage);
</script>
