<template>
	<v-sheet
    :width 
    :height
		:class="`bg-${color}`"
    rounded="xl"
		class="s-switch bg-opacity-20 position-relative d-flex align-center cursor-pointer"
		@click.stop.prevent="onSwitch"
	>
		<v-avatar
			:size="circleSize"
			:density="null"
			:color
			:style="circleStyle"
			class="s-switch__circle position-relative"
		/>
	</v-sheet>
</template>

<script setup>
	const model = defineModel({ default: false });

	const props = defineProps({
		color: {
			type: String,
			default: "white",
		},
		width: {
			type: [Number, String],
			default: "32",
		},
		height: {
			type: [Number, String],
			default: "18",
		},
		circleSize: {
			type: [Number, String],
			default: "14",
		},
	});

	const circleStyle = $computed(() => ({
		left: model.value ? `${props.width - props.circleSize - 4}px` : 0,
	}));

	const onSwitch = () => {
		model.value = !model.value;
	};
</script>

<style scoped lang="scss">
	.s-switch {
		padding: 2px;

		&__circle {
			transition: left 0.3s cubic-bezier(0.25, 1.2, 0.5, 1);
		}
	}
</style>
