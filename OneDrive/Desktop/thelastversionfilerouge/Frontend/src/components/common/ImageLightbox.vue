<template>
	<Teleport to="body">
		<div
			v-if="open"
			class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4"
			@click.self="$emit('close')"
		>
			<button
				type="button"
				class="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
				@click="$emit('close')"
			>
				Close
			</button>

			<div class="max-h-[92vh] max-w-6xl overflow-hidden rounded-[1.8rem] bg-white shadow-2xl">
				<img :src="src" :alt="alt" class="max-h-[80vh] w-full object-contain bg-slate-950" />
				<div v-if="title || description" class="p-5">
					<h3 v-if="title" class="text-xl font-bold text-slate-900">{{ title }}</h3>
					<p v-if="description" class="mt-2 text-sm leading-6 text-slate-600">{{ description }}</p>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { Teleport } from 'vue';

defineProps({
	open: {
		type: Boolean,
		default: false,
	},
	src: {
		type: String,
		default: '',
	},
	alt: {
		type: String,
		default: 'Preview image',
	},
	title: {
		type: String,
		default: '',
	},
	description: {
		type: String,
		default: '',
	},
});

defineEmits(['close']);
</script>
