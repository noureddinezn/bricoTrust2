<template>
  <ProfessionalPageShell
    eyebrow="Admin dashboard"
    title="Manage artisans, users, reports, and platform services"
    description="A clean moderation workspace for the people running the platform."
  >
    <template #aside>
      <div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">System health</p>
            <p class="mt-2 text-3xl font-extrabold text-slate-900">{{ stats.pending_reports ?? 0 }}</p>
          </div>
          <FontAwesomeIcon icon="gear" class="text-4xl text-amber-500" />
        </div>
        <p class="mt-4 text-sm text-slate-600">Pending reports need moderation.</p>
      </div>
    </template>

    <div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading dashboard...</div>
    <div v-else-if="error" class="rounded-3xl bg-white p-6 text-sm font-medium text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

    <template v-else>
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="stat in statsCards" :key="stat.label" class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
          <h2 class="mt-3 text-4xl font-bold text-gray-900">{{ stat.value }}</h2>
        </div>
      </div>

      <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <RouterLink to="/admin/artisans/pending" class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-2xl">
          <h3 class="text-lg font-bold text-gray-900">Review Artisans</h3>
          <p class="mt-2 text-sm text-gray-600">Approve or ban artisan accounts.</p>
        </RouterLink>

        <RouterLink to="/admin/users" class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-2xl">
          <h3 class="text-lg font-bold text-gray-900">Manage Users</h3>
          <p class="mt-2 text-sm text-gray-600">See all registered platform users.</p>
        </RouterLink>

        <RouterLink to="/admin/reports" class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-2xl">
          <h3 class="text-lg font-bold text-gray-900">Review Reports</h3>
          <p class="mt-2 text-sm text-gray-600">Handle client reports and moderation.</p>
        </RouterLink>

        <RouterLink to="/admin/services" class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-2xl">
          <h3 class="text-lg font-bold text-gray-900">Manage Services</h3>
          <p class="mt-2 text-sm text-gray-600">Create, update, and remove services.</p>
        </RouterLink>
      </div>
    </template>
  </ProfessionalPageShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { fetchAdminDashboardStats } from '../../services/adminService';

const loading = ref(true);
const error = ref('');
const stats = ref({});

const statsCards = computed(() => ([
  { label: 'Total Users', value: stats.value.total_users ?? 0 },
  { label: 'Total Artisans', value: stats.value.total_artisans ?? 0 },
  { label: 'Pending Artisans', value: stats.value.pending_artisans ?? 0 },
  { label: 'Approved Artisans', value: stats.value.approved_artisans ?? 0 },
  { label: 'Banned Artisans', value: stats.value.banned_artisans ?? 0 },
  { label: 'Pending Reports', value: stats.value.pending_reports ?? 0 },
]));

const loadDashboard = async () => {
  loading.value = true;
  error.value = '';

  try {
    stats.value = await fetchAdminDashboardStats();
  } catch (caughtError) {
    error.value = caughtError?.response?.data?.message || 'Failed to load dashboard.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadDashboard);
</script>
