<template>
	<span
		:class="[
			`club-layout-wall--${kind}`,
			{
				'club-layout-wall--joined': joined,
			},
		]"
		:style="{ transform: `rotate(${rotation}deg)` }"
		class="club-layout-wall d-block position-relative w-100 h-100"
		aria-hidden="true"
	>
		<span
			:class="wallPartClasses('horizontal')"
			class="club-layout-wall__horizontal position-absolute bg-wall"
		/>
		<span
			:class="wallPartClasses('vertical')"
			class="club-layout-wall__vertical position-absolute bg-wall"
		/>
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
		joined: {
			type: Boolean,
			default: false,
		},
	});

	const wallPartClasses = (part) => {
		if (props.joined) return "rounded-0";
		if (props.kind === "corner" && part === "horizontal") return "rounded-s-0 rounded-e-sm";
		if (["corner", "t-junction"].includes(props.kind) && part === "vertical") return "rounded-t-0 rounded-b-sm";
		return "rounded-sm";
	};
</script>

<style scoped lang="scss">
	.club-layout-wall {
		transform-origin: center;

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
			left: calc(50% - 3px);
			width: calc(50% + 3px);
		}

		&--corner &__vertical {
			top: calc(50% - 3px);
			height: calc(50% + 3px);
		}

		&--t-junction &__vertical {
			top: calc(50% - 3px);
			height: calc(50% + 3px);
		}

		&--joined {
			top: calc((var(--club-layout-grid-half-gap, 2px) + 1px) * -1);
			left: calc((var(--club-layout-grid-half-gap, 2px) + 1px) * -1);
			width: calc(100% + var(--club-layout-grid-gap, 4px) + 2px);
			height: calc(100% + var(--club-layout-grid-gap, 4px) + 2px);
		}
	}
</style>
