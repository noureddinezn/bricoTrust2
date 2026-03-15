<template>
	<ProfessionalPageShell
		eyebrow="Client dashboard"
		title="My Service Requests"
		description="Track your requests, their status, and leave reviews when work is completed."
	>
		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Activity</p>
				<p class="mt-2 text-3xl font-extrabold text-slate-900">{{ serviceRequests.length }}</p>
				<p class="mt-4 text-sm text-slate-600">Requests in your account.</p>
			</div>
		</template>

		<div v-if="successMessage" class="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{{ successMessage }}</div>

		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading your service requests...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

		<div v-else-if="serviceRequests.length" class="space-y-6">
			<div v-for="request in serviceRequests" :key="request.id" class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<h2 class="text-2xl font-bold">{{ request.service?.name }}</h2>
							<p class="mt-2 text-sm text-gray-600">
								Artisan:
								<RouterLink :to="`/artisans/${request.artisan?.id}`" class="font-semibold text-gray-900 hover:underline">{{ request.artisan?.user?.name }}</RouterLink>
							</p>
							<p class="mt-1 text-sm text-gray-500">{{ request.artisan?.city }}, {{ request.artisan?.district }}</p>
						</div>

						<span class="inline-flex rounded-full px-4 py-2 text-sm font-semibold" :class="statusClasses[request.status] || 'bg-gray-100 text-gray-800'">{{ formatStatus(request.status) }}</span>
					</div>

					<div class="mt-6">
						<h3 class="text-sm font-semibold text-gray-900">Description</h3>
						<p class="mt-2 text-sm leading-6 text-gray-600">{{ request.description }}</p>
					</div>

					<div class="mt-6 grid gap-6 lg:grid-cols-2">
						<div class="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
							<h3 class="text-lg font-semibold">Review</h3>

							<div v-if="request.review" class="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
								<div class="flex items-center justify-between"><span class="font-semibold">Your rating</span><span class="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"><FontAwesomeIcon icon="star" class="text-amber-400" /> {{ request.review.rating }}/5</span></div>
								<p class="mt-2 text-sm text-gray-600">{{ request.review.comment || 'No comment provided.' }}</p>
							</div>
							<form v-else-if="request.status === 'completed'" class="mt-4 space-y-4" @submit.prevent="submitReview(request)">
								<div>
									<label :for="`rating-${request.id}`" class="mb-2 block text-sm font-medium text-gray-700">Rating</label>
									<select :id="`rating-${request.id}`" v-model="reviewForms[request.id].rating" required class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900">
										<option value="">Choose rating</option>
										<option v-for="value in [1, 2, 3, 4, 5]" :key="value" :value="String(value)">{{ value }}</option>
									</select>
								</div>

								<div>
									<label :for="`comment-${request.id}`" class="mb-2 block text-sm font-medium text-gray-700">Comment</label>
									<textarea :id="`comment-${request.id}`" v-model="reviewForms[request.id].comment" rows="4" class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900" placeholder="Write your feedback..."></textarea>
								</div>

								<p v-if="reviewForms[request.id].error" class="text-sm text-red-600">{{ reviewForms[request.id].error }}</p>

								<button type="submit" class="rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800" :disabled="reviewForms[request.id].loading">{{ reviewForms[request.id].loading ? 'Submitting...' : 'Submit Review' }}</button>
							</form>
							<p v-else class="mt-4 text-sm text-gray-600">You can review this request only after it is completed.</p>
						</div>

						<div class="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
							<h3 class="text-lg font-semibold">Report</h3>
							<p class="mt-2 text-sm text-gray-600">Report a problem if needed.</p>

							<form class="mt-4 space-y-4" @submit.prevent="submitReport(request)">
								<div>
									<label :for="`reason-${request.id}`" class="mb-2 block text-sm font-medium text-gray-700">Reason</label>
									<input :id="`reason-${request.id}`" v-model.trim="reportForms[request.id].reason" type="text" class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900" placeholder="Enter reason">
								</div>

								<div>
									<label :for="`report-description-${request.id}`" class="mb-2 block text-sm font-medium text-gray-700">Description</label>
									<textarea :id="`report-description-${request.id}`" v-model="reportForms[request.id].description" rows="4" class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900" placeholder="Describe the issue..."></textarea>
								</div>

								<p v-if="reportForms[request.id].error" class="text-sm text-red-600">{{ reportForms[request.id].error }}</p>

								<button type="submit" class="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700" :disabled="reportForms[request.id].loading">{{ reportForms[request.id].loading ? 'Sending...' : 'Send Report' }}</button>
							</form>
						</div>
					</div>
				</div>
			</div>

		<div v-else class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">
				<h2 class="text-2xl font-bold text-gray-900">No service requests yet</h2>
				<p class="mt-2 text-gray-600">Start by browsing artisans and sending your first request.</p>
				<RouterLink to="/artisans" class="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">Explore Artisans</RouterLink>
			</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { getUser } from '../../api';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { createReport } from '../../services/reportService';
import { createReview } from '../../services/reviewService';
import { fetchClientServiceRequests } from '../../services/serviceRequestService';

const loading = ref(true);
const error = ref('');
const successMessage = ref('');
const serviceRequests = ref([]);
const reviewForms = reactive({});
const reportForms = reactive({});

const statusClasses = {
	pending: 'bg-yellow-100 text-yellow-800',
	accepted: 'bg-blue-100 text-blue-800',
	completed: 'bg-green-100 text-green-800',
	cancelled: 'bg-red-100 text-red-800',
};

const formatStatus = (status) => {
	if (status === 'cancelled') {
		return 'Rejected / Cancelled';
	}

	return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
};

const ensureFormState = (request) => {
	if (!reviewForms[request.id]) {
		reviewForms[request.id] = { rating: '', comment: '', loading: false, error: '' };
	}

	if (!reportForms[request.id]) {
		reportForms[request.id] = { reason: '', description: '', loading: false, error: '' };
	}
};

const loadRequests = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchClientServiceRequests();
		serviceRequests.value = payload.serviceRequests?.data ?? [];
		serviceRequests.value.forEach(ensureFormState);
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.error || caughtError?.response?.data?.message || 'Unable to load your service requests.';
	} finally {
		loading.value = false;
	}
};

const submitReview = async (request) => {
	const form = reviewForms[request.id];
	form.loading = true;
	form.error = '';
	successMessage.value = '';

	try {
		const response = await createReview({
			service_request_id: request.id,
			rating: form.rating,
			comment: form.comment,
		});

		request.review = response?.data?.review || {
			rating: Number(form.rating),
			comment: form.comment,
		};
		form.rating = '';
		form.comment = '';
		successMessage.value = 'Review submitted successfully.';
	} catch (caughtError) {
		form.error = caughtError?.response?.data?.message || 'Unable to submit review.';
	} finally {
		form.loading = false;
	}
};

const submitReport = async (request) => {
	const form = reportForms[request.id];
	form.loading = true;
	form.error = '';
	successMessage.value = '';

	try {
		await createReport({
			artisan_id: request.artisan_id,
			reason: form.reason,
			description: form.description,
		});
		form.reason = '';
		form.description = '';
		successMessage.value = 'Report submitted successfully.';
	} catch (caughtError) {
		form.error = caughtError?.response?.data?.message || 'Unable to submit report.';
	} finally {
		form.loading = false;
	}
};

onMounted(() => {
	const currentUser = getUser();
	if (!currentUser) {
		return;
	}

	loadRequests();
});
</script>
