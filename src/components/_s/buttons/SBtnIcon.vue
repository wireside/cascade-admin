<template>
	<v-btn
		class="s-btn-icon"
		:height="46"
		:class="{'rounded-circle': !squared}"
		:color="bgColor"
		:variant="variant"
	>
		<div :style="{ 'height': `${size}px`, 'width': `${size}px` }">
			<s-smart-icon
				:color="color"
				:icon="icon"
				:size="size"
			/>
		</div>
		<s-tooltip v-if="title">
			{{ title }}
		</s-tooltip>
	</v-btn>
</template>

<script setup>
	const props = defineProps({
		color: {
			type: String,
			default: "white",
		},
		bgColor: {
			type: String,
			default: "disabled bg-opacity-10",
		},
		icon: {
			type: String,
			required: true,
		},
		variant: {
			type: String,
			default: "flat",
		},
		title: {
			type: String,
			default: undefined,
		},
		size: {
			type: Number,
			default: 20,
		},
		sound: {
			type: Boolean,
			default: true,
		},
		squared: {
			type: Boolean,
			default: true,
		},
	});
</script>
