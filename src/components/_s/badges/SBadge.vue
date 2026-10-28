<template>
	<span
		:style
		class="s-badge position-relative d-inline-flex align-center"
	>
		<div
			:style="underlayStyle"
			class="s-badge__underlay position-absolute top-0 right-0 left-0 bottom-0"
		/>
		<span class="s-badge__content position-relative">
			<slot v-bind="props">
				{{ label }}
			</slot>
		</span>
	</span>
</template>

<script setup>
	const props = defineProps({
		label: {
			type: [String, Number],
		},
		tone: {
			type: String,
			default: "secondary",
		},
		bgOpacity: {
			type: [String, Number],
			default: 20,
		},
	});

	const theme = useTheme();
	const resolvedColor = $computed(() => theme.current.value.colors[props.tone] || props.tone);

	const style = $computed(() => ({
		color: resolvedColor,
	}));

	const underlayStyle = $computed(() => ({
		backgroundColor: resolvedColor,
		opacity: props.bgOpacity / 100,
	}));
</script>

<style scoped lang="scss">
	.s-badge {
		padding: 4px 8px;
		line-height: 16px;
		font-size: 12px;
		font-weight: 600;
		border-radius: 6px;

		&__underlay {
			border-radius: inherit;
		}
	}
</style>
