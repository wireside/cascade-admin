<template>
	<span
		:class="[`club-layout-wall--${kind}`, { 'club-layout-wall--preview': preview }]"
		:style="{ transform: `rotate(${rotation}deg)` }"
		class="club-layout-wall d-block position-relative"
		aria-hidden="true"
	>
		<span class="club-layout-wall__horizontal position-absolute" />
		<span class="club-layout-wall__vertical position-absolute" />
	</span>
</template>

<script setup>
	defineProps({
		kind: {
			type: String,
			required: true,
		},
		rotation: {
			type: Number,
			default: 0,
		},
		preview: {
			type: Boolean,
			default: false,
		},
	});
</script>

<style scoped lang="scss">
	.club-layout-wall {
		width: 100%;
		height: 100%;
		color: rgb(var(--v-theme-content-secondary));
		transform-origin: center;

		&__horizontal,
		&__vertical {
			border-radius: 2px;
			background: currentColor;
			opacity: 0.32;
		}

		&__horizontal {
			top: calc(50% - 3px);
			left: 0;
			width: 100%;
			height: 6px;
		}

		&__vertical {
			top: 0;
			left: calc(50% - 3px);
			width: 6px;
			height: 100%;
		}

		&--straight &__vertical {
			display: none;
		}

		&--corner &__horizontal {
			left: 50%;
			width: 50%;
		}

		&--corner &__vertical {
			top: 50%;
			height: 50%;
		}

		&--t-junction &__vertical {
			top: 50%;
			height: 50%;
		}

		&--preview &__horizontal,
		&--preview &__vertical {
			opacity: 0.72;
		}
	}
</style>
