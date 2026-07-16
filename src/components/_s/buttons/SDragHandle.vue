<template>
	<v-btn
		icon
		variant="flat"
		:color="color"
		:size="size"
		rounded="md"
		draggable="true"
		data-drag-handle
		class="s-drag-handle text-white"
	>
		<v-icon
			icon="mdi-arrow-expand-all"
			size="16"
			class="mdi-rotate-45 opacity-50"
		/>
	</v-btn>
</template>

<script setup>
	defineProps({
		color: {
			type: String,
			default: "white",
		},
		size: {
			type: [Number, String],
			default: 34,
		},
	});
</script>

<style scoped lang="scss">
	.s-drag-handle {
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
</style>
