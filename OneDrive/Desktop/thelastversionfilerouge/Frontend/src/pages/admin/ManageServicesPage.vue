<template>
	<main class="min-h-screen bg-slate-50 text-slate-900">
		<section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 class="text-3xl font-bold tracking-tight text-slate-900">Services Administration</h1>
						<p class="mt-2 text-slate-600">Create, update, and manage service categories.</p>
					</div>

					<RouterLink to="/admin/services/create" class="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
						Add Service
					</RouterLink>
				</div>
			</div>

			<div v-if="loading" class="mt-8 rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-slate-200">Loading services...</div>
			<div v-else-if="error" class="mt-8 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

			<div v-else class="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
					<div class="overflow-hidden rounded-2xl border border-slate-100">
						<table class="w-full text-left text-sm">
							<thead class="bg-slate-50 text-slate-500">
								<tr>
									<th class="px-4 py-3">Name</th>
									<th class="px-4 py-3">Description</th>
									<th class="px-4 py-3 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="service in services" :key="service.id" class="border-t border-slate-100">
									<td class="px-4 py-4 font-semibold text-slate-900">{{ service.name }}</td>
									<td class="px-4 py-4 text-slate-600">{{ service.description || 'No description available.' }}</td>
									<td class="px-4 py-4">
										<div class="flex justify-center gap-2">
											<RouterLink :to="`/admin/services/${service.id}/edit`" class="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200">Edit</RouterLink>
											<button type="button" class="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100" @click="handleDelete(service)">Delete</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
					<h2 class="text-xl font-bold text-slate-900">Quick Notes</h2>
					<p class="mt-3 text-sm leading-6 text-slate-600">
						This panel mirrors the Blade admin view and uses frontend state for service management while the backend CRUD endpoints are still being added.
					</p>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { deleteService, fetchServices } from '../../services/serviceService';

const services = ref([]);
const loading = ref(true);
const error = ref('');

const loadServices = async () => {
  loading.value = true;
  error.value = '';

  try {
    services.value = await fetchServices();
  } catch (caughtError) {
    error.value = caughtError?.response?.data?.message || 'Unable to load services.';
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (service) => {
  if (!window.confirm(`Delete ${service.name}?`)) {
    return;
  }

  await deleteService(service.id);
  await loadServices();
};

onMounted(loadServices);
</script>
