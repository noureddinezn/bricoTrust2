<template>
	<ProfessionalPageShell
		eyebrow="Job post details"
		title="Project briefing and discussion"
		description="Read the request, inspect the image, and follow the conversation around the job."
	>
		<template #actions>
			<RouterLink to="/job-posts" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Back to job posts</RouterLink>
		</template>

		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Comments</p>
				<p class="mt-2 text-3xl font-extrabold text-slate-900">{{ comments.length }}</p>
				<p class="mt-4 text-sm text-slate-600">Discussion and proposals on this post.</p>
			</div>
		</template>

		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading job post...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>
		<div v-else-if="jobPost" class="space-y-8">
			<div class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
				<div class="flex items-start justify-between gap-6">
					<div>
						<div class="flex flex-wrap items-center gap-3 mb-2">
							<h1 class="text-3xl font-bold text-slate-900">{{ jobPost.title }}</h1>
							<span v-if="jobPost.service" class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 tracking-wide flex items-center gap-1 mt-1">{{ jobPost.service.name }}</span>
						</div>
						<p class="mt-2 text-sm text-slate-500">Posted by <span class="font-bold text-slate-900">{{ jobPost.client?.name || 'Unknown Client' }}</span> • {{ formattedDate }}</p>
					</div>

					<template v-if="canManage">
						<div class="flex gap-2">
							<RouterLink :to="`/job-posts/${jobPost.id}/edit`" class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Edit</RouterLink>
							<button type="button" class="rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100" @click="handleDelete">Delete</button>
						</div>
					</template>
				</div>

				<div v-if="jobPost.image" class="mt-6 overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200">
					<img :src="jobImage(jobPost.image)" alt="Issue related image" class="w-full object-contain cursor-pointer transition-transform hover:scale-105" style="max-height: 500px;" @click="openImageModal(jobImage(jobPost.image))">
				</div>

				<p class="mt-6 whitespace-pre-wrap text-lg leading-relaxed text-slate-700">{{ jobPost.description }}</p>
			</div>

			<div class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
				<h2 class="mb-6 text-2xl font-bold text-slate-900">Discussion & Proposals</h2>
				<div class="space-y-6">
					<div v-for="comment in comments" :key="comment.id" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
						<div class="flex items-center justify-between gap-4">
							<h4 class="font-bold text-slate-900">{{ comment.user?.name || 'Unknown User' }}</h4>
							<span class="text-xs text-slate-500">{{ new Date(comment.created_at).toLocaleString() }}</span>
						</div>
						<p class="mt-2 text-sm text-slate-700">{{ comment.comment }}</p>
					</div>
					<p v-if="!comments.length" class="text-slate-500 italic">No one has commented on this job post yet. Be the first!</p>
				</div>

				<div v-if="canComment" class="mt-8 border-t border-slate-200 pt-8 space-y-4">
					<label for="comment" class="mb-2 block text-sm font-medium text-slate-700">Add a comment / Send proposal</label>
					<textarea id="comment" v-model="commentForm.comment" rows="4" required class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" placeholder="Provide more details or offer a solution..."></textarea>
					<button type="button" class="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800" :disabled="commentLoading" @click="handleComment">{{ commentLoading ? 'Submitting...' : 'Submit Comment' }}</button>
				</div>
				<div v-else class="mt-8 border-t border-slate-200 pt-8 text-center">
					<p class="mb-4 text-slate-600">Log in to leave a comment or propose a solution.</p>
					<RouterLink to="/login" class="inline-block rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">Login to Comment</RouterLink>
				</div>
			</div>
		</div>
		<div v-else class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">
			<h2 class="text-2xl font-bold text-slate-900">Job post not found</h2>
			<p class="mt-2 text-slate-600">The requested post is unavailable.</p>
		</div>

		<div v-if="modalImageSrc" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" @click.self="closeImageModal">
			<button type="button" class="absolute right-6 top-4 text-4xl text-white hover:text-gray-300" @click="closeImageModal">&times;</button>
			<img :src="modalImageSrc" alt="Full size image" class="max-h-full max-w-full rounded-2xl object-contain shadow-2xl">
		</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { getUser, isAuthenticated, resolveAssetUrl } from '../../api';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { addJobPostComment, deleteJobPost, fetchJobPost } from '../../services/jobPostService';

const route = useRoute();
const router = useRouter();
const jobPost = ref(null);
const loading = ref(true);
const error = ref('');
const commentLoading = ref(false);
const modalImageSrc = ref('');

const currentUser = getUser();
const comments = computed(() => jobPost.value?.comments ?? []);
const canManage = computed(() => Boolean(currentUser && jobPost.value && currentUser.id === jobPost.value.client_id));
const canComment = computed(() => isAuthenticated());
const formattedDate = computed(() => (jobPost.value?.created_at ? new Date(jobPost.value.created_at).toLocaleString() : ''));

const commentForm = reactive({ comment: '' });
const jobImage = (path) => resolveAssetUrl(path);

const loadJobPost = async () => {
	loading.value = true;
	error.value = '';

	try {
		jobPost.value = await fetchJobPost(route.params.id);
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load job post.';
	} finally {
		loading.value = false;
	}
};

const handleDelete = async () => {
	if (!window.confirm('Are you sure you want to delete this job post?')) {
		return;
	}

	await deleteJobPost(jobPost.value.id);
	await router.push('/job-posts');
};

const handleComment = async () => {
	if (!commentForm.comment.trim()) {
		error.value = 'Comment is required.';
		return;
	}

	commentLoading.value = true;
	error.value = '';

	try {
		const createdComment = await addJobPostComment(jobPost.value.id, { comment: commentForm.comment.trim() });
		jobPost.value = {
			...jobPost.value,
			comments: [...(jobPost.value?.comments ?? []), createdComment],
		};
		commentForm.comment = '';
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to submit comment.';
	} finally {
		commentLoading.value = false;
	}
};

const openImageModal = (src) => {
	modalImageSrc.value = src;
	document.getElementById('imageModal')?.classList.remove('hidden');
	document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
	document.getElementById('imageModal')?.classList.add('hidden');
	document.body.style.overflow = 'auto';
};

onMounted(loadJobPost);
</script>
