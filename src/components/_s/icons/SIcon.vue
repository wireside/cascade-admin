<template>
	<span
		class="rounded-circle"
		:class="className"
		:style="styles"
	/>
</template>

<script setup>
	import { useColor } from "@/composables/color";
	import { toRef } from "vue";

	const props = defineProps({
		icon: {
			type: [String],
			required: true,
			default: null,
		},
		size: {
			type: [String, Number],
			default: "24",
		},
		color: {
			type: [String],
			default: "white",
		},
		// TODO: доработать
		inverse: {
			type: [Boolean],
			default: false,
		},
	});

	const styles = $computed(() => {
		const result = {
			fontSize: `${props.size}px`,
		};

		if (props.inverse) {
			result.background = "white";
		}

		result.color = hex.value;

		return result;
	});
	const className = $computed(() => {
		const result = {
			inverse: props.inverse,
		};

		result[`r-icon-${props.icon}`] = true;

		return result;
	});

	const hex = useColor(toRef(props, "color"));
</script>
