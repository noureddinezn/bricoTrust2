<template>
	<ProfessionalPageShell
		eyebrow="Admin moderation"
		title="Pending Artisans"
		description="Review artisan profiles before allowing them to appear on the platform."
	>
		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Queue</p>
				<p class="mt-2 text-3xl font-extrabold text-slate-900">{{ artisans.length }}</p>
				<p class="mt-4 text-sm text-slate-600">Profiles waiting for approval.</p>
			</div>
		</template>

		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading pending artisans...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

		<div v-else-if="artisans.length" class="space-y-6">
			<div v-for="artisan in artisans" :key="artisan.id" class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div class="flex-1">
							<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div>
									<h2 class="text-2xl font-bold">{{ artisan.user?.name }}</h2>
									<p class="mt-1 text-sm text-gray-500">{{ artisan.user?.email }}</p>
									<p v-if="artisan.user?.phone" class="mt-1 text-sm text-gray-500">{{ artisan.user.phone }}</p>
								</div>

								<span class="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">{{ formatStatus(artisan.status) }}</span>
							</div>

							<div class="mt-6 grid gap-4 md:grid-cols-2">
								<div class="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
									<h3 class="text-sm font-semibold text-gray-900">Location</h3>
									<p class="mt-2 text-sm text-gray-600">{{ artisan.city }}, {{ artisan.district }}</p>
								</div>

								<div class="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
									<h3 class="text-sm font-semibold text-gray-900">Experience</h3>
									<p class="mt-2 text-sm text-gray-600">{{ artisan.experience_years }} years</p>
								</div>
							</div>

							<div class="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
								<h3 class="text-sm font-semibold text-gray-900">Bio</h3>
								<p class="mt-2 text-sm leading-6 text-gray-600">{{ artisan.bio || 'No bio provided.' }}</p>
							</div>

							<div class="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
								<h3 class="text-sm font-semibold text-gray-900">Services</h3>
								<div class="mt-3 flex flex-wrap gap-2">
									<span v-for="service in artisan.services" :key="service.id" class="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">{{ service.name }}</span>
									<span v-if="!artisan.services?.length" class="text-sm text-gray-500">No services selected.</span>
								</div>
							</div>
						</div>

						<div class="flex flex-col gap-3 lg:w-48">
							<button type="button" class="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700" :disabled="processing[artisan.id]" @click="approve(artisan)">{{ processing[artisan.id] === 'approve' ? 'Approving...' : 'Approve' }}</button>
							<button type="button" class="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700" :disabled="processing[artisan.id]" @click="ban(artisan)">{{ processing[artisan.id] === 'ban' ? 'Banning...' : 'Ban' }}</button>
						</div>
					</div>
				</div>
			</div>

		<div v-else class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">
				<h2 class="text-2xl font-bold text-gray-900">No pending artisans</h2>
				<p class="mt-2 text-gray-600">There are no artisan accounts waiting for review.</p>
			</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { approveArtisan, banArtisan, fetchPendingArtisans } from '../../services/adminService';

const loading = ref(true);
const error = ref('');
const artisans = ref([]);
const processing = reactive({});

const formatStatus = (status) => (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending');

const loadPendingArtisans = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchPendingArtisans({ per_page: 10 });
		artisans.value = payload.data ?? [];
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load pending artisans.';
	} finally {
		loading.value = false;
	}
};

const approve = async (artisan) => {
	processing[artisan.id] = 'approve';

	try {
		await approveArtisan(artisan.id);
		await loadPendingArtisans();
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to approve artisan.';
	} finally {
		processing[artisan.id] = '';
	}
};

const ban = async (artisan) => {
	if (!window.confirm('Are you sure you want to ban this artisan?')) {
		return;
	}

	processing[artisan.id] = 'ban';

	try {
		await banArtisan(artisan.id);
		await loadPendingArtisans();
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to ban artisan.';
	} finally {
		processing[artisan.id] = '';
	}
};

onMounted(loadPendingArtisans);
</script>
