<template>
	<span
		:class="[`club-layout-wall--${kind}`, { 'club-layout-wall--compact': compact }]"
		:style="{ transform: `rotate(${rotation}deg)` }"
		class="club-layout-wall d-block position-relative w-100 h-100"
		aria-hidden="true"
	>
		<span class="club-layout-wall__horizontal position-absolute" />
		<span class="club-layout-wall__vertical position-absolute" />
	</span>
</template>

<script setup>
	const props = defineProps({
		kind: {
			type: String,
			required: true,
		},
		rotation: {
			type: Number,
			default: 0,
		},
		compact: {
			type: Boolean,
			default: false,
		},
	});

	const wallCollor = computed(() => (props.compact ? "#A1A1A1" : "#2b2b2b"));
</script>

<style scoped lang="scss">
	.club-layout-wall {
		--club-layout-wall-thickness: 14px;
		--club-layout-wall-half-thickness: 7px;

		transform-origin: center;

		&__horizontal,
		&__vertical {
			background-color: v-bind(wallCollor);
		}

		&__horizontal {
			top: calc(50% - var(--club-layout-wall-half-thickness));
			left: 0;
			width: 100%;
			height: var(--club-layout-wall-thickness);
		}

		&__vertical {
			top: 0;
			left: calc(50% - var(--club-layout-wall-half-thickness));
			width: var(--club-layout-wall-thickness);
			height: 100%;
		}

		&--straight &__vertical {
			display: none;
		}

		&--corner &__horizontal {
			left: calc(50% - var(--club-layout-wall-half-thickness));
			width: calc(50% + var(--club-layout-wall-half-thickness));
		}

		&--corner &__vertical {
			top: calc(50% - var(--club-layout-wall-half-thickness));
			height: calc(50% + var(--club-layout-wall-half-thickness));
		}

		&--t-junction &__vertical {
			top: calc(50% - var(--club-layout-wall-half-thickness));
			height: calc(50% + var(--club-layout-wall-half-thickness));
		}

		&--compact {
			--club-layout-wall-thickness: 2px;
			--club-layout-wall-half-thickness: 1px;
		}
	}
</style>
