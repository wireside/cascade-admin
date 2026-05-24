<template>
	<v-card
		class="s-finance-tile bg-opacity-5"
		:class="tone ? `bg-${tone}` : null"
		:style="style"
	>
		<div class="s-finance-tile__content position-relative d-flex ga-2 flex-column justify-center">
			<div class="d-flex ga-1 align-center">
				<s-smart-icon
					v-if="icon"
					:color="tone || badgeTone"
					:icon="icon"
					size="18"
				/>
				<span class="opacity-60 text-white">
					{{ label }}
				</span>
			</div>
			<div class="s-finance-tile__value position-relative text-white font-weight-bold">
				<span
					v-if="currency"
					class="s-finance-tile__currency position-relative font-weight-bold opacity-60 mr-1"
				>
					{{ currency }}
				</span>
				<span>{{ valueParts.integer }}</span>
				<span
					v-if="valueParts.fraction"
					class="opacity-60"
				>
					<span>.{{ valueParts.fraction }}</span>
				</span>
			</div>

			<span
				v-if="badge"
				:class="`bg-${badgeTone}`"
				:density="null"
				class="s-finance-tile__badge position-absolute top-0 right-0 font-weight-medium d-flex align-center justify-center"
			>
				{{ badge }}
			</span>
		</div>
	</v-card>
</template>

<script setup>
	const theme = useTheme();
	const props = defineProps({
		label: {
			type: String,
			required: true,
		},
		value: {
			type: [String, Number],
			required: true,
		},
		icon: {
			type: String,
			default: null,
		},
		tone: {
			type: String,
			default: "white",
		},
		badge: {
			type: [String, Number],
			default: null,
		},
		badgeTone: {
			type: String,
			default: "white",
		},
		currency: {
			type: String,
			default: "\u20BD",
		},
		iconSize: {
			type: [String, Number],
			default: 14,
		},
	});

	const style = $computed(() => ({
		"--tone-color": theme.current.value.colors[props.tone],
	}));

	const valueParts = $computed(() => {
		const [integer = "", fraction = ""] = String(props.value).split(".");

		return {
			integer,
			fraction,
		};
	});
</script>

<style lang="scss" scoped>
	.s-finance-tile {
		position: relative;
		overflow: hidden;
		padding: 10px 10px 12px 15px;
		height: 72px;
		border-radius: 10px;

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			padding: 0.5px;
			border-radius: inherit;
			pointer-events: none;
			background: linear-gradient(
				-72deg,
				var(--tone-color) 0%,
				rgba(17, 17, 17, 0.08) 25%,
				rgba(17, 17, 17, 0) 50%,
				rgba(17, 17, 17, 0.15) 75%,
				var(--tone-color) 100%
			);
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#000 0 0);
			mask-composite: exclude;
		}

		&__content {
			position: relative;
			z-index: 1;
			height: 100%;
		}

		&__value {
			font-size: 24px;
			line-height: 100%;
		}

		&__currency {
			font-size: 16px;
			line-height: 100%;
			bottom: 4px;
		}

		&__badge {
			font-size: 12px;
			min-width: 38px;
			min-height: 18px;
			border-radius: 5px;
		}
	}
</style>
