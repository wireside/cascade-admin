<template>
	<section class="game-editor-section rounded-lg bg-white bg-opacity-2 text-white pa-4">
		<h2 class="game-editor-section__title text-white font-weight-bold mb-4">{{ title }}</h2>
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

<style scoped>
	.game-editor-section__title {
		line-height: 120%;
	}
</style>
