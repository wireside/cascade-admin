<template>
	<v-sheet
		elevation="8"
		class="club-layout-zoom d-inline-flex align-center pa-1 bg-white bg-opacity-5"
	>
		<v-btn
			:disabled="model <= min"
			icon="mdi-minus"
			variant="text"
			color="secondary"
			size="32"
			title="Уменьшить масштаб"
			@click="changeZoom(-props.step)"
		/>
		<v-sheet
			width="56"
			color="transparent"
			class="text-center text-body-2 text-white"
		>
			{{ model }}%
		</v-sheet>
		<v-btn
			:disabled="model >= max"
			icon="mdi-plus"
			variant="text"
			color="secondary"
			size="32"
			title="Увеличить масштаб"
			@click="changeZoom(props.step)"
		/>
	</v-sheet>
</template>

<script setup>
	const model = defineModel({
		type: Number,
		default: 100,
	});

	const props = defineProps({
		min: {
			type: Number,
			default: 50,
		},
		max: {
			type: Number,
			default: 150,
		},
		step: {
			type: Number,
			default: 10,
		},
	});

	const changeZoom = (delta) => {
		model.value = Math.min(props.max, Math.max(props.min, model.value + delta));
	};
</script>

<style lang="scss">
	.club-layout-zoom {
		border-radius: 10px;
	}
</style>
