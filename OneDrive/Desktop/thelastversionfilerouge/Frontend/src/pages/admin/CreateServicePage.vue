<template>
	<main class="min-h-screen bg-slate-50 text-slate-900">
		<section class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
			<div class="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
				<div class="mb-6">
					<h1 class="text-3xl font-bold">Create Service</h1>
					<p class="mt-2 text-slate-600">Add a new service category to the platform.</p>
				</div>

				<p v-if="error" class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

				<form class="space-y-6" @submit.prevent="handleSubmit">
					<div class="space-y-2">
						<label for="name" class="text-sm font-medium text-slate-700">Service Name</label>
						<input id="name" v-model.trim="form.name" type="text" required class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200" />
					</div>

					<div class="space-y-2">
						<label for="description" class="text-sm font-medium text-slate-700">Description</label>
						<textarea id="description" v-model="form.description" rows="5" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200" />
					</div>

					<div class="flex flex-wrap gap-3">
						<button type="submit" class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" :disabled="loading">
							{{ loading ? 'Saving...' : 'Save' }}
						</button>
						<RouterLink to="/admin/services" class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</RouterLink>
					</div>
				</form>
			</div>
		</section>
	</main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { createService } from '../../services/serviceService';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  description: '',
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    await createService(form);
    await router.push('/admin/services');
  } catch (caughtError) {
    error.value = caughtError?.response?.data?.message || 'Unable to create service.';
  } finally {
    loading.value = false;
  }
};
</script>
