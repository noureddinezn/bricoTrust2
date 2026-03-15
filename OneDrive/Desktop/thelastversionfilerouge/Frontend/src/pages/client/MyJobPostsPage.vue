<template>
	<main class="min-h-screen bg-gray-100 text-gray-900">
		<section class="mx-auto max-w-7xl px-6 py-10">
			<div class="mb-8 rounded-3xl bg-white p-8 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 class="text-3xl font-bold">My Job Posts</h1>
					<p class="mt-2 text-gray-600">Track the problems you submitted and manage them here.</p>
				</div>

				<RouterLink to="/job-posts/create" class="inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Add Job</RouterLink>
			</div>

			<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow">Loading your job posts...</div>
			<div v-else-if="error" class="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>
			<div v-else-if="jobPosts.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<article v-for="post in jobPosts" :key="post.id" class="overflow-hidden rounded-2xl bg-white shadow-lg flex flex-col">
					<div v-if="post.image" class="h-48 bg-gray-200">
						<img :src="jobImage(post.image)" alt="Problem" class="h-full w-full object-cover">
					</div>
					<div v-else class="flex h-48 items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
						<FontAwesomeIcon icon="screwdriver-wrench" class="text-4xl text-gray-400" />
					</div>

					<div class="p-5 flex-1 flex flex-col">
						<h2 class="text-xl font-bold text-gray-900">{{ post.title }}</h2>
						<p class="mt-2 text-sm text-gray-600 line-clamp-3">{{ post.description }}</p>
						<div class="mt-4 flex items-center justify-between">
							<span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide" :class="post.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">{{ post.status }}</span>
							<RouterLink :to="`/job-posts/${post.id}`" class="text-sm font-semibold text-blue-600 hover:underline">View</RouterLink>
						</div>
						<div class="mt-4 flex gap-2">
							<RouterLink :to="`/job-posts/${post.id}/edit`" class="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-100">Edit</RouterLink>
							<button type="button" class="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100" @click="handleDelete(post)">Delete</button>
						</div>
					</div>
				</article>
			</div>
			<div v-else class="rounded-3xl bg-white p-10 text-center shadow-lg">
				<h2 class="text-2xl font-bold text-gray-900">No job posts yet</h2>
				<p class="mt-2 text-gray-600">Create your first request to get quotes from artisans.</p>
			</div>
		</section>
	</main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { resolveAssetUrl } from '../../api';
import { deleteJobPost, fetchMyJobPosts } from '../../services/jobPostService';

const loading = ref(true);
const error = ref('');
const jobPosts = ref([]);

const jobImage = (path) => resolveAssetUrl(path);

const loadJobPosts = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchMyJobPosts({ per_page: 24 });
		jobPosts.value = payload.data ?? [];
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load your job posts.';
	} finally {
		loading.value = false;
	}
};

const handleDelete = async (post) => {
	if (!window.confirm('Delete this job post?')) {
		return;
	}

	await deleteJobPost(post.id);
	jobPosts.value = jobPosts.value.filter((item) => item.id !== post.id);
};

onMounted(loadJobPosts);
</script>
