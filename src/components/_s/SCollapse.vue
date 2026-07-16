<template>
	<div
		:class="{ 's-collapse--expanded': expanded }"
		:aria-hidden="!expanded"
		class="s-collapse"
	>
		<div
			:inert="!expanded"
			class="s-collapse__content"
		>
			<slot />
		</div>
	</div>
</template>

<script setup>
	defineProps({
		expanded: {
			type: Boolean,
			default: false,
		},
	});
</script>

<style scoped lang="scss">
	.s-collapse {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1);

		&--expanded {
			grid-template-rows: 1fr;
		}

		&__content {
			min-height: 0;
			overflow: hidden;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.s-collapse {
			transition: none;
		}
	}
</style>
