<template>
	<section class="game-editor-section rounded-lg bg-white bg-opacity-2 text-white pa-5">
		<h2 class="game-editor-section__title text-white font-weight-bold mb-4 mt-0">{{ title }}</h2>
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
	.game-editor-section {
		&__title {
			line-height: 120%;
		}
	}
</style>
