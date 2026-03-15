<template>
	<div>
		<p class="text-sm leading-6 text-slate-600" :class="expanded ? '' : collapsedClass">
			{{ textToShow }}
		</p>
		<button
			v-if="shouldExpand"
			type="button"
			class="mt-2 text-sm font-semibold text-slate-900 transition hover:text-blue-700"
			@click="expanded = !expanded"
		>
			{{ expanded ? 'Show less' : 'Read more' }}
		</button>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	text: {
		type: String,
		default: '',
	},
	maxLength: {
		type: Number,
		default: 120,
	},
	collapsedClass: {
		type: String,
		default: 'line-clamp-2',
	},
});

const expanded = ref(false);
const normalizedText = computed(() => props.text || '');
const shouldExpand = computed(() => normalizedText.value.length > props.maxLength);
const textToShow = computed(() => normalizedText.value || 'No description available.');
</script>
