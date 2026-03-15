<template>
	<ProfessionalPageShell
		eyebrow="Client marketplace"
		title="Job Posts"
		description="Browse client problem posts, or submit your own request if you are a client."
	>
		<template #actions>
			<RouterLink :to="postJobLink" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
				{{ postJobLabel }}
			</RouterLink>
			<RouterLink to="/artisans" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
				Browse Artisans
			</RouterLink>
		</template>

		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Open posts</p>
				<p class="mt-2 text-3xl font-extrabold text-slate-900">{{ jobPosts.length }}</p>
				<p class="mt-4 text-sm text-slate-600">Active public job requests.</p>
			</div>
		</template>

		<p v-if="message" class="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">{{ message }}</p>
		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading job posts...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>
		<div v-else-if="jobPosts.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			<article v-for="post in jobPosts" :key="post.id" class="group overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-2xl">
				<div v-if="post.image" class="relative h-56 bg-slate-200">
					<img :src="jobImage(post.image)" alt="Problem" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
				</div>
				<div v-else class="flex h-56 w-full items-center justify-center bg-linear-to-br from-slate-200 to-slate-300">
					<FontAwesomeIcon icon="screwdriver-wrench" class="text-4xl text-slate-400" />
				</div>

				<div class="flex h-full flex-col p-6">
					<div class="flex items-center justify-between gap-3">
						<span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide" :class="post.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'">
							{{ post.status }}
						</span>
						<span v-if="post.service" class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
							{{ post.service.name }}
						</span>
					</div>

					<h2 class="mt-4 text-xl font-bold tracking-tight text-slate-900 line-clamp-2">{{ post.title }}</h2>
					<p class="mt-2 text-sm font-medium text-slate-500">Posted by {{ post.client?.name || 'Client' }}</p>
					<p class="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{{ post.description }}</p>

					<div class="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
						<RouterLink :to="`/job-posts/${post.id}`" class="font-semibold text-slate-900 hover:underline">View details</RouterLink>
						<template v-if="canManage(post)">
							<div class="flex gap-2">
								<RouterLink :to="`/job-posts/${post.id}/edit`" class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" title="Edit"><FontAwesomeIcon icon="pen-to-square" /></RouterLink>
								<button type="button" class="rounded-2xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100" title="Delete" @click="handleDelete(post)"><FontAwesomeIcon icon="trash-can" /></button>
							</div>
						</template>
					</div>
				</div>
			</article>
		</div>
		<div v-else class="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xl">
			<FontAwesomeIcon icon="magnifying-glass" class="text-5xl text-slate-300" />
			<h2 class="mt-6 text-2xl font-bold text-slate-900">No job posts yet</h2>
			<p class="mt-2 text-slate-600">Clients haven't posted any public issues to solve yet.</p>
		</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { fetchCurrentUser, getUser, isAuthenticated, resolveAssetUrl } from '../../api';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { deleteJobPost, fetchJobPosts } from '../../services/jobPostService';

const loading = ref(true);
const error = ref('');
const message = ref('');
const jobPosts = ref([]);
const currentUser = ref(getUser());

const isClient = computed(() => isAuthenticated() && currentUser.value?.role === 'client');
const postJobLabel = computed(() => (isClient.value ? 'Post a Job' : 'Login to Post a Job'));
const postJobLink = computed(() => (isClient.value ? '/job-posts/create' : '/login?redirect=/job-posts/create'));

const jobImage = (path) => resolveAssetUrl(path);

const refreshCurrentUser = async () => {
	if (!isAuthenticated()) {
		return;
	}

	try {
		currentUser.value = await fetchCurrentUser();
	} catch {
		currentUser.value = getUser();
	}
};

const loadJobPosts = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchJobPosts({ per_page: 100 });
		jobPosts.value = payload.data ?? [];
	} catch (caughtError) {
		const status = caughtError?.response?.status;
		error.value = status === 404 || status === 500
			? 'Unable to load job posts right now. Please try again.'
			: caughtError?.response?.data?.message || 'Unable to load job posts.';
	} finally {
		loading.value = false;
	}
};

const canManage = (post) => Boolean(currentUser.value?.id === post.client_id);

const handleDelete = async (post) => {
	if (!window.confirm('Delete this job post?')) {
		return;
	}

	await deleteJobPost(post.id);
	message.value = 'Job post deleted successfully.';
	await loadJobPosts();
};

onMounted(async () => {
	await refreshCurrentUser();
	await loadJobPosts();
});
</script>
