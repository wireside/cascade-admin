<template>
	<v-tooltip
		activator="parent"
		location="top"
		class="s-tooltip"
	>
		<div
			class="rounded"
			:class="[`text-${color}`, `bg-${background}`, `pa-${padding}`, border ? 'border' : '']"
		>
			<slot />
		</div>
	</v-tooltip>
</template>

<script setup>
	const props = defineProps({
		background: {
			type: String,
			default: "background",
		},
		color: {
			type: String,
			default: "white",
		},
		padding: {
			type: [String, Number],
			default: 2,
		},
		border: {
			type: Boolean,
			default: true,
		},
	});
</script>

<style lang="scss" scoped>
	.s-tooltip {
		& > :deep(.v-overlay__content) {
			padding: 0;
			background: none;
		}
	}
</style>
