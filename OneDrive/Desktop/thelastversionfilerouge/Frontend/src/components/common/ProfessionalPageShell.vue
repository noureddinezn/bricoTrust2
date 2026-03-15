<template>
	<main class="min-h-screen bg-[#F0F4F8] text-gray-900">
		<section class="relative overflow-hidden bg-linear-to-b from-white to-[#E6EEF5] pt-16 pb-28">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
				<div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div>
						<p v-if="eyebrow" class="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
							{{ eyebrow }}
						</p>
						<h1 class="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#1a365d] sm:text-5xl">
							{{ title }}
						</h1>
						<p v-if="description" class="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
							{{ description }}
						</p>
						<div v-if="$slots.actions" class="mt-8 flex flex-wrap gap-3">
							<slot name="actions" />
						</div>
					</div>

					<div v-if="$slots.aside" class="hidden justify-self-end md:block">
						<slot name="aside" />
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto max-w-7xl px-4 -mt-20 pb-20 sm:px-6 lg:px-8 relative z-20">
			<slot />
		</section>
	</main>
</template>

<script setup>
defineProps({
	eyebrow: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: '',
	},
});
</script>
