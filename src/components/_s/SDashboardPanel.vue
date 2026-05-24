<template>
	<div
		class="s-dashboard-panel bg-surface"
		:style="panelStyle"
	>
		<header
			v-if="title"
			class="d-flex ga-4 align-center justify-space-between mb-4 flex-md-wrap"
		>
			<div class="s-dashboard-panel__title d-inline-flex align-center ga-2 font-weight-medium">
				<v-icon
					v-if="icon"
					:icon="icon"
					size="18"
				/>
				<span>{{ title }}</span>
			</div>
			<slot name="header-action" />
		</header>

		<slot />
	</div>
</template>

<script setup>
	const props = defineProps({
		title: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			default: null,
		},
		width: {
			type: [String, Number],
			default: null,
		},
	});

	const panelStyle = computed(() => {
		if (props.width == null || props.width === "") {
			return null;
		}

		return {
			width: "100%",
			minWidth: `${props.width}px`,
		};
	});
</script>

<style lang="scss">
	.s-dashboard-panel {
		position: relative;
		overflow: hidden;
		border-radius: 18px;
		padding: 25px;

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			padding: 1px;
			border-radius: inherit;
			pointer-events: none;
			background: linear-gradient(
				to right,
				rgba(255, 255, 255, 0.15) 0%,
				rgba(255, 255, 255, 0) 50%,
				rgba(255, 255, 255, 0.15) 100%
			);
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#000 0 0);
			mask-composite: exclude;
		}

		&__title {
			font-size: 20px;
		}
	}
</style>
