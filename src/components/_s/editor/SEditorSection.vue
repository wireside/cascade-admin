<template>
	<section class="s-editor-section rounded-lg bg-white bg-opacity-2 text-white pa-5">
		<h2 class="s-editor-section__title text-white font-weight-medium mb-4 mt-0">{{ title }}</h2>
		<slot />
	</section>
</template>

<script setup>
	defineProps({
		title: {
			type: String,
			required: true,
		},
	});
</script>

<style scoped lang="scss">
	.s-editor-section__title {
		font-size: 14px;
		line-height: 125%;
	}
</style>
