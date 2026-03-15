<template>
	<ProfessionalPageShell
		eyebrow="Artisan dashboard"
		title="Incoming Service Requests"
		description="Review client requests, accept or reject new ones, then mark accepted work as completed."
	>
		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Open requests</p>
				<p class="mt-2 text-3xl font-extrabold text-slate-900">{{ serviceRequests.length }}</p>
				<p class="mt-4 text-sm text-slate-600">Requests waiting in your queue.</p>
			</div>
		</template>

		<div v-if="successMessage" class="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{{ successMessage }}</div>

		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading service requests...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

		<div v-else-if="serviceRequests.length" class="space-y-6">
			<div v-for="request in serviceRequests" :key="request.id" class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ request.service?.name }}</h2>
						<p class="mt-2 text-sm text-gray-600">Client: <span class="font-semibold text-gray-900">{{ request.client?.name }}</span></p>
						<p class="mt-1 text-sm text-gray-500">{{ request.client?.email }}</p>
						<p v-if="request.client?.phone" class="mt-1 text-sm text-gray-500">{{ request.client.phone }}</p>
					</div>

					<span class="inline-flex rounded-full px-4 py-2 text-sm font-semibold" :class="statusClasses[request.status] || 'bg-gray-100 text-gray-800'">{{ formatStatus(request.status) }}</span>
				</div>

				<div class="mt-6">
					<h3 class="text-sm font-semibold text-gray-900">Description</h3>
					<p class="mt-2 text-sm leading-6 text-gray-600">{{ request.description }}</p>
				</div>

				<div class="mt-6 grid gap-6 lg:grid-cols-2">
					<div class="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
						<h3 class="text-lg font-semibold">Request Actions</h3>
						<p class="mt-2 text-sm text-slate-600">{{ requestActionHelp(request.status) }}</p>

						<div class="mt-4 flex flex-wrap gap-3">
							<button
								v-if="request.status === 'pending'"
								type="button"
								class="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
								:disabled="statusLoading[request.id]"
								@click="submitStatus(request, 'accepted')"
							>
								{{ statusLoading[request.id] === 'accepted' ? 'Accepting...' : 'Accept Request' }}
							</button>

							<button
								v-if="request.status === 'pending'"
								type="button"
								class="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
								:disabled="statusLoading[request.id]"
								@click="submitStatus(request, 'cancelled')"
							>
								{{ statusLoading[request.id] === 'cancelled' ? 'Rejecting...' : 'Reject Request' }}
							</button>

							<button
								v-if="request.status === 'accepted'"
								type="button"
								class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
								:disabled="statusLoading[request.id]"
								@click="submitStatus(request, 'completed')"
							>
								{{ statusLoading[request.id] === 'completed' ? 'Completing...' : 'Mark Completed' }}
							</button>

							<button
								v-if="request.status === 'accepted'"
								type="button"
								class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
								:disabled="statusLoading[request.id]"
								@click="submitStatus(request, 'cancelled')"
							>
								{{ statusLoading[request.id] === 'cancelled' ? 'Cancelling...' : 'Cancel Request' }}
							</button>
						</div>

						<p v-if="statusErrors[request.id]" class="mt-4 text-sm text-red-600">{{ statusErrors[request.id] }}</p>
					</div>

					<div class="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
						<h3 class="text-lg font-semibold">Client Review</h3>
						<div v-if="request.review" class="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
							<div class="flex items-center justify-between">
								<span class="font-semibold">{{ request.review.client?.name || 'Client' }}</span>
								<span class="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"><FontAwesomeIcon icon="star" class="text-amber-400" /> {{ request.review.rating }}/5</span>
							</div>
							<p class="mt-2 text-sm text-gray-600">{{ request.review.comment || 'No comment provided.' }}</p>
						</div>
						<p v-else class="mt-4 text-sm text-gray-600">No review has been submitted for this request yet.</p>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">
			<h2 class="text-2xl font-bold text-gray-900">No requests yet</h2>
			<p class="mt-2 text-gray-600">You have not received any client requests yet.</p>
		</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { getUser } from '../../api';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { fetchArtisanServiceRequests, updateServiceRequestStatus } from '../../services/serviceRequestService';

const loading = ref(true);
const error = ref('');
const successMessage = ref('');
const serviceRequests = ref([]);
const statusLoading = reactive({});
const statusErrors = reactive({});

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

const requestActionHelp = (status) => {
	if (status === 'pending') {
		return 'This request is waiting for your answer.';
	}

	if (status === 'accepted') {
		return 'The request was accepted. Mark it as completed when the work is done.';
	}

	if (status === 'completed') {
		return 'This service request is finished.';
	}

	return 'This request is closed.';
};

const loadRequests = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchArtisanServiceRequests();
		serviceRequests.value = payload.serviceRequests?.data ?? [];
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.error || caughtError?.response?.data?.message || 'Unable to load service requests.';
	} finally {
		loading.value = false;
	}
};

const submitStatus = async (request, nextStatus) => {
	statusLoading[request.id] = nextStatus;
	statusErrors[request.id] = '';
	successMessage.value = '';

	try {
		const response = await updateServiceRequestStatus(request.id, { status: nextStatus });
		const updatedRequest = response?.serviceRequest;

		if (updatedRequest) {
			const requestIndex = serviceRequests.value.findIndex((item) => item.id === request.id);

			if (requestIndex !== -1) {
				serviceRequests.value[requestIndex] = {
					...serviceRequests.value[requestIndex],
					...updatedRequest,
				};
			}
		} else {
			request.status = nextStatus;
		}

		successMessage.value = 'Service request updated successfully.';
	} catch (caughtError) {
		statusErrors[request.id] = caughtError?.response?.data?.message || 'Unable to update status.';
	} finally {
		statusLoading[request.id] = '';
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
