<template>
	<main class="min-h-screen bg-[#F0F4F8] text-gray-900">
		<section class="relative overflow-hidden bg-linear-to-b from-white to-[#E6EEF5] pt-16 pb-28">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
				<div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div>
						<p class="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Edit information</p>
						<h1 class="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#1a365d] sm:text-5xl">Edit Artisan Profile</h1>
						<p class="mt-4 max-w-2xl text-lg leading-8 text-gray-600">Update your profile information, services, and portfolio branding.</p>
					</div>
					<div class="hidden justify-self-end opacity-20 md:block">
						<FontAwesomeIcon icon="screwdriver-wrench" class="text-[10rem] text-blue-500" />
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-4xl px-4 -mt-20 pb-20 sm:px-6 lg:px-8 relative z-20">
			<div class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">

			<div v-if="loading" class="py-10 text-center text-slate-600">Loading profile data...</div>

			<div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
				{{ error }}
			</div>

			<template v-else-if="artisan">
				<div class="mb-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
					Current status:
					<span class="font-semibold capitalize">{{ artisan.status }}</span>
				</div>

				<p v-if="success" class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
					{{ success }}
				</p>

				<ul v-if="validationErrors.length" class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					<li v-for="item in validationErrors" :key="item">{{ item }}</li>
				</ul>

				<form class="space-y-6" @submit.prevent="saveProfile">
					<div>
						<label for="phone" class="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
						<input
							id="phone"
							v-model.trim="form.phone"
							type="text"
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						/>
					</div>

					<div class="grid gap-6 md:grid-cols-2">
						<div>
							<label for="city" class="mb-2 block text-sm font-medium text-slate-700">City</label>
							<input
								id="city"
								v-model.trim="form.city"
								type="text"
								required
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
							/>
						</div>

						<div>
							<label for="district" class="mb-2 block text-sm font-medium text-slate-700">District</label>
							<input
								id="district"
								v-model.trim="form.district"
								type="text"
								required
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
							/>
						</div>
					</div>

					<div>
						<label for="experience_years" class="mb-2 block text-sm font-medium text-slate-700">Experience Years</label>
						<input
							id="experience_years"
							v-model.number="form.experience_years"
							type="number"
							min="0"
							required
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						/>
					</div>

					<div>
						<label for="profile_image" class="mb-2 block text-sm font-semibold text-slate-700">Profile Photo</label>

						<div v-if="currentPhotoPreview || profileImagePreview" class="mb-4 space-y-3">
							<div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
								<img
									:src="profileImagePreview || currentPhotoPreview"
									alt="Profile preview"
									class="h-16 w-16 rounded-xl object-cover"
								/>
								<div class="flex-1">
									<p class="text-xs font-medium text-slate-500">{{ profileImagePreview ? 'New photo selected' : 'Current photo' }}</p>
									<button type="button" class="text-xs font-medium text-slate-900 hover:underline" @click="clearProfileImage">
										Remove
									</button>
								</div>
							</div>
						</div>

						<label for="profile_image" class="cursor-pointer">
							<div
								class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
								@dragenter.prevent
								@dragover.prevent
								@drop.prevent="handleDrop"
							>
								<FontAwesomeIcon icon="image" class="text-2xl text-slate-500" />
								<p class="mt-2 text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
								<p class="mt-1 text-xs text-slate-500">JPG, PNG (max 5MB)</p>
							</div>
						</label>

						<input id="profile_image" type="file" accept="image/jpg,image/jpeg,image/png" class="hidden" @change="handleFileChange" />
					</div>

					<div>
						<label for="bio" class="mb-2 block text-sm font-medium text-slate-700">Bio</label>
						<textarea
							id="bio"
							v-model="form.bio"
							rows="5"
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
						/>
					</div>

					<div>
						<label class="mb-2 block text-sm font-medium text-slate-700">Services</label>
						<div class="grid gap-3 sm:grid-cols-2">
							<label
								v-for="service in services"
								:key="service.id"
								class="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"
							>
								<input
									type="checkbox"
									:value="service.id"
									v-model="form.services"
									class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
								/>
								<span class="text-sm text-slate-700">{{ service.name }}</span>
							</label>
						</div>
					</div>

					<button
						type="submit"
						class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
						:disabled="saving"
					>
						{{ saving ? 'Saving...' : 'Save Changes' }}
					</button>
				</form>
			</template>
			</div>
		</section>
	</main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useArtisanEditor } from '../../composables/useArtisans';

const {
	artisan,
	services,
	loading,
	saving,
	error,
	success,
	validationErrors,
	form,
	currentPhotoPreview,
	profileImagePreview,
	loadEditorData,
	setProfileImage,
	clearProfileImage,
	saveProfile,
} = useArtisanEditor();

const handleFileChange = (event) => {
	const [file] = event.target.files || [];
	setProfileImage(file || null);
};

const handleDrop = (event) => {
	const [file] = event.dataTransfer.files || [];
	setProfileImage(file || null);
};

onMounted(loadEditorData);
</script>
