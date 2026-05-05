<template>
	<img
		class="r-svg-icon"
		:src="path"
		:alt="path"
		:style="styles"
	/>
</template>

<script setup>
	const props = defineProps({
		path: {
			type: [String],
			required: true,
			default: null,
		},
		size: {
			type: [String, Number],
			default: "24",
		},
		squared: {
			type: [Boolean],
			default: true,
		},
	});

	const styles = $computed(() => {
		return {
			height: `${props.size}px`,
			width: props.squared ? `${props.size}px` : undefined,
		};
	});
</script>
