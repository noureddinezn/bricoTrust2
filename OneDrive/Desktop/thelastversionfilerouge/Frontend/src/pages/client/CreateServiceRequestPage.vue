<template>
	<ProfessionalPageShell
		eyebrow="Client workflow"
		title="Create Service Request"
		description="Send a request to the artisan with a clean form and a summary card."
	>
		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Request target</p>
				<p class="mt-2 text-xl font-bold text-slate-900">{{ artisan?.user?.name || 'This artisan' }}</p>
				<p class="mt-3 text-sm text-slate-600">{{ artisan?.city }}, {{ artisan?.district }}</p>
			</div>
		</template>

		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading artisan details...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

		<div v-else class="grid gap-8 lg:grid-cols-3">
			<div class="lg:col-span-2 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
					<form class="space-y-6" @submit.prevent="handleSubmit">
						<div>
							<label for="service_id" class="mb-2 block text-sm font-medium text-gray-700">Choose Service</label>
							<select id="service_id" v-model="form.service_id" required class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900">
								<option value="">Select a service</option>
								<option v-for="service in artisanServices" :key="service.id" :value="service.id">{{ service.name }}</option>
							</select>
							<p v-if="validationErrors.service_id" class="mt-1 text-xs text-red-600">{{ validationErrors.service_id }}</p>
						</div>

						<div>
							<label for="description" class="mb-2 block text-sm font-medium text-gray-700">Request Description</label>
							<textarea id="description" v-model.trim="form.description" rows="6" required class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900" placeholder="Describe what you need..."></textarea>
							<p v-if="validationErrors.description" class="mt-1 text-xs text-red-600">{{ validationErrors.description }}</p>
						</div>

						<div class="flex flex-wrap gap-3">
							<button type="submit" class="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800" :disabled="saving">
								{{ saving ? 'Sending...' : 'Send Request' }}
							</button>

							<RouterLink :to="`/artisans/${artisan?.id}`" class="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</RouterLink>
						</div>
					</form>
				</div>

				<div class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
					<h2 class="text-xl font-bold">Artisan Summary</h2>
					<div class="mt-6 space-y-4 text-sm text-gray-700">
						<div class="flex items-center justify-between gap-4"><span>Name</span><span class="font-semibold text-right">{{ artisan?.user?.name }}</span></div>
						<div class="flex items-center justify-between gap-4"><span>Location</span><span class="font-semibold text-right">{{ artisan?.city }}, {{ artisan?.district }}</span></div>
						<div class="flex items-center justify-between gap-4"><span>Rating</span><span class="inline-flex items-center gap-2 font-semibold text-right"><FontAwesomeIcon icon="star" class="text-amber-400" /> {{ Number(artisan?.average_rating || 0).toFixed(1) }}</span></div>
						<div class="flex items-center justify-between gap-4"><span>Experience</span><span class="font-semibold text-right">{{ artisan?.experience_years }} years</span></div>
					</div>

					<div class="mt-6">
						<h3 class="mb-2 text-sm font-semibold text-gray-900">Available Services</h3>
						<div class="flex flex-wrap gap-2">
							<span v-for="service in artisanServices" :key="service.id" class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{{ service.name }}</span>
						</div>
					</div>
				</div>
		</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { getUser } from '../../api';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { createServiceRequest, fetchServiceRequestCreateData } from '../../services/serviceRequestService';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const artisan = ref(null);
const validationErrors = reactive({});

const form = reactive({
	service_id: '',
	description: '',
});

const artisanServices = computed(() => artisan.value?.services ?? []);

const clearValidation = () => {
	Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);
};

const loadData = async () => {
	loading.value = true;
	error.value = '';

	try {
		const currentUser = getUser();
		if (currentUser?.role !== 'client') {
			router.push('/login');
			return;
		}

		const payload = await fetchServiceRequestCreateData(route.params.id);
		artisan.value = payload.artisan;
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.error || caughtError?.response?.data?.message || 'Unable to load artisan details.';
	} finally {
		loading.value = false;
	}
};

const handleSubmit = async () => {
	clearValidation();
	saving.value = true;
	error.value = '';

	try {
		await createServiceRequest({
			artisan_id: artisan.value.id,
			service_id: form.service_id,
			description: form.description,
		});

		await router.push('/my-requests');
	} catch (caughtError) {
		const responseErrors = caughtError?.response?.data?.errors || {};
		Object.entries(responseErrors).forEach(([key, values]) => {
			validationErrors[key] = Array.isArray(values) ? values[0] : values;
		});
		error.value = caughtError?.response?.data?.message || caughtError?.response?.data?.error || 'Unable to create service request.';
	} finally {
		saving.value = false;
	}
};

onMounted(loadData);
</script>
