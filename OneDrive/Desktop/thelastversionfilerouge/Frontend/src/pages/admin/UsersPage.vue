<template>
	<ProfessionalPageShell
		eyebrow="Admin directory"
		title="Users Management"
		description="View all users and their current roles on the platform."
	>
		<template #aside>
			<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
				<p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Users</p>
				<p class="mt-2 text-3xl font-extrabold text-slate-900">{{ users.length }}</p>
				<p class="mt-4 text-sm text-slate-600">Accounts currently loaded.</p>
			</div>
		</template>

		<div v-if="loading" class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">Loading users...</div>
		<div v-else-if="error" class="rounded-3xl bg-white px-4 py-3 text-sm text-red-700 shadow-xl ring-1 ring-red-100">{{ error }}</div>

		<div v-else-if="users.length" class="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">User</th>
								<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
								<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</th>
								<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
								<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Artisan Status</th>
								<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Joined At</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							<tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
								<td class="px-6 py-4">
									<div class="font-semibold text-gray-900">{{ user.name }}</div>
								</td>
								<td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
								<td class="px-6 py-4 text-sm text-gray-600">{{ user.phone || '—' }}</td>
								<td class="px-6 py-4">
									<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="roleClasses[user.role] || 'bg-gray-200 text-gray-800'">{{ formatRole(user.role) }}</span>
								</td>
								<td class="px-6 py-4">
									<span v-if="user.artisan" class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="artisanStatusClasses[user.artisan.status] || 'bg-gray-100 text-gray-700'">{{ formatStatus(user.artisan.status) }}</span>
									<span v-else class="text-sm text-gray-400">—</span>
								</td>
								<td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(user.created_at) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

		<div v-else class="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-100">
				<h2 class="text-2xl font-bold text-gray-900">No users found</h2>
				<p class="mt-2 text-gray-600">There are no users in the system yet.</p>
			</div>
	</ProfessionalPageShell>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ProfessionalPageShell from '../../components/common/ProfessionalPageShell.vue';
import { fetchUsers } from '../../services/adminService';

const loading = ref(true);
const error = ref('');
const users = ref([]);

const roleClasses = {
	client: 'bg-blue-100 text-blue-800',
	artisan: 'bg-purple-100 text-purple-800',
	admin: 'bg-gray-200 text-gray-800',
};

const artisanStatusClasses = {
	pending: 'bg-yellow-100 text-yellow-800',
	approved: 'bg-green-100 text-green-800',
	banned: 'bg-red-100 text-red-800',
};

const formatRole = (role) => (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown');
const formatStatus = (status) => (status ? status.charAt(0).toUpperCase() + status.slice(1) : '—');
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');

const loadUsers = async () => {
	loading.value = true;
	error.value = '';

	try {
		const payload = await fetchUsers({ per_page: 10 });
		users.value = payload.data ?? [];
	} catch (caughtError) {
		error.value = caughtError?.response?.data?.message || 'Unable to load users.';
	} finally {
		loading.value = false;
	}
};

onMounted(loadUsers);
</script>
