<template>
	<ProfessionalPageShell
		eyebrow="Admin moderation"
		title="Reports Management"
		description="Review client reports and resolve them from a calm moderation queue."
	>
		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Pending</p>
				<p class="mt-2 text-3xl font-extrabold text-slate-900">{{ reports.filter((report) => report.status === 'pending').length }}</p>
				<p class="mt-4 text-sm text-slate-600">Reports waiting for review.</p>
			</div>
		</template>

		<div v-if="successMessage" class="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{{ successMessage }}</div>

		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading reports...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

		<div v-else-if="reports.length" class="space-y-6">
			<div v-for="report in reports" :key="report.id" class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<h2 class="text-2xl font-bold">{{ report.reason }}</h2>
							<p class="mt-2 text-sm text-gray-600">Reported artisan: <span class="font-semibold text-gray-900">{{ report.artisan?.user?.name }}</span></p>
							<p class="mt-1 text-sm text-gray-600">Reporter: <span class="font-semibold text-gray-900">{{ report.reporter?.name }}</span></p>
							<p class="mt-1 text-sm text-gray-500">{{ report.reporter?.email }}</p>
						</div>

						<span class="inline-flex rounded-full px-4 py-2 text-sm font-semibold" :class="statusClasses[report.status] || 'bg-gray-100 text-gray-800'">{{ formatStatus(report.status) }}</span>
					</div>

					<div class="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
						<h3 class="text-sm font-semibold text-gray-900">Description</h3>
						<p class="mt-2 text-sm leading-6 text-gray-600">{{ report.description || 'No description provided.' }}</p>
					</div>

					<div class="mt-6 flex flex-wrap items-center justify-between gap-4">
						<p class="text-xs text-gray-400">Created at: {{ formatDate(report.created_at) }}</p>
						<button v-if="report.status === 'pending'" type="button" class="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800" :disabled="resolving[report.id]" @click="resolve(report)">{{ resolving[report.id] ? 'Resolving...' : 'Mark as Resolved' }}</button>
						<span v-else class="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">Already Resolved</span>
					</div>
				</div>
			</div>

		<div v-else class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">
				<h2 class="text-2xl font-bold text-gray-900">No reports found</h2>
				<p class="mt-2 text-gray-600">There are no reports to manage right now.</p>
			</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { fetchReports, resolveReport } from '../../services/reportService';

const loading = ref(true);
const error = ref('');
const successMessage = ref('');
const reports = ref([]);
const resolving = reactive({});

const statusClasses = {
	pending: 'bg-yellow-100 text-yellow-800',
	resolved: 'bg-green-100 text-green-800',
};

const formatStatus = (status) => (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown');
const formatDate = (value) => (value ? new Date(value).toLocaleString() : '');

const loadReports = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchReports({ per_page: 10 });
		reports.value = payload.data?.data ?? [];
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load reports.';
	} finally {
		loading.value = false;
	}
};

const resolve = async (report) => {
	resolving[report.id] = true;
	successMessage.value = '';

	try {
		await resolveReport(report.id);
		successMessage.value = 'Report resolved successfully.';
		await loadReports();
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to resolve report.';
	} finally {
		resolving[report.id] = false;
	}
};

onMounted(loadReports);
</script>
