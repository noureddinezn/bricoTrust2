<template>
	<main class="min-h-screen bg-[#eef2f7] text-slate-900">
		<section class="border-b border-slate-200/70 bg-gradient-to-b from-white to-[#e8f0f8]">
			<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
				<div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div>
						<p class="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm ring-1 ring-slate-200">
							Professional portfolio
						</p>
						<h1 class="mt-6 text-4xl font-extrabold tracking-tight text-[#1f4477] sm:text-5xl">{{ artisanName }}'s Portfolio</h1>
						<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
							Showcase artisan work, public project images, and client feedback in one place.
						</p>
						<div class="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
							<span class="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">{{ artisan?.city || 'Unknown city' }}, {{ artisan?.district || 'Unknown district' }}</span>
							<span class="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">{{ portfolioItems.length }} items</span>
							<span class="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">{{ artisanPrimaryService }}</span>
						</div>
						<div class="mt-8 flex flex-wrap gap-3">
							<RouterLink v-if="isOwner" to="/portfolio/create" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
								Add Portfolio Item
							</RouterLink>
							<RouterLink to="/artisans" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
								Back to artisans
							</RouterLink>
						</div>
					</div>

					<div class="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
						<p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Public visibility</p>
						<p class="mt-3 text-sm leading-7 text-slate-600">
							Portfolio items can appear on the home page even for regular visitors who are not logged in.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<p v-if="message" class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
				{{ message }}
			</p>

			<div v-if="loading && !portfolioItems.length" class="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">Loading portfolio...</div>
			<div v-else-if="error && !portfolioItems.length" class="rounded-[2rem] bg-white p-6 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-100">{{ error }}</div>

			<div v-else-if="portfolioItems.length" class="space-y-4">
				<div v-if="loading" class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
					Kayt7adeto portfolio... العناصر الحالية باقي باينة.
				</div>

				<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				<article v-for="item in portfolioItems" :key="item.id" class="overflow-hidden rounded-[1.8rem] bg-white shadow-sm ring-1 ring-slate-200">
					<div class="relative h-56 overflow-hidden bg-slate-100">
						<img
							v-if="item.image"
							:src="portfolioImage(item.image)"
							:alt="item.title"
							class="h-full w-full cursor-zoom-in object-cover"
							@click="openImage(item)"
						/>
						<div v-else class="flex h-full items-center justify-center text-sm font-medium text-slate-500">No image available</div>
					</div>

					<div class="p-6">
						<div class="flex items-start justify-between gap-3">
							<div>
								<h2 class="text-xl font-bold text-slate-900">{{ item.title }}</h2>
								<p class="mt-1 text-sm text-slate-500">{{ artisanPrimaryService }}</p>
							</div>
							<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Portfolio</span>
						</div>

						<div class="mt-4">
							<ExpandableText :text="item.description || 'No description added yet.'" :max-length="140" />
						</div>

						<div class="mt-6 border-t border-slate-100 pt-4">
							<div class="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
								<span>Client feedback</span>
								<span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{{ item.comments?.length || 0 }}</span>
							</div>

							<div v-if="item.comments?.length" class="space-y-3 max-h-40 overflow-y-auto pr-1">
								<div v-for="comment in item.comments" :key="comment.id" class="rounded-2xl bg-slate-50 p-4 text-sm">
									<div class="flex items-center justify-between gap-3">
										<span class="font-semibold text-slate-800">{{ comment.client?.name || 'Client' }}</span>
										<span v-if="comment.rating" class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600"><FontAwesomeIcon icon="star" /> {{ comment.rating }}</span>
									</div>
									<div class="mt-2">
										<ExpandableText :text="comment.comment" :max-length="120" collapsed-class="line-clamp-3" />
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

							<div v-if="canEditItems" class="mt-5 flex gap-3">
								<RouterLink :to="`/portfolio/${item.id}/edit`" class="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
									Edit
								</RouterLink>
								<button type="button" class="flex-1 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700" @click="handleDelete(item)">
									Delete
								</button>
							</div>
						</div>
					</div>
				</article>
				</div>
			</div>

			<div v-else class="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
				<h2 class="text-2xl font-bold text-slate-900">No portfolio items yet</h2>
				<p class="mt-2 text-slate-600">Create your first item to start showing clients your work.</p>
				<div v-if="isOwner" class="mt-6">
					<RouterLink to="/portfolio/create" class="inline-flex items-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
						Add Your First Item
					</RouterLink>
				</div>
			</div>

			<ImageLightbox
				:open="Boolean(activeImage)"
				:src="activeImage?.image ? portfolioImage(activeImage.image) : ''"
				:alt="activeImage?.title || 'Portfolio image'"
				:title="activeImage?.title || ''"
				:description="activeImage?.description || ''"
				@close="activeImage = null"
			/>
		</section>
	</main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getUser, isAuthenticated, resolveAssetUrl } from '../../api';
import ExpandableText from '../../components/common/ExpandableText.vue';
import ImageLightbox from '../../components/common/ImageLightbox.vue';
import { addPortfolioComment, deletePortfolioItem, fetchArtisanPortfolio } from '../../services/portfolioService';

const route = useRoute();
const artisan = ref(null);
const portfolioItems = ref([]);
const loading = ref(true);
const error = ref('');
const message = ref('');
const commentForms = reactive({});
const currentUser = getUser();
const activeImage = ref(null);

const artisanName = computed(() => artisan.value?.user?.name || 'Artisan');
const artisanPrimaryService = computed(() => artisan.value?.services?.[0]?.name || 'Portfolio');
const canEditItems = computed(() => Boolean(currentUser?.role === 'artisan' && currentUser?.artisan?.id && artisan.value?.id && Number(currentUser.artisan.id) === Number(artisan.value.id)));
const isOwner = computed(() => canEditItems.value);
const viewerIsLoggedIn = computed(() => isAuthenticated());
const viewerIsClient = computed(() => currentUser?.role === 'client');

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

const clientComments = (item) => (item.comments ?? []).filter((comment) => String(comment.client_id || comment.client?.id) === String(currentUser?.id));
const hasClientRating = (item) => clientComments(item).some((comment) => comment.rating !== null && comment.rating !== undefined);
const clientRatingValue = (item) => clientComments(item).find((comment) => comment.rating !== null && comment.rating !== undefined)?.rating ?? '';

const loadPortfolio = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchArtisanPortfolio(route.params.id);
		artisan.value = payload.artisan;
		portfolioItems.value = payload.portfolio_items?.data ?? payload.portfolio_items ?? [];
		portfolioItems.value.forEach((item) => ensureCommentForm(item.id));
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load portfolio.';
	} finally {
		loading.value = false;
	}
};

const handleDelete = async (item) => {
	if (!window.confirm('Delete this portfolio item permanently?')) {
		return;
	}

	await deletePortfolioItem(item.id);
	portfolioItems.value = portfolioItems.value.filter((portfolioItem) => portfolioItem.id !== item.id);
	message.value = 'Portfolio item deleted successfully.';
};

const submitComment = async (item) => {
	const form = ensureCommentForm(item.id);
	form.error = '';

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

onMounted(loadPortfolio);
</script>
